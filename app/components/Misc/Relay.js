/* @noflow */

import Toast from 'react-native-root-toast';
import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
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
import styles from '../styles';
import Progress from '../Common/Progress';
import ModelMisc from '../../model/Misc';

export class Relay extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.misc = new ModelMisc();
  }

  componentDidMount() {
    this.updateList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateList(newProps);
  }

  updateList(props) {
    let type = props.location.state.type || '';
    let info = props.location.state.info || '';
    if (type == 'article' && info != '') {
      this.misc.query('article/index/?id=' + info, this.handleArticle.bind(this), 360000);
    } else {
      this.handleError({data: '不支持的跳转类型'});
    }
  }

  handleArticle(responseJson) {
    if (responseJson.success == 1) {
      nativeHistory.replace({
        pathname: '/html',
        state: {
          title: responseJson.data.article_category,
          data: responseJson.data
        }
      });
    } else {
      this.handleError(responseJson);
    }
  }
  
  handleError(dataJson) {
    let error = '获取失败，请稍后再试';
    if (dataJson.data != undefined) {
      error = dataJson.data.toString();
    }
    Toast.show(error, {
      position: Toast.positions.CENTER
    });
    nativeHistory.go(-1);
  }
  
  render() {
    return (
      // TODO: add some image
      <View style={styles.main}>
      </View>
    );
  }
}