import {jsonp} from 'common/js/jsonp'

export function getGameData() {
  let url = 'http://st.bz.mgtv.com/odin/c1/channel/index'
  let data = Object.assign({}, {
    version: '5.0',
    vclassId: 139,
    type: 7
  })
  let options = {
    prefix: '',
    param: 'callback',
    name: 'mgtvcallback_ci'
  }

  return jsonp(url, data, options)
}

export function getSubGameData(vclassId) {
  let url = 'http://st.bz.mgtv.com/odin/c1/channel/index'
  let data = Object.assign({}, {
    version: '5.0',
    vclassId,
    type: 7
  })

  let options = {
    prefix: '',
    param: 'callback',
    name: 'mgtvcallback_ci'
  }

  return jsonp(url, data, options)
}