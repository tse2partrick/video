<template>
  <div class="player">
    <div class="empty_block" ref="emptyBlock" v-show="fixedVideo"></div>
    <video class="video" poster="" preload="auto" controls="controls" width="100%" playsinline="" x-webkit-airplay="deny" webkit-playsinline="" autoplay=false @timeupdate="onTimeUpdate" ref="video">
    </video>
    <div class="lightBtn" @click="toggleLight" ref="lightBtn">{{getLightState}}</div>
    <div class="coll-name">{{collName}}</div>
    <div class="serial" v-if="serialList">
      <div class="serial-tab" ref="serialTab">
        <div class="serial-box" ref="serialBox">
          <div class="serial-item-wrapper" v-for="(item, index) in serialList" @click="onChangeSerialList(item)">
            <div class="serial-item" :class="{'serial-active': currentSerialIndex === index}">{{item.seasonName}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="playlist-tab" ref="playlistTab">
      <div class="playlist-box" ref="playlistBox">
        <div class="item" v-for="(item, index) in videoList" @click="goToPlayList(item, index)">
          <div class="image" ref="listImage">
            <img width="100%" height="100%" v-lazy="item.image">
            <span class="time">{{item.duration}}</span>
            <div class="image-playing" v-show="currentPlayIndex === index" ref="imagePlaying">
              <span class="playing-title">播放中</span>
            </div>
          </div>
          <p class="title">{{item.title}}</p>
        </div>
      </div>
    </div>
    <div class="like-video-wrapper" v-if="likeVideo && likeVideo.length">
      <div class="like-title">看了还会看</div>
      <div class="like-video" v-for="(item, index) in likeVideo" @click="goToPlay(item)">
        <div class="like-img" ref="likeImg">
          <img width="100%" height="100%" v-lazy="item.image">
          <span class="time">{{item.desc}}</span>
        </div>
        <div class="title-wrapper">
          <p class="title" ref="title">{{item.title}}</p>
          <p class="subtitle" ref="subtitle">{{item.info}}</p>
        </div>
      </div>
    </div>
    <div class="blackMode" v-show="lightDown" ref="blackMode"></div>
  </div>
</template>

<script type="text/javascript">
  import {getVideoUrl, getLikeVideo, getFstlvlType, getVideoListByPartId, getVideoListByClipId} from 'api/player'
  import {RES_OK, localConfig} from 'common/js/config'
  import {scrollX} from 'common/js/util'
  import {mapGetters, mapMutations} from 'vuex'
  import originJsonp from 'jsonp'

  const titleMarginBottom = 15
  export default {
    data() {
      return {
        srcUrl: [],
        playUrl: '',
        cId: null,
        pId: null,
        likeVideo: [],
        fstlvlType: null,
        playing: false,
        lightDown: false,
        fixedVideo: false,
        videoList: [],
        currentPlayIndex: null,
        collName: '',
        serialList: [],
        currentSerialIndex: null,
        currentTime: 0,
        totalTime: 0
      }
    },
    created() {
      this.cId = this.currentClipId
      this.pId = this.currentPartId
      if (!this.cId || !this.pId) {
        this.$router.push({
          path: `/${this.currentChannel}`
        })
      }
      this.scrollY = 0
    },
    mounted() {
      this.$nextTick(() => {
        this._getVideoOffsetTop()
      })
    },
    updated() {
      this.$nextTick(() => {
        this._setTitleStyle()
        this._initTab()
      })
    },
    activated() {
      this.stopScrollListen = false
      this.cId = this.currentClipId
      this.pId = this.currentPartId
      this.startPlay(this.cId, this.pId)
      this.scrollHandle = () => {
        if (document.body.scrollTop > this.videoOffsetTop) {
          this._fixedVideo(true)
        } else {
          this._fixedVideo(false)
        }
      }
      window.addEventListener('scroll', this.scrollHandle)

      document.body.scrollTop = 0

      this._lightBtnFade()

      this.$refs.video.addEventListener('canplay', this.onCanPlay, {
        once: true
      })
    },
    deactivated() {
      this._savePlayHistory()
      if (this.playing) {
        this.$refs.video.pause()
      }
      this.$refs.video.src = ''
      this.serialList = []
      this.currentSerialIndex = -1
      window.removeEventListener('scroll', this.scrollHandle)
      this.$refs.video.removeEventListener('canplay', this.onCanPlay)
    },
    computed: {
      getLightState() {
        return this.lightDown ? '开灯' : '关灯'
      },
      ...mapGetters([
        'currentClipId',
        'currentPartId',
        'currentChannel',
        'currentVideo',
        'playHistory'
      ])
    },
    methods: {
      onTimeUpdate(e) {
        this.currentTime = this.$refs.video.currentTime === undefined ? 0 : this.$refs.video.currentTime
      },
      goToPlay(item) {
        this._savePlayHistory()
        this.setCurrentVideo(item)
        this.setCurrentClipId(item.clipId)
        this.setCurrentPartId(item.videoId)
        this.$refs.video.addEventListener('canplay', this.onCanPlay, {
          once: true
        })
        this.startPlay(item.clipId, item.videoId)
        this._initTab()
      },
      goToPlayList(item, index) {
        if (this.currentPlayIndex === index) {
          return
        }
        this.setCurrentVideo(item)
        this.setCurrentClipId(item.clipId)
        this.setCurrentPartId(item.partId)
        this._savePlayHistory()
        this.$refs.video.addEventListener('canplay', this.onCanPlay, {
          once: true
        })

        this.startPlay(item.clipId, item.partId)
        this._initTab()
      },
      toggleLight() {
        this.lightDown ? this.showLight() : this.hideLight()
      },
      showLight() {
        this.lightDown = false
      },
      hideLight() {
        this.lightDown = true
      },
      onEnded() {
        this.playing = false
      },
      initPlayer() {
        this.$refs.video.src = null
      },
      onCanPlay() {
        this.$refs.video.pause()
        this.totalTime = this.$refs.video.duration

        let index = this.playHistory.findIndex((i) => {
          return parseInt(i.partId) === parseInt(this.currentPartId)
        })
        if (index >= 0) {
          if (this.playHistory[index].percent * 100 > 5 && this.playHistory[index].percent * 100 < 95) {
            this.$refs.video.currentTime = this.playHistory[index].percent * this.totalTime
          }
        }
        this.playing = true
        this.$refs.video.play()
      },
      onChangeSerialList(item) {
        getVideoListByClipId(item.clipId).then((res) => {
          if (res.code === RES_OK) {
            this.videoList = res.data.list
            this._getSerialList(res.data)
          }
        })
      },
      startPlay(clipId, partId) {
        getVideoUrl(clipId, partId).then((res) => {
          if (res.code === RES_OK) {
            this.srcUrl = this._getUrl(res.data.stream)
            this._getPlayUrl(this.srcUrl[0]).then((data) => {
              if (data.status === 'ok') {
                this.playUrl = data.info
              }
            }).catch(() => {
              this._getPlayUrl(this.srcUrl[1]).then((data) => {
                if (data.status === 'ok') {
                  this.playUrl = data.info
                }
              }).catch(() => {
                this._getPlayUrl(this.srcUrl[2]).then((data) => {
                  if (data.status === 'ok') {
                    this.playUrl = data.info
                  }
                })
              })
            })
          }
        })
        getFstlvlType(clipId, partId).then((res) => {
          if (res.code === RES_OK) {
            this.fstlvlType = res.data.getFstlvlType
          }
        })
        getLikeVideo(partId, this.fstlvlType).then((res) => {
          if (res.code === RES_OK) {
            this.likeVideo = res.data
          }
        })
        getVideoListByPartId(partId).then((res) => {
          if (res.code === RES_OK) {
            this.videoList = res.data.list
            this._initPlayingImage()
            this._initTab()
            this._getCollName(res.data)
            this._getSerialList(res.data)
          }
        })
      },
      _getSerialList(data) {
        if (data.seriesList) {
          this.serialList = data.seriesList
          this.$nextTick(() => {
            scrollX(this.$refs.serialTab, this.$refs.serialBox)
          })

          this.currentSerialIndex = this.serialList.findIndex((i) => {
            return parseInt(i.clipId) === parseInt(data.list[0].clipId)
          })
        } else {
          this.seriesList = []
        }
      },
      _getCollName(data) {
        if (data) {
          if (data.hint) {
            this.collName = data.collName + '(' + data.hint + ')'
          } else {
            this.collName = data.collName
          }
        } else {
          this.collName = ''
        }
      },
      _initPlayingImage() {
        this.currentPlayIndex = this.videoList.findIndex((i) => {
          return parseInt(i.partId) === parseInt(this.currentVideo.partId)
        })
        if (this.$refs.listImage && this.$refs.imagePlaying) {
          this.$refs.imagePlaying[this.currentPlayIndex].style.height = this.$refs.listImage[this.currentPlayIndex].clientHeight + 'px'
        }
      },
      _initTab() {
        scrollX(this.$refs.playlistTab, this.$refs.playlistBox)
      },
      _savePlayHistory() {
        let playHistory = this.playHistory.slice()
        let video = Object.assign({}, this.currentVideo)
        let index = playHistory.findIndex((i) => {
          return parseInt(i.partId) === parseInt(video.partId)
        })

        if (index >= 0) {
          playHistory.splice(index, 1)
        }

        video.percent = this.currentTime === 0 ? 0 : this.currentTime / this.totalTime
        let time = new Date()
        video.viewtime = time.getFullYear() + '/' + this._padZero(time.getMonth()) + '/' + this._padZero(time.getDate()) + ' ' + this._padZero(time.getHours()) + ':' + this._padZero(time.getMinutes()) + ':' + this._padZero(time.getSeconds())
        playHistory.unshift(video)

        this.setPlayHistory(playHistory)
        localStorage.setItem(localConfig.playHistory, JSON.stringify(playHistory))
      },
      _padZero(str, num = 2) {
        let len = str.toString().length
        while (len < num) {
          str = '0' + str
          len = str.toString().length
        }

        return str
      },
      _getPlayUrl(srcUrl) {
        return new Promise((resolve, reject) => {
          originJsonp(srcUrl, (err, data) => {
            if (!err) {
              resolve(data)
            } else {
              reject(err)
            }
          })
        })
      },
      _getUrl(obj) {
        let ret = []
        let url = obj.startUrl + obj.mp4Url[0]
        ret.push(url)

        obj.retryUrl.forEach((i) => {
          ret.push(i + obj.mp4Url[0])
        })

        return ret
      },
      _getVideoOffsetTop() {
        this.videoOffsetTop = this.$refs.video.getBoundingClientRect().top
      },
      _fixedVideo(flag) {
        if (!flag) {
          this.$refs.video.style.position = ''
          this.$refs.lightBtn.style.position = ''
          this.$refs.video.style.top = ''
          this.$refs.lightBtn.style.top = ''
          this.$refs.lightBtn.style.right = ''
          this.$refs.emptyBlock.style.width = ''
          this.$refs.emptyBlock.style.height = ''
          if (!this.timer) {
            clearTimeout(this.timer)
          }
          this.$refs.lightBtn.style.transition = ''
          this.$refs.lightBtn.style.opacity = ''

          this.fixedVideo = false
          return
        }
        this.$refs.video.style.position = 'fixed'
        this.$refs.lightBtn.style.position = 'fixed'
        this.$refs.video.style.top = 0
        this.$refs.lightBtn.style.top = this.$refs.video.clientHeight + 'px'
        this.$refs.lightBtn.style.right = 10 + 'px'
        this.$refs.emptyBlock.style.width = this.$refs.video.clientWidth + 'px'
        this.$refs.emptyBlock.style.height = this.$refs.video.clientHeight + this.$refs.lightBtn.clientHeight + 'px'
        this.fixedVideo = true
        this._lightBtnFade()
      },
      _setTitleStyle() {
        if (!this.$refs.likeImg) {
          return
        }
        for (let i = 0; i < this.$refs.likeImg.length; i++) {
          if (this.$refs.title[i].clientHeight + this.$refs.subtitle[i].clientHeight + titleMarginBottom <= this.$refs.likeImg[i].clientHeight) {
            this.$refs.title[i].style['margin-bottom'] = titleMarginBottom + 'px'
          }
        }
      },
      _lightBtnFade() {
        this.$refs.lightBtn.style.transition = ''
        this.$refs.lightBtn.style.opacity = ''
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.$refs.lightBtn.style.transition = '3s'
          this.$refs.lightBtn.style.opacity = '0.3'
        }, 3000)
      },
      ...mapMutations({
        'setCurrentPlayUrl': 'SET_CURRENT_PLAY_URL',
        'setCurrentVideo': 'SET_CURRENT_VIDEO',
        'setPlayHistory': 'SET_PLAY_HISTORY',
        'setCurrentClipId': 'SET_CURRENT_CLIP_ID',
        'setCurrentPartId': 'SET_CURRENT_PART_ID'
      })
    },
    watch: {
      playUrl(newVal) {
        this.initPlayer()
        this.$refs.video.src = newVal
      }
    }
  }
