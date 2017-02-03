/* @noflow */

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

export class Auth extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.misc = new ModelMisc();
    this.state = {
      submit_disabled: false,
      info: '',
      text: ''
    };
  }

  componentDidMount() {
    this.updateList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateList(newProps);
  }

  updateList(props) {
    let info = '请填写验证码信息';
    const user = this.misc.getCache('tmp_user');
    let captcha = props.location.state.captcha || false;
    if (captcha) {
      this.misc.sync(this.handleCaptcha.bind(this), 'misc/captcha/', {
        user
      }, false, 15000);
      info = '正在发送验证码至<' + user + '>';
    }
    this.setState({
      info
    });
  }

  handleCaptcha(responseJson) {
    if (responseJson.data != undefined) {
      this.setState({
        info: responseJson.data
      });
    }
  }

  handleSubmit() {
    if (this.state.text != '') {
      const data = {
        user: this.misc.getCache('tmp_user'),
        pass: this.state.text
      };
      this.misc.sync(this.handleVerify.bind(this), 'misc/verify/', data, false);
      this.setState({
        submit_disabled: true
      });
    }
  }

  handleVerify(responseJson) {
    this.setState({
      submit_disabled: false
    });
    if (responseJson.success == 0) {
      this.setState({
        info: '验证错误，请稍后再试，如有问题，请联系管理员'
      });
    } else {
      this.refs.input.clear();
      this.misc.deleteAll();
      this.misc.setCache('cfg_token', responseJson.data);
      nativeHistory.replace('/loading');
    }
  }

  render() {
    return (
      <View style={styles.main}>
        <Progress visible={this.state.submit_disabled}/> 
        <ScrollView keyboardShouldPersistTaps={true}>
          <TableView>
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
            <CustomCell contentContainerStyle={[styles.hvCenterWrapper, {backgroundColor: 'transparent', height: 30}]}>
              <Text style={{fontSize: 12}}>{this.state.info}</Text>
            </CustomCell>
            </Section>
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
            <CustomCell>
              <TextInput ref='input'
                style={[styles.titleText,{flex:1, padding:0, textAlign: 'center'}]}
                autoFocus={true}
                onChangeText={(text) => this.setState({text})}
                placeholder="未填写"
                underlineColorAndroid='transparent'
                value={this.state.text}
              />
            </CustomCell>
            </Section>
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
            <CustomCell contentContainerStyle={[styles.hvCenterWrapper, {backgroundColor: 'transparent', marginTop: 30}]}>
              <TouchableOpacity onPress={this.handleSubmit.bind(this)} disabled={this.state.submit_disabled}
                style={[styles.radiusWrapper, {minHeight: 30, minWidth: 60, backgroundColor: '#29ccb1'}]}
                >
                <Text style={{fontSize: 16, color: '#f4f4f4'}}>{this.state.submit_disabled ? '稍等' : '提交'}</Text>
              </TouchableOpacity>
            </CustomCell>
            </Section>
          </TableView>
        </ScrollView>
      </View>
    );
  }
}