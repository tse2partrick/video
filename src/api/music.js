import {jsonp} from 'common/js/jsonp'

export function getMusicData() {
  let url = 'http://st.bz.mgtv.com/odin/c1/channel/index'
  let data = Object.assign({}, {
    version: '5.0',
    vclassId: 145,
    type: 7
  })

  let options = {
    param: 'callback',
    prefix: '',
    name: 'mgtvcallback_ci'
  }

  return jsonp(url, data, options)
}

export function getSubMusicData(vclassId) {
  let url = 'http://st.bz.mgtv.com/odin/c1/channel/index'
  let data = Object.assign({}, {
    version: 5.0,
    vclassId: 638,
    type: 7
  })
  let options = {
    param: 'callback',
    name: 'mgtvcallback_ci',
    prefix: ''
  }

  return jsonp(url, data, options)
}