</script>

<style type="text/css" lang="stylus">
  @import "~common/stylus/variable"

  .player
    font-size: 10px
    .video
      position: relative
      z-index: 101
      .test
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: 100px
        background: red
    .lightBtn
      position: relative
      z-index: 102
      font-size: 18px
      text-align: right
      padding: 5px 0
      right: 0
      color: #FFF
      display: inline-block
      float: right
      background: $color-sub-theme
      padding: 10px
      border-radius: 10px
      opacity: 1
    .coll-name
      clear: both
      font-size: 18px
      box-sizing: border-box
      padding: 0 10px
      color: $color-theme
      font-weight: bold
    .serial
      .serial-tab
        overflow: hidden
        .serial-box
          .serial-item-wrapper
            display: inline-block
            box-sizing: border-box
            padding: 5px
            vertical-align: top
            .serial-item
              display: inline-block
              float: left
              font-size: 15px
              box-sizing: border-box
              padding: 4px
            .serial-active
              box-sizing: border-box
              border-bottom: 3px solid $color-sub-theme
    .playlist-tab
      overflow: hidden
      .playlist-box
        .item
          position: relative
          float: left
          box-sizing: border-box
          padding: 10px
          width: 150px
          overflow: hidden
          .image
            position: relative
            .time
              position: absolute
              display: inline-block
              right: 0
              bottom: 0
              box-sizing: border-box
              padding: 5px
              margin: 0 1.5px 1.5px 0
              background: #000
              color: #FFF
            .image-playing
              position: absolute
              top: 0
              left: 0
              background: rgba(0, 0, 0, 0.7)
              right: 0
              bottom: 0
              display: flex
              .playing-title
                font-size: 15px
                margin: auto
                color: #FFF
          .title
            font-size: 15px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            padding: 5px 0
    .like-video-wrapper
      .like-title
        font-size: 18px
        box-sizing: border-box
        padding: 0 10px
        color: $color-theme
        font-weight: bold
      .like-video
        box-sizing: border-box
        padding: 10px
        .like-img
          position: relative
          display: inline-block
          width: 30%
          .time
            position: absolute
            bottom: 0
            right: 0
            background: #000
            padding: 2px 5px
            color: #FFF
      .title-wrapper
        display: inline-block
        width: 60%
        vertical-align: top
        margin-left: 2px
        .title
          font-size: 15px
        .subtitle
          font-size: 13px
          color: #AAA
    .blackMode
      position: fixed
      top: 0
      left: 0
      bottom: 0
      right: 0
      background: #000
      z-index: 100
</style>