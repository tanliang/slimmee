/* @noflow */

import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  Link,
} from 'react-router-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModelMisc from '../../model/Misc';

const tabMap = [{
  key: "home",
  icon: "home",
  "name": '首页'
}, {
  key: "explore",
  icon: "comment",
  "name": "发现"
}, {
  key: "notifications",
  icon: "envelope",
  "name": "通知"
}, {
  key: "profile",
  icon: "user",
  "name": "我的"
}];

const TabLink = (tab, sel) => {
  let misc = new ModelMisc();
  let color = '#C7C7CC';
  if (sel == tab.key) {
    color = '#29CCB1';
    if (sel == 'notifications') {
      misc.setCache('cfg_notify', '0');
    } else if (sel == 'explore') {
      misc.setCache('cfg_explore', '0');
    }
  }

  let red = <Icon name='circle' color='transparent' style={{fontSize:8}}/>;
  if (sel != 'notifications' && tab.key == 'notifications') {
    if (misc.getCache('cfg_notify') == '1') {
      red = <Icon name='circle' color='#ff6b6b' style={{fontSize:8}}/>;
    }
  } else if (sel != 'explore' && tab.key == 'explore') {
    if (misc.getCache('cfg_explore') == '1') {
      red = <Icon name='circle' color='#ff6b6b' style={{fontSize:8}}/>;
    }
  }

  return (
    <Link key={tab.key} to={`/${tab.key}`}
    style={styles.tabLink} underlayColor="transparent">
    <View style={{flexDirection: 'row'}}>
    <View><Icon name={tab.icon} color={color} style={{fontSize:20}}/>
    <Text style={[styles.tabLinkText,{color:color}]}>{tab.name}</Text>
    </View>
    {red}
    </View>
  </Link>
  );
};

class Tabs extends Component {
  render() {
    const props = this.props;
    return (
      <View style={styles.tabs}>
      {
        tabMap.map(function(tab) {return TabLink(tab, props.pathname);})
      }
      </View>
    );
  }
};

export class Master extends Component {
  render() {
    const props = this.props;
    //console.log(props.location.pathname);
    let tabs = null;
    let keys = props.location.pathname.split("/");
    let count = 0;
    tabMap.map(function(tab) {
      if (tab.key == keys[1]) {
        count = 1;
      }
    });
    if (count > 0) {
      tabs = <Tabs pathname={keys[1]}/>;
    }
    return (

      <View style={styles.master}>
          <View style={styles.body}>
            {props.children}
            {tabs}
          </View>
      </View>
    );
  }
}