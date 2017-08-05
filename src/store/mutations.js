import * as types from './mutation-types'
import {createVideo} from 'common/js/player'

const mutations = {
  [types.SET_CHANNEL](state, channel) {
    state.channel = channel
  },
  [types.SET_CURRENT_CHANNEL](state, cChannel) {
    state.currentChannel = cChannel
  },
  [types.SET_NEED_SCROLL](state, needScroll) {
    state.needScroll = needScroll
  },
  [types.SET_CURRENT_CLIP_ID](state, currentClipId) {
    state.currentClipId = currentClipId
  },
  [types.SET_CURRENT_PART_ID](state, currentPartId) {
    state.currentPartId = currentPartId
  },
  [types.SET_CURRENT_PLAY_URL](state, currentPlayUrl) {
    state.currentPlayUrl = currentPlayUrl
  },
  [types.SET_NEED_RESET_PAGE](state, needResetPage) {
    state.needResetPage = needResetPage
  },
  [types.SET_PLAY_HISTORY](state, playHistory) {
    state.playHistory = playHistory
  },
  [types.SET_CURRENT_VIDEO](state, video) {
    state.currentVideo = createVideo(video)
  },
  [types.SET_CURRENT_SEARCH_RESULT](state, resArr) {
    state.currentSearchResult = resArr
  }
}

export default mutations