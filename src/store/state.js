import {localConfig} from 'common/js/config'
import {isMobile} from 'common/js/util'

const state = {
  channel: JSON.parse(localStorage.getItem(localConfig.channel)) || [
    {cName: '电影', eName: 'movie'},
    {cName: '电视剧', eName: 'tv'},
    {cName: '综艺', eName: 'variety'},
    {cName: '动漫', eName: 'cartoon'},
    {cName: '音乐', eName: 'music'},
    {cName: '纪录片', eName: 'doc'},
    {cName: '游戏', eName: 'game'},
    {cName: '新闻', eName: 'news'},
    {cName: '教育', eName: 'edu'}
  ],
  currentChannel: '',
  needScroll: 0,

  // 芒果数据有点杂，有clipId, partId, videoId, clidId代表视频号，所以上面统一为clip和part， video也统一为自定义格式的对象数据，在mutations操作的时候格式化
  currentClipId: '',
  currentPartId: '',
  currentVideo: {},

  currentPlayUrl: '',
  needResetPage: 0,

  // 本地存储播放历史，如果没有就为空
  playHistory: localStorage.getItem(localConfig.playHistory) ? JSON.parse(localStorage.getItem(localConfig.playHistory)) : [],
  currentSearchResult: [],

  // 移动端判断
  isMobile: isMobile()
}

export default state