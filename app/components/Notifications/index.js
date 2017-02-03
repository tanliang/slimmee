/* @noflow */

import Toast from 'react-native-root-toast';
import React, {
  Component
} from 'react';
import {
  TouchableHighlight,
  ScrollView,
  View,
  Text,
} from 'react-native';
import {
  Cell,
  CustomCell,
  Section,
  TableView
} from 'react-native-tableview-simple';
import Image from 'react-native-image-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import styles from '../styles';
import {
  sub_str
} from '../index';
import {
  nativeHistory
} from 'react-router-native';
import ModelMessage from '../../model/Message';

const dateFormat = require('dateformat');

export class Notifications extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.message = new ModelMessage();
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    this.updateList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateList(newProps);
  }

  updateList(props) {
    let status = props.location.state.status || 0;
    let list = this.message.raw().filtered('upd = '+status).sorted('time');
    this.setState({list});
  }

  handlePress(data, idx) {
    // console.log('handlePress');
    // console.log(data);
    // TODO: reply/banned etc
    // nativeHistory.push('/reply');

    // if (data.read == 0) {
    //   this.message.read1(data);
    //   this.state.color[idx] = '#999999';
    //   this.setState({
    //     color: this.state.color
    //   })
    // }
    // nativeHistory.push({
    //   pathname: '/reply',
    //   state: {
    //     title: data.from,
    //     data: data,
    //   }
    // });
    if (data.cate == 'dialog') {
      nativeHistory.push({
        pathname: '/reply',
        state: {
          title: data.from,
          data: data,
        }
      });
    } else {
      nativeHistory.push({
        pathname: '/comment_edit',
        state: {
          data: data,
        }
      });
    }

  }

  render() {
    return (
      <View style={styles.main}>        
        <ScrollView>
          <TableView>
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
            {
              this.state.list.map((data, idx) => (
                <CustomCell key={idx} onPress={() => this.handlePress(data, idx)} contentContainerStyle={{backgroundColor: 'transparent'}} highlightUnderlayColor='#c7c7cc'>
                  <Text style={{flex: 1}}><Text style={{color: '#999999'}}>{dateFormat(new Date(parseInt(data.time) * 1000), 'isoDate')}</Text>@{data.from}：{sub_str(data.content, 50, true)}</Text>
                  <Icon name="angle-right" color='#c7c7cc' style={{fontSize:24, marginLeft:12}}/>
                </CustomCell>
                )
              )
            }
            </Section>
          </TableView>
        </ScrollView>
      </View>
    );
  }
}