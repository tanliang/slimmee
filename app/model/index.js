import Toast from 'react-native-root-toast';
import Realm from 'realm';
import {
  nativeHistory
} from 'react-router-native';

const dateFormat = require('dateformat');

const MessageScheme = {
  name: 'Message',
  properties: {
    cate: 'string',
    content: 'string',
    from: {
      type: 'string',
      'default': ''
    },
    uid: 'string',
    time: 'int',
    upd: {
      type: 'int',
      'default': 0
    },
  }
};

const ExploreScheme = {
  name: 'Explore',
  primaryKey: 'id',
  properties: {
    data: 'string',
    id: 'string'
  }
};

const CacheScheme = {
  name: 'Cache',
  primaryKey: 'name',
  properties: {
    name: 'string',
    data: 'string',
    time: 'int'
  }
};

const RecordScheme = {
  name: 'Record',
  primaryKey: 'time_add',
  properties: {
    time_add: 'string',
    cate: 'string',
    json: 'string',
    upd: {
      type: 'int',
      'default': 0
    },
  }
};

const WeightScheme = {
  name: 'Weight',
  primaryKey: 'time_add',
  properties: {
    time_add: 'string',
    kg: 'string'
  }
};

// const apiHost = 'http://192.168.1.116/api/';
// const apiHost = 'http://127.0.0.1/api/';
const apiHost = 'http://10.24.3.122/api/';

export default class Model {
  constructor() {
    this.realm = new Realm({
      schema: [
        MessageScheme,
        ExploreScheme,
        CacheScheme,
        RecordScheme,
        WeightScheme
      ],
      schemaVersion: 1
    });
  }

  raw() {
    return this.realm.objects(this.constructor.name.substr(5));
  }

  fetch(url, callback = undefined, debug = false) {
    let toast = Toast.show("获取数据中，请等待...", {
      duration: 9000,
      position: Toast.positions.CENTER
    });
    var p = Promise.race([
      fetch(apiHost + url),
      new Promise(function(resolve, reject) {
        setTimeout(() => reject(new Error('request timeout')), 9000)
      })
    ]);
    p.then((response) => {
        if (debug) {
          console.log('get:' + url);
          console.log('resp:');
          console.log(response);
        }
        return response.json();
      })
      .then((responseJson) => {
        Toast.hide(toast);
        if (callback != undefined) {
          callback(responseJson);
        }
        if (responseJson.error != undefined && responseJson.error == '404') {
          Toast.show("您的账户已在其他设备登录，请重新验证。", {
            position: Toast.positions.CENTER
          }, 6000);
          nativeHistory.replace('/login');
        }
      })
      .catch((error) => {
        console.log("network error");
        console.log(error);
        Toast.hide(toast);
        Toast.show("无法连接，请稍后再试", {
          position: Toast.positions.CENTER
        });
      });
  }

  post(url, data, callback = undefined, timeout = 9000, debug = false) {
    var p = Promise.race([
      fetch(apiHost + url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }),
      new Promise(function(resolve, reject) {
        setTimeout(() => reject(new Error('request timeout')), timeout)
      })
    ]);
    p.then((response) => {
        if (debug) {
          console.log('post:' + url);
          console.log('with:');
          console.log(data);
          console.log('resp:');
          console.log(response);
        }
        return response.json();
      })
      .then((responseJson) => {
        if (callback != undefined) {
          callback(responseJson);
        }
        if (responseJson.error != undefined && responseJson.error == '404') {
          Toast.show("您的账户已在其他设备登录，请重新验证。", {
            position: Toast.positions.CENTER
          }, 6000);
          nativeHistory.replace('/login');
        }
      })
      .catch((error) => {
        console.log("network error");
        console.log(error);
        if (callback != undefined) {
          callback({
            success: 0,
            data: '无法连接，请稍后再试'
          });
        }
      });
  }

  initSecTime() {
    return Date.parse(new Date()) / 1000;
  }

  initDate() {
    return dateFormat(new Date(), 'yyyymmdd');
  }

  initDateTime() {
    return dateFormat(new Date(), 'yyyymmddHHMMss');
  }

  initISODate() {
    return dateFormat(new Date(), 'isoDate');
  }

  // expire=0, always fetch from web
  query(url, callback, expire = 0) {
    const key = url;

    let res = ''
    if (expire > 0) {
      console.log('Get cache: ' + url);
      res = this.getCache(key, expire);
      if (res != '') {
        callback(JSON.parse(res));
      }
    }

    if (res == '') {
      console.log('Get web: ' + url);
      let self = this;
      this.fetch(url, function(resp) {
        let data = JSON.stringify(resp);
        self.setCache(key, data);
        callback(resp);
      });
    }
  }

  // expire=0, exclude time
  getCache(key, expire = 0, res = '') {
    let resp = this.realm.objectForPrimaryKey('Cache', key);
    if (resp != undefined) {
      if (expire == 0 || (expire > 0 && this.initSecTime() - resp.time < expire)) {
        res = resp.data;
      }
    }
    return res;
  }

  // use cache store: token, privacy code, etc
  setCache(key, data) {
    this.realm.write(() => {
      this.realm.create(
        'Cache', {
          time: this.initSecTime(),
          name: key,
          data: data
        },
        true
      );
    });
  }

  deleteAll() {
    this.realm.write(() => {
      this.realm.deleteAll();
    });
  }

  // record同步，服务端只返回近90 天的数据，不超过用户注册日期
  sync(callback, url, data = {}, auth = true, timeout = 9000) {
    if (auth) {
      data.token = this.getCache('cfg_token');
    }
    this.post(url, data, callback, timeout, true);
  }
  
  add(data) {
    this.realm.write(() => {
      if (data.length == undefined) {
        data = [data];
      }
      for (let idx in data) {
        this.realm.create(this.constructor.name.substr(5), data[idx], true);
      }
    });
  }

  upd(data) {
    this.realm.write(() => {
      if (data.length == undefined) {
        data = [data];
      }
      for (let idx in data) {
        if (data[idx].upd == 0) {
          data[idx].upd = 1;
        }
      }
    });
  }
}