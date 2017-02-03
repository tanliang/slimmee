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
  nativeHistory
} from 'react-router-native';
import {
  Cell,
  CustomCell,
  Section,
  TableView
} from 'react-native-tableview-simple';
import styles from '../styles';
import ModelMisc from '../../model/Misc';

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
    this.misc = new ModelMisc();
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {}

  handleExit() {
    this.misc.deleteAll();
    nativeHistory.replace('/login');
  }

  render() {
    return (
      <View style={styles.main}>
        <ScrollView>
          <TableView>
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
            <CustomCell contentContainerStyle={[styles.hvCenterWrapper, {backgroundColor: 'transparent', height: 30}]}>
              <Text style={{fontSize: 12}}>请输入基础信息</Text>
            </CustomCell>
            </Section>
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
            <CustomCell contentContainerStyle={[styles.hvCenterWrapper, {backgroundColor: 'transparent', marginTop: 30}]}>
              <TouchableOpacity onPress={this.handleExit.bind(this)}
                style={[styles.radiusWrapper, {minHeight: 30, minWidth: 60, backgroundColor: '#29ccb1'}]}
                >
                <Text style={{fontSize: 16, color: '#f4f4f4'}}>退出</Text>
              </TouchableOpacity>
            </CustomCell>
            </Section>
          </TableView>
        </ScrollView>
      </View>
    );
  }
}