import {jsonp} from 'common/js/jsonp'

export function getMovieMenu() {
  let url = 'http://v5m.api.mgtv.com/remaster/listV5/getListConfig'
  let data = Object.assign({}, {
    abroad: 0,
    fstlvlId: 3
  })

  return jsonp(url, data)
}

export function getMovie(kindId, areaId, chargeId, edtionId) {
  let url = 'http://v5m.api.mgtv.com/remaster/listV5/search'

  let data = Object.assign({}, {
    abroad: 0,
    fstlvlId: 3,
    ic: 1,
    pageNum: 1,
    pageSize: 30,
    kind: kindId,
    area: areaId,
    chargeInfo: chargeId,
    edition: edtionId
  })

  return jsonp(url, data)
}

