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

export class Area extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      pickerData: {
        '直辖市': [
          '北京'
        ]
      },
      selectedValue: ['直辖市', '北京'],
    };
    this.area = {};
    this.misc = new ModelMisc();
  }

  componentDidMount() {
    this.misc.query('misc/area/', this._handleArea.bind(this), 30 * 24 * 3600);
  }

  _handleArea(responseJson) {
    if (responseJson.success == 1) {
      let pickerData = this._formatArea(responseJson.data);
      this.setState({
        pickerData
      });
      this.picker.show();
    }
  }

  _handlePickerDone() {
    let area = this.area[this.state.selectedValue[0]][this.state.selectedValue[1]];
    this.misc.setCache('cfg_area', area);
    nativeHistory.replace('/config/hide');
  }

  _onPressHandle(type) {
    this.picker.toggle();
  }

  _formatArea(area) {
    this.area = area;
    let data = {};
    for (let key in area) {
      data[key] = Object.keys(area[key]);
    }
    return data;
  };

  render() {
    return (
      <View style={styles.main}>
        <ScrollView>
          <TableView>
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
            <CustomCell contentContainerStyle={[styles.hvCenterWrapper, {backgroundColor: 'transparent', height: 30}]}>
              <Text style={{fontSize: 12}}>请选择所在地区</Text>
            </CustomCell>
            </Section>
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
                <CustomCell>
                  <Text style={{fontSize: 16}}>地区</Text>
                  <TouchableOpacity style={{flex:1, alignItems: 'flex-end', marginLeft:18, padding:0}} onPress={() => this._onPressHandle()}>
                    <Text style={styles.titleText}>{this.state.selectedValue.join("")}</Text>
                  </TouchableOpacity>
                </CustomCell>
            </Section>
          </TableView>
        </ScrollView>
            <Picker
              ref={picker => this.picker = picker}
              pickerToolBarStyle={{backgroundColor: '#29ccb1', height: 40}}
              pickerBtnStyle={{color: '#f4f4f4'}}
              pickerTitleStyle={{color: '#f4f4f4'}}
              pickerTitle="地区"
              pickerBtnText="确定"
              pickerCancelBtnText="取消"
              style={{height: 300}}
              pickerData={this.state.pickerData}
              selectedValue={this.state.selectedValue}
              onValueChange={(selectedValue) => this.setState({selectedValue})}
              onPickerDone={(selectedValue) => this._handlePickerDone()}
            />
      </View>
    );
  }
}