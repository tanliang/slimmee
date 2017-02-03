/* @noflow */

import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableOpacity,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

class HeaderIcon extends Component {
  render() {
    let show = null;
    if (this.props.icon != '') {
      show = <Icon name={this.props.icon} color='#F4F4F4' style={{fontSize:18}}/>;
    } else if (this.props.text) {
      let size = 18 - this.props.text.length;
      show = <Text style={{fontSize: size, color: '#F4F4F4'}}>{this.props.text}</Text>;
    }
    return (
      <TouchableOpacity onPress={this.props.onPress}
        style={[styles.hvCenterWrapper, {width:56}]}
        >
        {show}
      </TouchableOpacity>
    );
  }
}

HeaderIcon.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func
};

HeaderIcon.defaultProps = {
  text: '',
  icon: '',
  onPress: () => undefined
};

export default HeaderIcon;