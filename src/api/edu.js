import {jsonp} from 'common/js/jsonp'

export function getEduMenu() {
  let url = 'http://v5m.api.mgtv.com/remaster/listV5/getListConfig'
  let data = Object.assign({}, {
    abroad: 0,
    fstlvlId: 115
  })

  return jsonp(url, data)
}

export function getEdu(kindId, areaId, chargeId, edtionId) {
  let url = 'http://v5m.api.mgtv.com/remaster/listV5/search'

  let data = Object.assign({}, {
    abroad: 0,
    fstlvlId: 115,
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

