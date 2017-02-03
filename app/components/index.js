/* @noflow */

import React, {
  Component
} from 'react';
import {
  View
} from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';

export const component = (backgroundColor) => (props) => (
  <View style={[styles.component, { backgroundColor }]}>
    {props.children}
  </View>
);

export const title_map = {
  article: '文章',
  undefined: ''
};

export const sub_str = (str, len, hasDot) => { 
    var newLength = 0; 
    var newStr = ""; 
    var chineseRegex = /[^\x00-\xff]/g; 
    var singleChar = ""; 
    var strLength = str.replace(chineseRegex,"**").length; 
    for(var i = 0;i < strLength;i++) 
    { 
        singleChar = str.charAt(i).toString(); 
        if(singleChar.match(chineseRegex) != null) 
        { 
            newLength += 2; 
        }     
        else 
        { 
            newLength++; 
        } 
        if(newLength > len) 
        { 
            break; 
        } 
        newStr += singleChar; 
    } 
     
    if(hasDot && strLength > len) 
    { 
        newStr += "..."; 
    } 
    return newStr; 
} 

export const decode_html_entity = (str) => {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  };

export class GenderIcon extends Component {
  render() {
    const gender_icons = [{
      name: 'venus',
      color: '#F693C2'
    }, {
      name: 'mars',
      color: '#66C3EE'
    }];
    return (
      <Icon name={gender_icons[this.props.gender].name} color={gender_icons[this.props.gender].color} style={{fontSize:this.props.size,marginRight:8}}/>
    )
  }
};

//获取相对日期
export const get_relative_date = (time) => { 
  var timestamp = parseInt(time);
  timestamp = isNaN(timestamp) ? 0 : timestamp;
  var thenT = new Date(timestamp);
  thenT.setHours(0);
  thenT.setMinutes(0);
  thenT.setSeconds(0);
  var nowtime = new Date();
  nowtime.setHours(0);
  nowtime.setMinutes(0);
  nowtime.setSeconds(0);
  var delt = Math.round((nowtime.getTime() - thenT.getTime()) / 1000 / 86400);
  var day_def = {
      '-2': '后天',
      '-1': '明天',
      '0': '今天',
      '1': '昨天',
      '2': '前天'
  }[delt.toString()] || ((delt >= -30 && delt < 0) ? Math.abs(delt) + '天后' : (delt > 0 && delt <= 30) ? delt + '天前' : GetDateString(timestamp));
  return day_def;
}
 
function GetDateString(timestampstr, split) {
  var timestamp = parseInt(timestampstr);
  timestamp = isNaN(timestamp) ? 0 : timestamp;
  var datetime = new Date(timestamp);
  var month = datetime.getMonth() + 1;
  var date = datetime.getDate();
  if (split === undefined)
    split = '-';
  return datetime.getFullYear() + split + (month > 9 ? month : "0" + month) + split + (date > 9 ? date : "0" + date);
}