import {jsonp} from 'common/js/jsonp'

export function getSuggest(q) {
  let url = 'http://s5.hunantv.com/suggest'
  let data = Object.assign({}, {
    q
  })
  let options = {
    prefix: '',
    param: 'callback',
    name: 'jsonp_rxrtbt998rgh252'
  }
  return jsonp(url, data, options)
}

export function getSearchRes(k) {
  let url = 'http://mso.api.mgtv.com/so'
  let data = Object.assign({}, {
    k,
    limit: 100,
    page: 1,
    sort: 0,
    ty: 0,
    du: 0,
    pt: 0
  })

  return jsonp(url, data)
}