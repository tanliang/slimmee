/* @noflow */

import React, {
  Component
} from 'react';
import {
  TouchableOpacity,
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
import Icon from 'react-native-vector-icons/FontAwesome';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import styles from '../styles';
import {
  nativeHistory
} from 'react-router-native';
import ModelExplore from '../../model/Explore';

export class Explore extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.explore = new ModelExplore();
    this.state = {
      list: {}
    };
  }

  componentDidMount() {
    this.updateList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateList(newProps);
  }

  updateList(props) {
    let list = {};
    let all = this.explore.raw().sorted('id').slice(0, 100);
    for (let idx in all) {
      const item = all[idx];
      list[item.id] = JSON.parse(item.data);
    }
    this.setState({
      list
    });
  }

  handleItem(data) {
    nativeHistory.push({
      pathname: '/relay',
      state: {
        type: 'article',
        info: data.id
      }
    });
  }

  render() {
    let list = Object.values(this.state.list).sort(function(a, b) {
      return b.date_upd < a.date_upd ? -1 : 1;
    });
    return (
      <View style={styles.main}>        
        <ScrollView>
          <TableView>
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
            {
              list.map((data) => (
                <CustomCell key={data.id} onPress={() => this.handleItem(data)} contentContainerStyle={{backgroundColor: 'transparent'}} highlightUnderlayColor='#c7c7cc'>
                  { data.image != '' ? <Image source={{uri: data.image}} indicator={Progress.Pie} indicatorProps={{size: 30, borderWidth: 0, color: '#29ccb1', unfilledColor: 'rgba(200, 200, 200, 0.2)'}} style={{width: 30, height: 30, marginRight: 8}}/> : null }
                  <Text style={{flex: 1}}>{data.name}</Text>
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