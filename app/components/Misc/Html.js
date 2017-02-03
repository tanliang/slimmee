/* @noflow */

import Toast from 'react-native-root-toast';
import React, {
  Component
} from 'react';
import {
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  View,
  Text,
} from 'react-native';
import {
  Cell,
  CustomCell,
  Section,
  TableView
}from 'react-native-tableview-simple';
import Icon from 'react-native-vector-icons/FontAwesome';
import HTML from 'react-native-fence-html';
import {
  decode_html_entity,
  get_relative_date
} from '../index';
import styles from '../styles';
import {
  nativeHistory
} from 'react-router-native';
import ModelMisc from '../../model/Misc';

export class Html extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      data: {},
      list: {},
      page: 1,
      limit: 1,
      more: false,
      agree_done: {},
      agree_number: {},
      type: 'time'
    };
    this.misc = new ModelMisc();
  }

  componentDidMount() {
    this.updateList(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateList(newProps);
  }

  // https://gist.github.com/CatTail/4174511
  // var encodeHtmlEntity = function(str) {
  //   var buf = [];
  //   for (var i=str.length-1;i>=0;i--) {
  //     buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
  //   }
  //   return buf.join('');
  // };

  // var entity = '&#39640;&#32423;&#31243;&#24207;&#35774;&#35745;';
  // var str = '高级程序设计';
  // console.log(decodeHtmlEntity(entity) === str);
  // console.log(encodeHtmlEntity(str) === entity);

  updateList(props) {
    let data = props.location.state.data || this.state.data;
    if (data.id != undefined && data != this.state.data) {
      this.initList('time', data);
    }
  }
  
  initList(type, data) {
    this.setState({
      more: false,
      data: data,
      page: 1,
      agree_done: {},
      agree_number: {},
      type: type,
      list: {}
    });
    this.misc.sync(this.handleList.bind(this), 'comment/'+type+'/', {
      page: 1,
      limit: this.state.limit,
      id: data.id
    });
  }
  
  handleList(responseJson) {
    let msg = '没有更多评论';
    if (responseJson.success == 1 && responseJson.data != undefined && responseJson.data.length > 0) {
      if (responseJson.data.length == this.state.limit) {
        this.setState({
          page: this.state.page + 1,
          more: true
        });
      }
      for (let idx in responseJson.data) {
        let item = responseJson.data[idx];
        this.state.list[item.key] = item;
        this.state.agree_done[item.key] = item.agree_done;
        this.state.agree_number[item.key] = item.agree_number;
      }
      this.setState({
        list: this.state.list,
        agree_done: this.state.agree_done,
        agree_number: this.state.agree_number
      });
      msg = '评论加载成功';
    }
    Toast.show(msg, {
      position: Toast.positions.CENTER
    });
  }
  
  handleMore(data) {
    this.setState({more: false});
    this.misc.sync(this.handleList.bind(this), 'comment/'+this.state.type+'/', {
      page: this.state.page,
      limit: this.state.limit,
      id: this.state.data.id
    });
  }
  
  handleComment() {
    nativeHistory.push({
      pathname: '/comment_edit',
      state: {
        data: this.state.data,
      }
    });
  }
  
  handleReply(data) {
    nativeHistory.push({
      pathname: '/reply',
      state: {
        title: data.from,
        data: data,
      }
    });
  }
  
  handleAgree(data) {
    this.misc.sync(this.callbackAgree.bind(this), 'user/agree/', {
      uid: data.uid,
      time_add: data.time_add,
      id: this.state.data.id
    });
  }
  
  callbackAgree(responseJson) {
    if (responseJson.success == 1) {
      this.state.agree_done[responseJson.data.key] = responseJson.data.val > 0;
      this.state.agree_number[responseJson.data.key] += responseJson.data.val;
      this.setState({
        agree_done: this.state.agree_done,
        agree_number: this.state.agree_number
      });
    }
  }

  render() {
    const styles2 = {
      img: {
        resizeMode: 'cover'
      }
    }

    const windowWidth = Dimensions.get('window').width - 20;
    const windowHeight = Dimensions.get('window').height;

    const renderers = {
      img: (htmlAttribs, children, passProps) => {
        return (
          <Image
          source={{uri: htmlAttribs.src, width: windowWidth, height: windowWidth}}
          style={passProps.htmlStyles.img}
          {...passProps} />)
      }
    }
    
    let list = Object.values(this.state.list).sort(function(a, b) {
      return b.agree == a.agree ? (b.time_add < a.time_add ? -1 : 1) : (b.agree < a.agree ? -1 : 1);
    });

    return (
      <View style={styles.main}>   
        <ScrollView>
          <View style={{margin:10}}>
          <Text style={[styles.labelText, {fontWeight: 'bold'}]}>{this.state.data.name}</Text>
          <View style={{flexDirection: 'row', marginTop:10}}>
          <Text style={[styles.titleText, {color: '#999999'}]}>{this.state.data.date_upd}</Text>
          <Text style={[styles.titleText, {marginLeft: 10}]}>{this.state.data.author}</Text>
          </View>
          <HTML
            html={this.state.data.brief != undefined ? decode_html_entity(this.state.data.brief) : ''}
            htmlStyles={styles2}
            onLinkPress={(evt, href) => console.log(href)}
            renderers={renderers} 
          />
          <TouchableOpacity onPress={this.handleComment.bind(this)} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
            <Icon name='edit' color='#29ccb1' style={{fontSize:18}}/>
            <Text style={[styles.titleText, {fontSize: 12}]}> 快来发表你的看法吧</Text>
          </TouchableOpacity>
          </View>
            
          {
            list.length > 0 ?
            <View style={{flexDirection: 'row', justifyContent:'center', borderBottomWidth: 0.5, borderBottomColor: '#999999', margin: 10}}>
                <Text style={{fontSize: 14, color: '#999999', margin: 5}}>精选留言</Text>
            </View>
            : null
          }
            
          {
            list.length > 0 ?
            <View style={{margin:10}}>
            <TouchableOpacity onPress={() => this.initList((this.state.type == 'time' ? 'agree':'time'), this.state.data)} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
              <Icon name='sort-amount-desc' color='#29ccb1' style={{fontSize:18}}/>
              <Text style={[styles.titleText, {fontSize: 12}]}> 按{this.state.type == 'time' ? '赞数':'时间'}排序</Text>
            </TouchableOpacity>
            </View>
            : null
          }
          
          {
            list.map((data, idx) => (
              <View key={idx}>
              <View style={{margin:10}}>
              <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                activeOpacity={0.8}
                onPress={() => this.handleReply(data)}
                underlayColor='#c7c7cc' 
                style={{flex:1}}
              >
                <View style={{flexDirection: 'row'}}>
                <Icon name={data.gender == 0 ? 'venus' : 'mars'} style={{fontSize:18, marginRight:5, color: data.gender == 0 ? '#f07ab4' : '#29ccb1'}}/>
                <Text>{data.from} <Text style={{color: '#999999'}}>{get_relative_date(data.time_add*1000)}</Text></Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                activeOpacity={0.8}
                onPress={() => this.handleAgree(data)}
                underlayColor='#c7c7cc' 
                style={{minWidth: 50, alignItems: 'flex-end'}}
              >
                <View style={{flexDirection: 'row'}}>
                <Icon name={this.state.agree_done[data.key] ? 'thumbs-up' : 'thumbs-o-up'} style={{fontSize:18, marginRight:12}}/>
                <Text>{this.state.agree_number[data.key]}</Text>
                </View>
              </TouchableHighlight>
              </View>
              <Text style={[styles.titleText]}>
              {data.content}
              </Text>
              </View>

              {
                data.reply != '' ?
                <View style={{margin:10, marginTop: 0, marginLeft: 60}}>
                <Text style={[styles.titleText, {color: '#999999'}]}>作者回复</Text>
                <Text style={[styles.titleText]}>
                {data.reply}
                </Text>
                </View>
                : null
              }
              </View>
            ))
          }
          
          {
            this.state.more ?
            <View style={{alignItems:'center', margin: 10}}>
              <TouchableHighlight
                activeOpacity={0.8}
                onPress={() => this.handleMore()}
                underlayColor='#c7c7cc' 
                style={{flex:1}}
              >
                <Text style={{color: '#29ccb1'}}>查看更多</Text>
              </TouchableHighlight>
            </View>
            : null
          }
        </ScrollView>
      </View>
    );
  }
}