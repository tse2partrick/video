export class SimplizeData {
  constructor({imgHUrl, phoneImgUrl, name, subName, moduleType, jumpId, childId, time}) {
    this.imgHUrl = imgHUrl
    this.phoneImgUrl = phoneImgUrl
    this.name = name
    this.subName = subName
    this.moduleType = moduleType
    this.jumpId = jumpId
    this.childId = childId
    this.time = time
  }
}

export function createSimplizeData(obj) {
  return new SimplizeData({
    imgHUrl: obj.imgHUrl,
    phoneImgUrl: obj.phoneImgUrl,
    name: obj.name,
    subName: obj.subName,
    moduleType: obj.moduleType,
    jumpId: obj.jumpId,
    childId: obj.childId,
    time: obj.time
  })
}