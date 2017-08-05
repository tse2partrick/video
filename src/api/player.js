import {jsonp} from 'common/js/jsonp'

export function getVideoUrl(clipId, partId) {
  let url = 'http://mdata.api.mgtv.com/remaster/uc/getSource'
  let data = Object.assign({}, {
    t: new Date().getTime(),
    abroad: 0,
    partId: partId,
    clipId: clipId
  })

  return jsonp(url, data)
}

export function getFstlvlType(clipId, partId) {
  let url = 'http://v5m.api.mgtv.com/remaster/vrs/getByPartId'
  let data = Object.assign({}, {
    abroad: 0,
    partId: partId,
    clipId: clipId
  })

  return jsonp(url, data)
}

export function getLikeVideo(childId, fstlvlType) {
  let url = 'http://rc.mgtv.com/msite/like'
  let data = Object.assign({}, {
    abroad: 0,
    guid: 885708550624907264,
    vid: childId,
    c: fstlvlType
  })

  return jsonp(url, data)
}

export function getVideoListByPartId(partId) {
  let url = 'http://v5m.api.mgtv.com/remaster/vrs/getVideoListByPartId'
  let data = Object.assign({}, {
    abroad: 0,
    partId: partId,
    pageNum: 1,
    pageSize: 60,
    needLocate: 1
  })

  return jsonp(url, data)
}

export function getVideoListByClipId(clipId) {
  let url = 'http://v5m.api.mgtv.com/remaster/vrs/getVideoListByClipId'
  let data = Object.assign({}, {
    abroad: 0,
    clipId: clipId,
    pageNum: 1,
    pageSize: 60
  })

  return jsonp(url, data)
}