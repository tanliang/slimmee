/* @noflow */
import Toast from 'react-native-root-toast';
import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  View,
  Text
} from 'react-native';
import {
  Link,
} from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';
import ModelMisc from '../../model/Misc';
import {
  Cell,
  CustomCell,
  Section,
  TableView
} from 'react-native-tableview-simple';
import {
  nativeHistory
} from 'react-router-native';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.misc = new ModelMisc();
  }

  componentDidMount() {
    this.updateList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateList(newProps);
  }

  updateList(props) {
  }


  render() {
    return (
      <View style={styles.main}>
        <Text> home page here.</Text>
      </View>
    );
  }
}