import Model from '../model';

export default class ModelRecord extends Model {
  history(cate, name) {
    let res = undefined;
    let all = this.raw().filtered('cate = "' + cate + '"');
    for (let idx in all) {
      let json = JSON.parse(all[idx].json);
      if (json.name == name) {
        res = json;
        break;
      }
      if (idx == 299) {
        break;
      }
    }
    return res;
  }

}