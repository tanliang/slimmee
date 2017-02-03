import Model from '../model';

export default class ModelMisc extends Model {
  search(cate, value, callback) {
    const expire = 240 * 3600;
    if (value != '') {
      let url = 'misc/search/?cate=' + cate + '&value=' + value;
      this.query(url, callback, expire);
    } else {
      let resp = this.getCache(cate + 'History');
      let data = [];
      if (resp != '') {
        data = JSON.parse(resp);
        data = Object.keys(data).sort(function(a, b) {
          return data[a] - data[b]
        }).reverse().slice(0, 300);
      }
      callback({
        data
      });
    }
  }

  history(cate, value) {
    let key = cate + 'History';
    let resp = this.getCache(key);
    let data = {};
    if (resp != '') {
      data = JSON.parse(resp);
    }
    data[value] = this.initSecTime();
    this.setCache(key, JSON.stringify(data));
  }

  explore(callback, date_upd) {
    const expire = 0;
    let area = this.getCache('cfg_area');
    let url = 'article/explore/?date_upd=' + date_upd + '&area=' + area;
    this.query(url, callback, expire);
  }
}