/* @noflow */

import Toast from 'react-native-root-toast';
import React, {
  Component
} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  View,
  Text,
} from 'react-native';
import {
  Cell,
  CustomCell,
  Section,
  TableView
} from 'react-native-tableview-simple';
import Progress from '../Common/Progress';
import Picker from 'react-native-picker';
import styles from '../styles';
import {
  nativeHistory
} from 'react-router-native';
import ModelMisc from '../../model/Misc';
import ModelMessage from '../../model/Message';
import {
  GenderIcon
} from '../index';

const dateFormat = require('dateformat');
const reportMap = ['广告', '色情', '骚扰', '其他'];

export class Reply extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      selectedValue: '广告',
      submit_disabled: false,
      content: '',
      dialog: [],
      report: false,
      data: {},
      submit_info: {},
      time_sep: -1
    };
    this.misc = new ModelMisc();
    this.message = new ModelMessage();
  }

  componentDidMount() {
    this.updateList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateList(newProps);
  }

  updateList(props) {
    let report = props.location.state.report || false;
    let data = props.location.state.data || this.state.data;
    let time_sep = -1;
    let dialog = [];
    if (data.uid != '') {
      let all = this.message.raw().filtered('uid = "'+data.uid+'"').sorted('time');
      for (let idx in all) {
        const item = all[idx];
        // dialog.unshift(item);
        dialog.push(item);
        if (item.upd == 0 && item.time > time_sep) {
          time_sep = item.time;
        }
      }
      this.message.upd(all);
    }
    
    this.setState({
      selectedValue: '广告',
      report: report,
      content: '',
      dialog: dialog,
      data: data,
      submit_info: {},
      time_sep: time_sep
    });
    
    if (report) {
      this.refs.picker.show();
    }
  }

  navHtml() {
    if (this.state.html.title != undefined) {
      nativeHistory.push({
        pathname: '/html',
        state: this.state.html
      });
    }
  }

  submitReply() {
    this.setState({
      submit_disabled: true
    });
    let info = {
      cate: 'dialog',
      content: this.state.content,
      uid: this.state.data.uid,
      time: this.misc.initSecTime(),
      upd: 2
    };
    if (this.state.content != '') {
      //this.message.add(info);
      this.setState({
        submit_info: info
      });
    }
    this.misc.sync(this.handleReply.bind(this), 'message/reply/', info);
  }


  handleReply(responseJson) {
    this.setState({
      submit_disabled: false
    });
    let msg = '提交失败，请稍后再试';
    if (responseJson.success == 1) {
      msg = '提交成功';
      this.refs.input.clear();
      if (this.state.content != '') {
        this.message.add(this.state.submit_info);
        this.state.dialog.push(this.state.submit_info);
        this.setState({
          dialog: this.state.dialog
        });
      }
    } else if (responseJson.error != undefined) {
      msg = responseJson.errmsg;
    }
    Toast.show(msg, {
      position: Toast.positions.CENTER
    });
  }
  
  handlePickerDone(selectedValue) {
    if (this.state.data.uid != undefined) {
      this.setState({
        submit_disabled: true
      });
      this.misc.sync(this.handleReply.bind(this), 'banned/add/', {
        target: this.state.data.uid,
        report: selectedValue[0],
        message: this.state.data.content
      });
    }
  }
  
  render() {
    let list = this.state.dialog.sort(function(a, b) {
      return b.time < a.time ? -1 : 1;
    });

    const dialogWidth = Dimensions.get('window').width * 0.7;
    return (
      <View style={styles.main}>     
        <Progress visible={this.state.submit_disabled}/> 
      
        <View style={{flexDirection: 'row', marginBottom: 5}}>
        <TextInput ref='input'
          style={[styles.titleText, {flex: 1, backgroundColor: '#F4F4F4', height: 72}]}
          autoFocus={true}
          onChangeText={(content) => this.setState({content})}
          placeholder='请输入您想说的话。'
          underlineColorAndroid='transparent'
          multiline={true}
          maxLength={300}
        />
        <View style={{alignItems: 'stretch'}}>
          <TouchableOpacity onPress={this.submitReply.bind(this)} disabled={this.state.submit_disabled}
            style={[styles.radiusWrapper, {flexDirection: 'column', width: 30, height: 72, backgroundColor: '#29ccb1'}]}
            >
            <Text style={{fontSize: 16, color: '#f4f4f4'}}>提</Text>
            <Text style={{fontSize: 16, color: '#f4f4f4'}}>交</Text>
          </TouchableOpacity>
        </View>
        </View>
            
        <ScrollView>
          {
            list.map((data, idx) => (
              <View key={idx}>
              <View style={{margin: 5, alignItems: data.upd == 2 ? 'flex-end' : 'flex-start'}}>
              <View style={{maxWidth: dialogWidth, padding:5, borderWidth: 0.5, borderColor: '#999999',borderRadius: 6, backgroundColor: data.upd == 2 ? '#29ccb1' : '#ffffff'}}>
              <Text style={[styles.titleText]}>{data.content}</Text>
              </View>
              </View>
              {this.state.time_sep == data.time ? <View style={{alignItems: 'center'}}><Text style={{color: '#999999', fontSize: 12}}>{dateFormat(new Date(parseInt(data.time) * 1000), 'isoDateTime')}</Text></View>: null}
              </View>
            ))
          }
        </ScrollView>
        <Picker
          ref='picker'
          pickerToolBarStyle={{backgroundColor: '#29ccb1', height: 40}}
          pickerBtnStyle={{color: '#f4f4f4'}}
          pickerTitleStyle={{color: '#f4f4f4'}}
          pickerTitle='加入黑名单'
          pickerBtnText="确定"
          pickerCancelBtnText="取消"
          style={{height: 300}}
          pickerData={reportMap}
          selectedValue={this.state.selectedValue}
          onPickerDone={(selectedValue) => this.handlePickerDone(selectedValue)}
        />
      </View>
    );
  }
}