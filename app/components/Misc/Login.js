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
import ModelMisc from '../../model/Misc';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.misc = new ModelMisc();
    let text = this.misc.getCache('tmp_user');
    this.state = {
      info: '请填写 Email 信息',
      text: text
    };
  }

  handleSubmit() {
    const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (this.state.text != '' && reg.test(this.state.text)) {
      this.misc.setCache('tmp_user', this.state.text);
      nativeHistory.push('/auth');
    } else {
      this.setState({
        info: '请检查 Email 信息是否正确'
      });
    }
  }

  render() {
    return (
      <View style={styles.main}>
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
              <TouchableOpacity onPress={this.handleSubmit.bind(this)}
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