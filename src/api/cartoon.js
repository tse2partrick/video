import {jsonp} from 'common/js/jsonp'

export function getCartoonMenu() {
  let url = 'http://v5m.api.mgtv.com/remaster/listV5/getListConfig'
  let data = Object.assign({}, {
    abroad: 0,
    fstlvlId: 50
  })

  return jsonp(url, data)
}

export function getCartoon(kindId, areaId, fitAgeId, editionId) {
  let url = 'http://v5m.api.mgtv.com/remaster/listV5/search'
  let data = Object.assign({}, {
    abroad: 0,
    fstlvlId: 50,
    ic: 1,
    pageNum: 1,
    pageSize: 30,
    kind: kindId,
    area: areaId,
    fitAge: fitAgeId,
    edition: editionId
  })

  return jsonp(url, data)
}