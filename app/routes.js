/* @noflow */

import React from 'react';
import {
  NetInfo
} from 'react-native';
import {
  Route,
  StackRoute,
  TabsRoute,
  Router,
  nativeHistory
} from 'react-router-native';
import {
  component
} from './components';
import Header from './components/Common/Header';
import {
  Master
} from './components/Master';
import {
  Home
} from './components/Home';
import {
  Explore
} from './components/Explore';
import {
  Login
} from './components/Misc/Login';
import {
  Auth
} from './components/Misc/Auth';
import {
  Loading
} from './components/Misc/Loading';
import {
  Relay
} from './components/Misc/Relay';
import {
  Config
} from './components/Misc/Config';
import {
  Article
} from './components/Misc/Article';
import {
  Area
} from './components/Misc/Area';
import {
  Nickname
} from './components/Misc/Nickname';
import {
  Html
} from './components/Misc/Html';
import {
  Reply
} from './components/Misc/Reply';
import {
  Notifications
} from './components/Notifications';
import {
  Profile
} from './components/Profile';
import {
  CommentEdit
} from './components/Comment/Edit';
import {
  IndexRedirect
} from 'react-router';
import Toast from 'react-native-root-toast';
import ModelMisc from './model/Misc';

import {
  NAVIGATION_HEADER_HEIGHT
} from './components/styles';

const SECOND_HEADER = NAVIGATION_HEADER_HEIGHT;
const THIRD_HEADER = NAVIGATION_HEADER_HEIGHT * 2;

const redirectToNotifications = (nextState, replace) => {
  replace('/notifications');
};

const redirectToHome = (nextState, replace) => {
  replace('/loading');
};

let exit = 0;

function handleHardwareBackPress(router) {
  const misc = new ModelMisc();
  const entries = ['home', 'login', 'loading'];
  const paths = router.location.pathname.split("/");
  if (misc.getCache('cfg_weight') != '' && entries.indexOf(paths[1]) == -1) {
    nativeHistory.go(-1);
    return true;
  }
  // Pop currently active stack
  exit++;
  if (exit == 2) {
    return false;
  }
  Toast.show("再按一次退出应用");
  setTimeout(() => {
    exit = 0;
  }, 3000);
  return true;
}

// let network = false;
// NetInfo.isConnected.addEventListener(
//   'change', 
//   function(status){network = status;}
// );

// let tid = null;
// function sync() {
//   if (network) {
//     let queue = new ModelQueue();
//     queue.sync();
//     console.log('route sync at '+Date.parse(new Date())/1000);
//   }
//   if (tid != null) {clearTimeout(tid);}
//   tid = setTimeout(sync, 5000);
// }
// sync();

const requireAuth = (nextState, replace) => {
    const misc = new ModelMisc();
    if (misc.getCache('cfg_weight') == '') {
      // if (config.verify()) {
      // Redirect to Home page if not an Admin
      replace({
        pathname: '/loading'
      });
    }
  }
  // area 只用于内部跳转，next = go(-1)
const routes = (
  <Router history={nativeHistory} onHardwareBackPress={handleHardwareBackPress}>

    <TabsRoute path="all" component={component('#f4f4f4')}>
      <TabsRoute path="notab" component={component('#f4f4f4')} overlayComponent={Header}>
        <Route path="/login" component={Login}/>
        <Route path="/auth" component={Auth}/>
        <Route path="/config(/:right)" component={Config}/>
        <Route path="/area" component={Area}/>
        <Route path="/nickname" component={Nickname}/>
        <Route path="/reply" component={Reply}/>
        <Route path="/relay" component={Relay}/>
        <Route path="/html" component={Html}/>
        <Route path="/article" component={Article}/>
        <Route path="/comment_edit" component={CommentEdit}/>
        <TabsRoute path="master" component={Master} onEnter={requireAuth}>
          <Route path="/home" component={Home}/>
          <Route path="/explore" component={Explore}/>
          <Route path="/notifications" component={Notifications}/>
          <Route path="/profile" component={Profile}/>
        </TabsRoute>
      </TabsRoute>
      <Route path="/" onEnter={redirectToHome} component={component('#41BDE2')}/>
      <Route path="/loading" component={Loading}/>
    </TabsRoute>
  </Router>
);

export default routes;