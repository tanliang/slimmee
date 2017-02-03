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
import ModelMisc from '../../model/Misc';

export class Article extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.misc = new ModelMisc();
    this.state = {
      search_not_found: 0,
      search_history: [],
      search_result: {}
    };
  }

  componentDidMount() {
    this.updateList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateList(newProps);
  }

  updateList(props) {
    this.props = props;
    this.text = props.location.state.text || '';
    this.setState({
      search_not_found: 0
    });
    if (this.text != '') {
      this.misc.history('article', this.text);
      this.setState({
        search_history: []
      });
    } else {
      this.setState({
        search_result: {}
      });
    }
    this.misc.search('article', this.text, this.handleSearch.bind(this));
  }

  handleItem(link) {
    if (link != '') {
      nativeHistory.push({
        pathname: '/web',
        state: {
          link
        }
      });
    }
  }

  handleSearch(responseJson) {
    if (responseJson.data != undefined) {
      let list = responseJson.data;
      if (this.text != '') {
        this.setState({
          search_result: list
        });

        let search_not_found = list.length == 0 ? 1 : 0;
        this.setState({
          search_not_found
        });
      } else {
        this.setState({
          search_history: list
        });
      }
    }
  }

  searchItem(text) {
    const {
      routeParams
    } = this.props;
    nativeHistory.push({
      pathname: '/article',
      state: {
        text
      }
    });
  }

  render() {
    let search_result = Object.values(this.state.search_result).sort(function(a, b) {
      return b.date_upd > a.date_upd ? -1 : 1;
    });
    return (
      <View style={styles.main}>        
        <ScrollView ref='scrollView'>
          <TableView>
            { this.state.search_not_found != 0 ? 
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
            <CustomCell contentContainerStyle={[styles.hvCenterWrapper, {backgroundColor: 'transparent', height: 30}]}>
              <Text style={{fontSize: 12}}>未找到您查询的内容，您可以尝试其他关键字。</Text>
            </CustomCell>
            </Section>
             : null }
            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
              {
                search_result.map((data) => (
                  <CustomCell key={data.id} onPress={() => this.handleItem(data.link)} contentContainerStyle={{backgroundColor: 'transparent'}} highlightUnderlayColor='#c7c7cc'>
                  { data.image != '' ? <Image source={{uri: data.image}} indicator={Progress.Pie} indicatorProps={{size: 30, borderWidth: 0, color: '#29ccb1', unfilledColor: 'rgba(200, 200, 200, 0.2)'}} style={{width: 30, height: 30, marginRight: 8}}/> : null }
                    <Text style={{flex: 1}}>{data.name}</Text>
                    <Icon name="angle-right" color='#c7c7cc' style={{fontSize:24, marginLeft:12}}/>
                  </CustomCell>
                  )
                )
              }
            </Section>

            <Section sectionTintColor='transparent' separatorInsetLeft={0} sectionInnerBorder={false}>
              {
                this.state.search_history.map((data, idx) => (
                  <CustomCell key={idx} onPress={() => this.searchItem(data)} 
                    contentContainerStyle={{backgroundColor: 'transparent'}}
                    highlightUnderlayColor='#c7c7cc'
                    >
                    <Text style={{flex: 1}}>{data}</Text>
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