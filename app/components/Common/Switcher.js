/* @noflow */

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View
} from 'react-native';
import {
  Link,
} from 'react-router-native';
import styles from '../styles';

const switcherLink = (tab, idx, all) => {
  let activeStyle = null;
  if (all.length - 1 == idx) {
    activeStyle = styles.radiusRight;
  } else if (idx == 0) {
    activeStyle = styles.radiusLeft;
  }
  return (
    <Link key={tab.link} to={tab.link}
      style={[styles.hvCenterWrapper, {paddingTop:8, paddingBottom:8, paddingLeft: 20, paddingRight: 20}]}
      activeStyle={[styles.switcherLinkActive, activeStyle]}
      underlayColor="transparent">
      <Text style={styles.titleText}>{tab.name}</Text>
    </Link>
  );
};

export default class Switcher extends Component {
  render() {
    if (this.props.tabs.length > 0) {
      return (
        <View style={{height:40}}>
        <View style={styles.hvCenterWrapper}>
          <View style={[styles.radiusWrapper, {alignItems:'stretch'}]}>
          {this.props.tabs.map((tab, idx, all) => switcherLink(tab, idx, all))}
          </View>
        </View>
        </View>
      );
    }
    return null;
  }
}