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
}from 'react-native-tableview-simple';
import Icon from 'react-native-vector-icons/FontAwesome';
import HTML from 'react-native-fence-html';
import Progress from '../Common/Progress';
import Picker from 'react-native-picker';
import styles from '../styles';
import {
  nativeHistory
} from 'react-router-native';
import ModelMisc from '../../model/Misc';
import ModelMessage from '../../model/Message';

const dateFormat = require('dateformat');
const reportMap = ['广告', '色情', '骚扰', '其他'];

export class CommentEdit extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      selectedValue: '广告',
      submit_disabled: false,
      report: false,
      content: '',
      data: {}
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
    let data = props.location.state.data || {};
    if (data != {} && data.upd == 0) {
      this.message.upd(data);
    }
    
    this.setState({
      selectedValue: '广告',
      report: report,
      data: data
    });
    
    if (report) {
      this.refs.picker.show();
    }
  }

  submitComment() {
      if (this.state.data.id != undefined) {
        if (this.state.content != '') {
          this.misc.sync(this.handleSubmit.bind(this), 'message/comment/', {
            content: this.state.content,
            id: this.state.data.id
          });
          this.setState({
            submit_disabled: true
          });
        }
      } else {
        this.misc.sync(this.handleSubmit.bind(this), 'message/review/', {
          content: this.state.content,
          uid: this.state.data.uid,
          time: this.state.data.time
        });
        this.setState({
          submit_disabled: true
        });
      }
  }

  handleSubmit(responseJson) {
    this.setState({
      submit_disabled: false
    });
    let msg = '提交失败，请稍后再试';
    if (responseJson.success == 1) {
      msg = '提交成功';
      if (this.state.data.id != undefined) {
        msg += '，请等待审核';
      }
      this.refs.input.clear();
      nativeHistory.go(-1);
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
      this.misc.sync(this.handleSubmit.bind(this), 'banned/add/', {
        target: this.state.data.uid,
        report: selectedValue[0],
        message: this.state.data.content
      });
    }
  }
  
  render() {
    return (
      <View style={styles.main}>   
        <Progress visible={this.state.submit_disabled}/>  
        <ScrollView>
          
        {
          this.state.data.cate == undefined || this.state.data.cate != 'review' ?
          <View style={{flexDirection: 'row', marginTop:10}}>
          <TextInput ref='input'
            style={[styles.titleText, {flex: 1, backgroundColor: '#F4F4F4', height: 72}]}
            autoFocus={true}
            onChangeText={(content) => this.setState({content})}
            placeholder={this.state.data.id != undefined ? '请输入您想说的话。' :'内容可以留空，提交即为通过审核。'}
            underlineColorAndroid='transparent'
            multiline={true}
            maxLength={1000}
          />
          <View style={{alignItems: 'stretch'}}>
            <TouchableOpacity onPress={this.submitComment.bind(this)} disabled={this.state.submit_disabled}
              style={[styles.radiusWrapper, {flexDirection: 'column', width: 30, height: 72, backgroundColor: '#29ccb1'}]}
              >
              <Text style={{fontSize: 16, color: '#f4f4f4'}}>提</Text>
              <Text style={{fontSize: 16, color: '#f4f4f4'}}>交</Text>
            </TouchableOpacity>
          </View>
          </View>
          : null
        }
          {
            this.state.data.content != undefined ?
            <View style={{margin:10}}>
            <Text><Text style={{color: '#999999'}}>{dateFormat(new Date(parseInt(this.state.data.time) * 1000), 'isoDate')}</Text>@{this.state.data.from}：{this.state.data.content}</Text>
            </View>
            : null
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