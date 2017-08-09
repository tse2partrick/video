<template>
  <div class="personal">
    <div class="content-wrapper" :class="{'b-filter': showSure}">
      <div class="title-wrapper">
        <span class='title'>播放历史</span>
        <span class="delAll iconfont icon-delete" @click="delAll"></span>
      </div>
      <div class="video-wrapper" v-for="item in playHistory" @click="goToPlay(item)">
        <div class="image">
          <img width="100%" height="100%" :src="item.image" ref="videoImage">
        </div>
        <div class="video-title-wrapper">
          <div class="video-title" ref="videoTitle">{{item.name}}</div>
          <div class="video-percent" ref="videoPercent">播放进度：{{serialize(item.percent)}}</div>
          <div class="video-viewtime" ref="viewTime">{{item.viewtime}}</div>
        </div>
        <div class="del-one" @click.stop="delOne(item)">
          <i class="icon-del-one iconfont icon-delete-one"></i>
        </div>
      </div>
    </div>
    <sure-box :title="delAllTitle" v-show="showSure" @sure="onSure" @cancel="onCancel"  @clickBlank="onCancel" ref="sureBox"></sure-box>
    <div class="no-history" v-show="!playHistory.length">没有播放记录</div>
  </div>
</template>

<script type="text/javascript">
  import {mapGetters, mapMutations} from 'vuex'
  import {localConfig} from 'common/js/config'
  import SureBox from 'base/sure-box/sure-box'

  export default {
    data() {
      return {
        delAllTitle: '您确定要清空所有?',
        showSure: false
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    mounted() {
      setTimeout(() => {
        this._initPercentPadding()
      }, 200)
    },
    activated() {
      this.$nextTick(() => {
        this._initPercentPadding()
      })
    },
    methods: {
      _initPercentPadding() {
        let image = this.$refs.videoImage
        let title = this.$refs.videoTitle
        let percent = this.$refs.videoPercent
        let viewTime = this.$refs.viewTime
        if (image && percent && title && viewTime) {
          for (let i = 0; i < image.length; i++) {
            if (percent[i].style.padding) {
              continue
            }
            if (percent[i].clientHeight + title[i].clientHeight + viewTime[i].clientHeight >= image[i].clientHeight) {
              percent[i].style.padding = ''
            } else {
              let delta = image[i].clientHeight - title[i].clientHeight - percent[i].clientHeight - viewTime[i].clientHeight
              percent[i].style.padding = delta / 2 + 'px 0'
            }
          }
        }
      },
      serialize(time) {
        if (!time) {
          return '0%'
        }

        time *= 100
        time = time | 0
        return time + '%'
      },
      onSure() {
        this.showSure = false
        this.setPlayHistory([])
        localStorage.setItem(localConfig.playHistory, '')
      },
      onCancel() {
        this.showSure = false
      },
      delAll() {
        if (!this.playHistory.length) {
          return
        }
        this.showSure = true
      },
      delOne(item) {
        let playHistory = this.playHistory.slice()
        let index = playHistory.findIndex((i) => {
          return i.partId === item.partId
        })

        playHistory.splice(index, 1)

        this.setPlayHistory(playHistory)
        localStorage.setItem(localConfig.playHistory, playHistory)
      },
      goToPlay(item) {
        this.setCurrentClipId(item.clipId)
        this.setCurrentPartId(item.partId)
        this.setCurrentVideo(item)
        this.$router.push({
          path: '/player'
        })
      },
      ...mapMutations({
        'setCurrentClipId': 'SET_CURRENT_CLIP_ID',
        'setCurrentPartId': 'SET_CURRENT_PART_ID',
        'setCurrentVideo': 'SET_CURRENT_VIDEO',
        'setPlayHistory': 'SET_PLAY_HISTORY'
      })
    },
    components: {
      SureBox
    }
  }
</script>

<style type="text/css" lang="stylus">
  @import "~common/stylus/variable"
  .personal
    .b-filter
      filter: blur(2px)
      transition: 0.5s
    .content-wrapper
      font-size: 10px
      color: #777
      .title-wrapper
        position: relative
        text-align: center
        .title
          display: inline-block
          text-align: center
          font-size: 18px
          padding: 20px 0
          color: $color-sub-theme
        .delAll
          position: absolute
          display: inline-block
          right: 0
          padding: 20px
          font-size: 18px
          color: $color-sub-theme
      .video-wrapper
        box-sizing: border-box
        padding: 10px
        .image
          display: inline-block
          width: 40%
        .video-title-wrapper
          display: inline-block
          width: 50%
          vertical-align: top
          font-size: 15px
          box-sizing: border-box
          padding-left: 10px
          .video-title
            color: $color-theme
            font-weight: bold
          .video-percent
            color: #999
        .del-one
          display: inline-block
          vertical-align: top
          color: $color-sub-theme
          padding: 0 5px
    .no-history
      font-size: 15px
      text-align: center
</style>