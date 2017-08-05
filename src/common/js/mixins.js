import {createSimplizeData} from 'common/js/music'
export const menuMixin = {
  methods: {
    _simplizeMenu(arr) {
      let ret = []
      arr.forEach((i) => {
        ret.push(i.filters)
      })

      return ret
    }
  }
}

export const secMenuMixin = {
  methods: {
    _simplizeData(arr) {
      let ret = {}
      let banner = []
      let title = []
      let scrossm = []
      let bcrossm = []
      arr.forEach((i) => {
        if (i.moduleType === 'banner') {
          i.moduleData.forEach((item, index) => {
            item.moduleType = i.moduleType
            banner.push(createSimplizeData(item))
          })
        }
        if (i.moduleType === 'title' || i.moduleType === 'ipmodel') {
          let tmpTitle = {}
          tmpTitle.name = i.moduleData[0].name
          tmpTitle.title = i.moduleTitle
          title.push(tmpTitle)
        }
        if (i.moduleType === 'scrossm' || i.moduleType === 'noncross') {
          let tmpScrossm = {}
          tmpScrossm.title = i.moduleTitle
          i.moduleData.forEach((item, index) => {
            item.moduleType = i.moduleType
            tmpScrossm[index] = createSimplizeData(item)
          })
          scrossm.push(tmpScrossm)
        }
        if (i.moduleType === 'bcrossm') {
          let tmpBscrossm = {}
          tmpBscrossm.title = i.moduleTitle
          i.moduleData[0].moduleType = i.moduleType
          tmpBscrossm.data = createSimplizeData(i.moduleData[0])
          bcrossm.push(tmpBscrossm)
        }
      })

      scrossm.forEach((i) => {
        let sTitleIndex
        if (i.title.lastIndexOf('-') > 0) {
          sTitleIndex = i.title.lastIndexOf('-')
        } else {
          sTitleIndex = i.title.indexOf('小图')
        }
        if (sTitleIndex > 0) {
          i.title = i.title.slice(0, sTitleIndex)
        }
        title.forEach((item) => {
          if (item.name.indexOf(i.title.slice(3, 3)) >= 0) {
            if (!ret[i.title]) {
              ret[i.title] = {}
              ret[i.title].title = i.title
            }
            if (!ret[i.title].data) {
              ret[i.title].data = []
            }
          }
        })
        ret[i.title].data.push(i)
      })

      bcrossm.forEach((i) => {
        let sTitleIndex
        if (i.title.lastIndexOf('-') > 0) {
          sTitleIndex = i.title.lastIndexOf('-')
        } else {
          sTitleIndex = i.title.indexOf('大图')
        }
        if (sTitleIndex > 0) {
          i.title = i.title.slice(0, sTitleIndex)
        }
        title.forEach((item) => {
          if (item.name.indexOf(i.title.slice(3, 3)) >= 0) {
            if (!ret[i.title]) {
              ret[i.title] = {}
              ret[i.title].title = i.title
            }
            if (!ret[i.title].data) {
              ret[i.title].data = []
            }
          }
        })
        ret[i.title].data.push(i)
      })

      let tmpRet = {}
      for (let k in ret) {
        let v = ret[k]
        if (!tmpRet[v.title]) {
          tmpRet[v.title] = {}
          tmpRet[v.title].title = v.title
          tmpRet[v.title].data = []
        }
        for (let key in v) {
          let value = v[key]
          if (key === 'data') {
            value.forEach((i) => {
              for (let iK in i) {
                let iV = i[iK]
                if (iK !== 'title') {
                  tmpRet[v.title].data.push(iV)
                }
              }
            })
          }
        }
      }
      ret = []
      for (let k in tmpRet) {
        ret.push(tmpRet[k])
      }

      ret.forEach((i) => {
        i.data.forEach((item, index) => {
          if (item.moduleType === 'bcrossm') {
            i.data.splice(0, 0, i.data[index])
            i.data.splice(index + 1, 1)
          }
        })
      })

      return {banner, ret}
    }
  }
}