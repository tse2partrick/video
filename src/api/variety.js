import {jsonp} from 'common/js/jsonp'

export function getVarietyMenu() {
  let url = 'http://v5m.api.mgtv.com/remaster/listV5/getListConfig'
  let data = Object.assign({}, {
    abroad: 0,
    fstlvlId: 1
  })

  return jsonp(url, data)
}

export function getVariety(kindId, areaId, chargeId) {
  let url = 'http://v5m.api.mgtv.com/remaster/listV5/search'
  let data = Object.assign({}, {
    abroad: 0,
    fstlvlId: 1,
    ic: 1,
    pageNum: 1,
    pageSize: 30,
    kind: kindId,
    area: areaId,
    chargeInfo: chargeId
  })

  return jsonp(url, data)
}