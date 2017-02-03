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
import Toast from 'react-native-root-toast';

export class Nickname extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.misc = new ModelMisc();
    this.state = {
      info: '2-12个字符的中英文，或数字、下划线',
      text: '',
      submit_disabled: false
    };
  }

  handleSubmit() {
    if (this.state.text != '') {
      this.misc.sync(this.handleBind.bind(this), 'user/bind/', {
        type: 'nickname',
        value: this.state.text
      });
      this.setState({
        submit_disabled: true
      });
    }
  }
  
  handleBind(responseJson) {
    this.setState({
      submit_disabled: false
    });
    if (responseJson.success == 1) {
      this.misc.setCache('cfg_nickname', this.state.text);
      nativeHistory.replace('/config/hide');
    } else {
      let msg = '设置失败，请稍后再试';
      if (responseJson.errmsg != undefined) {
        msg = responseJson.errmsg;
      }
      Toast.show(msg, {
        position: Toast.positions.CENTER
      });
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
                <Text style={{fontSize: 16, color: '#f4f4f4'}}>提交</Text>
              </TouchableOpacity>
            </CustomCell>
            </Section>
          </TableView>
        </ScrollView>
      </View>
    );
  }
}