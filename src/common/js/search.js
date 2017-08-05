export class SearchRes {
  constructor({title, image, story, clidId, partId, newest}) {
    this.title = title
    this.image = image
    this.story = story
    this.clidId = clidId
    this.partId = partId
    this.newest = newest
  }
}

export function createSearchRes(obj) {
  let h5Url = obj.s_h5PlayUrl || obj.s_h5Url
  h5Url = h5Url.split('/')

  // y - x 从大到小排序
  obj.video_full.sort((x, y) => {
    return parseInt(y.serialno) - parseInt(x.serialno)
  })

  let newest = obj.video_full[0].partName

  return new SearchRes({
    title: obj.title,
    image: obj.image,
    story: obj.min_story,
    clidId: h5Url[h5Url.length - 2],
    partId: h5Url[h5Url.length - 1],
    newest
  })
}