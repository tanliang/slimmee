/* @noflow */

import React, {
  Component,
  PropTypes
} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Text
} from 'react-native';
import {
  Cell,
  CustomCell,
  Section,
  TableView
} from 'react-native-tableview-simple';
import {
  nativeHistory
} from 'react-router-native';
import {
  decode_html_entity
} from '../index';
import styles from '../styles';
import ModelMessage from '../../model/Message';
import ModelExplore from '../../model/Explore';
import ModelRecord from '../../model/Record';
import ModelMisc from '../../model/Misc';
import Toast from 'react-native-root-toast';

export class Loading extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.record = new ModelRecord();
    this.misc = new ModelMisc();
    this.state = {
      retry: 0
    };
  }

  componentDidMount() {
    this.updateList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateList(newProps);
  }

  updateList(props) {
    const token = this.misc.getCache('cfg_token');
    if (token == '') {
      nativeHistory.replace('/login')
    } else {
      if (this.misc.getCache('cfg_weight') == '') {
        this.misc.sync(this.handleUser.bind(this), 'user/get/');
        Toast.show("正在获取用户信息", {
          position: Toast.positions.CENTER
        });
      } else {
        this.handleUser({
          success: 1
        });
      }
    }
  }

  handleUser(responseJson) {
    if (responseJson.success == 0) {
      if (this.state.retry < 3) {
        this.misc.sync(this.handleUser.bind(this), 'user/get/');
        Toast.show("重新获取用户信息", {
          position: Toast.positions.CENTER
        });
        this.setState({
          retry: this.state.retry + 1
        });
      } else {
        Toast.show(responseJson.data, {
          position: Toast.positions.CENTER
        });
      }
    } else {
      if (responseJson.data != undefined) {
        for (let idx in responseJson.data) {
          this.misc.setCache('cfg_' + idx, responseJson.data[idx]);
        }
      }

      this.setState({
        retry: 0
      });
      const record_get = this.misc.getCache('cfg_record_get');
      if (record_get != '1' && this.misc.getCache('cfg_weight') != '') {
        this.misc.sync(this.handleRecord.bind(this), 'record/get/', {}, true, 15000);
        Toast.show("正在获取用户记录", {
          position: Toast.positions.CENTER
        });
      } else {
        this.handleRecord({
          success: 1
        });
      }

    }
  }

  handleRecord(responseJson) {
    if (responseJson.success == 0) {
      if (this.state.retry < 3) {
        this.misc.sync(this.handleRecord.bind(this), 'record/get/', {}, true, 15000);
        Toast.show("重新获取用户记录", {
          position: Toast.positions.CENTER
        });
        this.setState({
          retry: this.state.retry + 1
        });
      } else {
        Toast.show(responseJson.data, {
          position: Toast.positions.CENTER
        });
      }
    } else {
      this.misc.setCache('cfg_record_get', '1');
      if (responseJson.data != undefined) {
        for (let idx in responseJson.data) {
          let item = responseJson.data[idx];
          item.sync = 1;
          this.record.add(item);
        }
      }

      this.sync = this.record.raw().filtered('upd = 0');
      if (this.sync.length > 0) {
        this.misc.sync(this.handleSync.bind(this), 'record/sync/', {
          data: this.sync
        });
        Toast.show("正在同步用户记录", {
          position: Toast.positions.CENTER
        });
      } else {
        this.handleSync({
          success: 0
        });
      }
    }
  }

  handleSync(responseJson) {
    if (responseJson.success == 1) {
      this.record.upd(this.sync);
    }
    const article_upd = this.misc.getCache('cfg_article_upd');
    this.misc.sync(this.handleMessage.bind(this), 'message/latest/', {article_upd});
  }
  
  handleMessage(responseJson) {
    if (responseJson.success == 1) {
      if (responseJson.data.notify.length > 0) {
        let message = new ModelMessage();
        let data = responseJson.data.notify;
        let list = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          item.content = decode_html_entity(item.content);
          list.push(item);
        }
        message.add(list);
        message.setCache('cfg_notify', '1');
      }
      if (responseJson.data.explore.length > 0) {
        let data = responseJson.data.explore;
        let explore = new ModelExplore();
        let article_upd = '';
        let article = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          article.push({data: JSON.stringify(item), id: item.id});
          if (item.date_upd > article_upd) {
            article_upd = item.date_upd;
          }
        }
        if (article_upd != '') {
          explore.add(article);
          explore.setCache('cfg_article_upd', article_upd);
        }
        explore.setCache('cfg_explore', '1');
      }
    }

    let go = '/config';
    if (this.misc.getCache('cfg_weight') != '') {
      go = '/home';
    }
    nativeHistory.replace(go);
  }
  
  render() {
    
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
      <Image source={require('../../res/index.png')} style={{width: windowWidth, height: windowHeight}} resizeMode="stretch"/>
    );
  }
}