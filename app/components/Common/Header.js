/* @noflow */

import React, {
  Component
} from 'react';
import {
  NavigationExperimental,
  TextInput,
  View,
  Text,
} from 'react-native';
import styles from '../styles';
import {
  title_map
} from '../index';
import {
  nativeHistory
} from 'react-router-native';
import HeaderIcon from './HeaderIcon';
const {
  Header: NavigationHeader,
} = NavigationExperimental;

class Header extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      text: ''
    };
    // console.log(Math.random());
    // console.log(props);
    this.header = {};
  }

  renderIcon(value) {
    if (value == undefined) {
      return null;
    }
    return (<HeaderIcon text={value.name} onPress={() => value.path == undefined ? this.handleSearch(value.route) : !isNaN(value.path) ? nativeHistory.go(value.path) : nativeHistory.push(value.path)}/>);
  }

  handleSearch(route) {
    let cate = this.props.params.cate || '';
    if (cate != '') {
      route += '/' + cate;
    }
    nativeHistory.push({
      pathname: '/' + route,
      state: {
        text: this.state.text
      }
    });
  }

  titleNormal() {
    return (
      <View style={[styles.hvCenterWrapper]}>
      <Text style={[styles.labelText, {color: '#f4f4f4'}]}>
      {title_map[this.props.params.cate]}{this.header.name}
      </Text>
      </View>
    );
  }

  titleSearch() {
    return (
      <View style={[styles.hvCenterWrapper]}>
      <View style={[styles.radiusWrapper,styles.hvCenterWrapper]}>
      <TextInput
        style={[styles.titleText,{flex:1,marginLeft:6,marginRight:6,padding:0}]}
        onChangeText={(text) => this.setState({text})}
        placeholder={'请输入'+title_map[this.props.params.cate]+'关键字'}
        underlineColorAndroid='transparent'
      />
      </View>
      </View>
    );
  }

  componentDidMount() {
    this.updateView(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateView(newProps);
  }

  updateView(props) {
    this.nav_map = {
      home: { name: '首页' },
      config: { name: '基础', right: {
          name: '完成',
          path: '/config/done'
        }
      },
      login: { name: '登录' }, // other use /config/done
      relay: { name: '跳转中' }, 
      reply: { name: '回复', left: {
          name: '返回',
          path: -1
        }
      },
      auth: { name: '验证', left: {
          name: '返回',
          path: -1
        },
        right: {
          name: '获取',
          path: {
            pathname: '/auth',
            state: {
              captcha: true
            }
          }
        }
      },
      html: {
        name: null,
        left: {
          name: '返回',
          path: -1
        }
      },
      area: {
        name: '定位'
      },
      nickname: {
        name: '昵称'
      },
      notifications: {
        name: '通知',
        left: {
          name: '客服',
          path: {
            pathname: '/reply',
            state: {
              title: '系统客服',
              data: {
                activity: '',
                uid: 'admin'
              },
            }
          }
        },
        right: {
          name: props.location.state.status == undefined || props.location.state.status == 0 ? '已读':'未读',
          path: {
            pathname: '/notifications',
            state: {
              status: props.location.state.status == undefined || props.location.state.status == 0 ? 1:0
            }
          }
        }
      },
      article: {
        left: {
          name: '返回',
          path: -1
        },
        right: {
          name: '搜索',
          route: 'article'
        }
      },
      comment_edit: {
        name: '发言',
        left: {
          name: '返回',
          path: -1
        }
      },
      explore: {
        name: '发现',
        right: {
          name: '搜索',
          path: '/article'
        }
      },
      profile: {
        name: '个人资料'
      },
    }
    // reply data
    if (props.location.state.data != undefined) {
      if (props.location.state.data.content != undefined && props.location.state.data.content != '') {
        this.nav_map.comment_edit.right = { name: '举报', path: { pathname: '/comment_edit', state: { data: props.location.state.data, report: true } } }
      }
      if (props.location.state.data.uid != undefined && props.location.state.data.uid != 'admin') {
        this.nav_map.reply.right = { name: '举报', path: { pathname: '/reply', state: { title:props.location.state.data.from, data: props.location.state.data, report: true } } }
      }
    }
    
    let keys = props.location.pathname.split("/");
    this.header = this.nav_map[keys[1]];
    //console.log(props.routeParams);
    this.right = this.header.right
    if (props.params.right != undefined && props.params.right != 'show') {
      this.right = undefined;
    }

    const title = props.location.state.title || undefined;
    if (title != undefined) {
      this.header.name = title;
    }

    if (this.header.name === undefined) {
      this.title = this.titleSearch();
    } else {
      this.title = this.titleNormal();
    }
  }

  render() {
    return (
      <NavigationHeader
      style={styles.header}
      {...this.props}
      renderLeftComponent={() => this.renderIcon(this.header.left)}
      renderTitleComponent={() => this.title}
      renderRightComponent={() => this.renderIcon(this.right)}
    />
    );
  }
}

export default Header;