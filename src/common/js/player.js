export class Video {
  constructor({name, image, clipId, partId}) {
    this.name = name
    this.image = image
    this.clipId = clipId
    this.partId = partId
    this.type = 'selfData'
  }
}

export function createVideo(obj) {
  // 从播放历史播放不用格式化
  if (obj.type === 'selfData') {
    return obj
  }

  // v-menu对象类型
  if (obj.info && !obj.videoId) {
    return new Video({
      name: obj.name,
      image: obj.image,
      clipId: parseInt(obj.info.clipId),
      partId: parseInt(obj.info.playPartId)
    })
  }

  if (obj.videoId) {
    return new Video({
      name: obj.title,
      image: obj.image,
      clipId: parseInt(obj.clipId),
      partId: parseInt(obj.videoId)
    })
  }

  if (obj.isIntact) {
    return new Video({
      name: obj.title,
      image: obj.image,
      clipId: parseInt(obj.clipId),
      partId: parseInt(obj.partId)
    })
  }

  if (obj.newest) {
    return new Video({
      name: obj.newest,
      image: obj.image,
      clipId: parseInt(obj.clidId),
      partId: parseInt(obj.partId)
    })
  }

  return new Video({
    name: obj.name,
    image: obj.imgHUrl,
    clipId: parseInt(obj.jumpId),
    partId: parseInt(obj.childId)
  })
}