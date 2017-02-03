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
import Picker from 'react-native-picker';
import styles from '../styles';
import ModelMisc from '../../model/Misc';

function createNumber(min, max, step = 1) {
  let res = [];
  for (let i = min; i <= max; i = i + step) {
    res.push(i);
  }
  return res;
}

function createDate(age_min, age_max) {
  const year = (new Date()).getFullYear();
  const year_min = year - age_max + 1;
  const year_max = year - age_min + 1;
  let date = {};

  for (let i = year_min; i < year_max; i++) {
    let month = {};
    for (let j = 1; j < 13; j++) {
      let day = [];
      if (j === 2) {
        for (let k = 1; k < 29; k++) {
          day.push(k + '');
          //day.push(k);
        }
      } else if (j in {
          1: 1,
          3: 1,
          5: 1,
          7: 1,
          8: 1,
          10: 1,
          12: 1
        }) {
        for (let k = 1; k < 32; k++) {
          day.push(k + '');
          //day.push(k);
        }
      } else {
        for (let k = 1; k < 31; k++) {
          day.push(k + '');
          //day.push(k);
        }
      }
      month[j + ''] = day;
      //month[j] = day;
    }
    date[i + ''] = month;
    //date[i] = month;
  }
  return date;
};

const gender_map = ['女', '男'];

export class Config extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
    this.misc = new ModelMisc();

    this.picker = {};
    this.list = [{
      type: 'gender',
      name: '性别',
      pickerData: gender_map,
      selected: '女'
    }, {
      type: 'birth',
      name: '生日',
      pickerData: createDate(7, 70),
      selected: [((new Date()).getFullYear() - 20) + '', '1', '1'],
      format: {
        seperator: '.'
      }
    }, {
      type: 'height',
      name: '身高',
      pickerData: createNumber(110, 220),
      selected: 160,
      format: {
        suffix: 'cm'
      }
    }, {
      type: 'weight',
      name: '体重',
      pickerData: [createNumber(15, 150), createNumber(0, 9)],
      selected: [65, 0],
      format: {
        seperator: '.',
        suffix: 'kg'
      }
    }];
    for (let idx in this.list) {
      let data = this.list[idx];
      this.state[data.type] = this._decodeItem(data.type);
    }

  }

  componentDidMount() {
    this._handlePickerDone();
    this.updateView(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateView(newProps);
  }
  
  updateView(props) {
    if (this.misc.getCache('cfg_area') == '') {
      nativeHistory.replace('/area');
    } else if (this.misc.getCache('cfg_nickname') == '') {
      nativeHistory.replace('/nickname');
    } else {
      const right = props.routeParams.right || '';
      if (right == 'done') {
        let info = {};
        for (let idx in this.list) {
          let data = this.list[idx];
          let type = data.type;
          let value = this._encodeItem(type);
          info[type] = value;
        }
        info.area = this.misc.getCache('cfg_area');
        this.misc.sync(this.handleConfig.bind(this), 'user/set/', info);
        Toast.show('正在保存用户信息', {
          position: Toast.positions.CENTER
        });
      }
    }
  }

  handleConfig(responseJson) {
    if (responseJson.success == 1) {
      for (let idx in responseJson.data) {
        this.misc.setCache('cfg_' + idx, responseJson.data[idx]);
      }
      nativeHistory.replace('/home');
    } else {
      Toast.show(responseJson.data, {
        position: Toast.positions.CENTER
      });
      nativeHistory.replace('/config/show');
    }
  }

  _encodeItem(type) {
    let value = Array.isArray(this.state[type]) ? this.state[type].join(".") : this.state[type];
    if (type == 'gender') {
      value = gender_map.indexOf(value);
    } else if (type != 'birth') {
      value = parseInt(value, 10);
    }
    return value.toString();
  }

  _decodeItem(type) {
    let value = this.misc.getCache('cfg_' + type);
    if (value != '') {
      if (type == 'gender') {
        value = gender_map[value];
      } else if (value != 0 && value != '') {
        if (type != 'height') {
          value = (value + '').split('.');
        }
      }
    }

    return value;
  }

  _handlePickerDone() {
    let type = ''; // show first undefined type
    for (let idx in this.list) {
      let data = this.list[idx];
      if (this.state[data.type] == false && type == '') {
        type = data.type;
        this.setState({
          [data.type]: data.selected
        });
        this.picker[data.type].show();
      } else {
        this.picker[data.type].hide();
      }
    }

    if (type == '') {
      nativeHistory.replace('/config/show');
    }
  }

  _onPressHandle(type) {
    for (let idx in this.list) {
      let data = this.list[idx];
      if (data.type == type) {
        if (this.state[data.type] == false) {
          this.setState({
            [data.type]: data.selected
          });
        }
        this.picker[data.type].show();
      } else {
        this.picker[data.type].hide();
      }
    }
  }

  _formatData(data) {
    let selectedValue = data.selected;
    if (this.state[data.type] != false) {
      selectedValue = this.state[data.type];
      if (data.format != undefined) {
        if (data.format.seperator != undefined) {
          selectedValue = selectedValue.join(data.format.seperator);
        }
        if (data.format.suffix != undefined) {
          selectedValue = selectedValue + data.format.suffix;
        }
      }
    }
    return selectedValue;
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
            {
              this.list.map((data, idx) => (
                <CustomCell key={idx}>
                  <Text style={{fontSize: 16}}>{data.name}</Text>
                  <TouchableOpacity style={{flex:1, alignItems: 'flex-end', marginLeft:18, padding:0}} onPress={() => this._onPressHandle(data.type)}>
                    {this.state[data.type] != false ? (<Text style={styles.titleText}>{this._formatData(data)}</Text>) : (<Text style={{color: '#999999'}}>未填写</Text>)}
                  </TouchableOpacity>
                </CustomCell>
                ))
            }

            </Section>
          </TableView>
        </ScrollView>
        {
          this.list.map((data, idx) => (
            <Picker key={idx}
              ref={picker => this.picker[data.type] = picker}
              pickerToolBarStyle={{backgroundColor: '#29ccb1', height: 40}}
              pickerBtnStyle={{color: '#f4f4f4'}}
              pickerTitleStyle={{color: '#f4f4f4'}}
              pickerTitle={data.name}
              pickerBtnText="确定"
              pickerCancelBtnText="取消"
              style={{height: 300}}
              pickerData={data.pickerData}
              selectedValue={this.state[data.type] != false ? this.state[data.type] : data.selected}
              onValueChange={(value) => this.setState({[data.type]: value})}
              onPickerDone={(value) => this._handlePickerDone()}
            />
            )
          )
        }
      </View>
    );
  }
}