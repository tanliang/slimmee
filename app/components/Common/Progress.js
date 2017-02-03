/* @noflow */

import React, {
  Component,
  PropTypes
} from 'react';
import {
  ActivityIndicator,
  View,
  Modal,
  Text
} from 'react-native';

class Progress extends Component {
  render() {
    return (
      <Modal
        animationType='none'
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.reqClose}
        >  
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
          <ActivityIndicator color="#F4F4F4" size="large"/>
          <Text style={{color: '#F4F4F4', fontSize: 12}}>{this.props.message}</Text>
        </View>
      </Modal>
    );
  }
}

Progress.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string,
  reqClose: PropTypes.func
};

Progress.defaultProps = {
  visible: false,
  message: '请稍等',
  reqClose: () => undefined
};

export default Progress;