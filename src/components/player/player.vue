<template>
  <div class="player" ref="player">
    <div class="content-wrapper" v-show="playUrl && !cannotPlay">
      <div class="empty_block" ref="emptyBlock"></div>
      <video class="video" controls="controls" width="100%" preload="auto" v-show="playing" autoplay="autoplay" @durationchange="onDurationchange" ref="video">
      </video>
      <div class="video-loading" v-show="!playing" ref="videoLoading">
        <img width="100%" height='100%' src="./loading.webp">
      </div>
      <div class="lightBtn" @click="toggleLight" ref="lightBtn">{{getLightState}}</div>
      <div class="coll-name">{{collName}}</div>
      <div class="serial-tab" ref="serialTab" v-show="serialList.length">
        <div class="serial-box" ref="serialBox">
          <div class="serial-item" v-for="(item, index) in serialList" @click="onChangeSerialList(item)">
            <span class="item" :class="{'item-active': currentSerialIndex === index}">{{item.seasonName}}</span>
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
    <div class="loading-wrapper" v-show="!playUrl">
      <loading></loading>
    </div>
    <div class="error-wrapper" v-show="cannotPlay">
      <error></error>
    </div>
  </div>
</template>

<script type="text/javascript">
  import {getVideoUrl, getLikeVideo, getFstlvlType, getVideoListByPartId, getVideoListByClipId} from 'api/player'
  import {RES_OK, localConfig} from 'common/js/config'
  import {scrollX} from 'common/js/util'
  import {mapGetters, mapMutations} from 'vuex'
  import originJsonp from 'jsonp'
  import Loading from 'base/loading/loading'
  import Error from 'base/error/error'

  const titleMarginBottom = 15
  export default {
    data() {
      return {
        // 芒果普清视频源有几个，所以放个数组
        srcUrl: [],

        // 测试一个作为可以播放的放入video
        playUrl: '',

        // 芒果数据格式，/!xxx/xxx    !=所在位置
        cId: null,

        // 芒果数据格式, /xxx/!xxx/  同上
        pId: null,

        // 看了还会看视频
        likeVideo: [],

        // 同类。。
        fstlvlType: null,

        // 灯灭
        lightDown: false,

        // 本来想做下拉固定video标签，但是手机浏览器劫持了标签
        // fixedVideo: false,
        // 精选视频
        videoList: [],

        // videoList 设置播放中
        currentPlayIndex: null,

        // videoList标题
        collName: '',

        // 年度或者第几季标签
        serialList: [],

        // 上面设置 serial-active
        currentSerialIndex: null,

        // jump函数只运行一次
        timeChanged: 0,

        // 监听video canply事件的标志位，设置video加载中图用
        playing: false,

        // 错误处理
        cannotPlay: false
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

      // 播放时意外退出情况 --- 如果处于播放器页面，记录播放数据
      window.addEventListener('beforeunload', () => {
        if (this.$router.currentRoute.fullPath.slice(1) === 'player') {
          this._savePlayHistory()
        }
      })
    },
    updated() {
      this.$nextTick(() => {
        this._setTitleStyle()
        this._initTab()
      })
    },
    activated() {
      // App.vue的子路由在keep-alive标签里边，触发此事件
      this.$refs.video.addEventListener('durationchange', this.onDurationchange)

      // 触发事件的时候开始启动播放函数
      this.cId = this.currentClipId
      this.pId = this.currentPartId
      this.startPlay(this.cId, this.pId)

      // 页面在最上边
      document.body.scrollTop = 0

      // 按钮慢慢变淡
      this._lightBtnFade()

      this.$refs.video.addEventListener('canplay', this.onCanPlay)
    },
    deactivated() {
      this.$refs.video.removeEventListener('durationchange', this.onDurationchange)
      this.$refs.video.removeEventListener('canplay', this.onCanPlay)

      // 离开 -- 保存进度，初始化播放器
      this._savePlayHistory()
      this._initPlayer()
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
      onDurationchange(e) {
        this.$nextTick(() => {
          this.jump()
        })
      },
      goToPlay(item) {
        this._savePlayHistory()
        this.setCurrentVideo(item)
        this.setCurrentClipId(item.clipId)
        this.setCurrentPartId(item.videoId)
        this._initPlayer()
        this.serialList = []
        this.likeVideo = []
        this.videoList = []
        this.startPlay(item.clipId, item.videoId)
        this._initTab()
      },
      goToPlayList(item, index) {
        if (this.currentPlayIndex === index) {
          return
        }
        this._savePlayHistory()
        this.setCurrentVideo(item)
        this.setCurrentClipId(item.clipId)
        this.setCurrentPartId(item.partId)

        this._initPlayer()
        this.serialList = []
        this.likeVideo = []
        this.videoList = []
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
      onCanPlay() {
        this.playing = true
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
          // 芒果数据有3个播放地址，选一个可以用的放去playUrl
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
          } else {
            this.cannotPlay = true
          }
        }).catch(() => {
          this.cannotPlay = true
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
            this._initTab()
            this._getCollName(res.data)
            this._getSerialList(res.data)
          }
        })
      },
      jump() {
        if (!this.$refs.video) {
          return
        }
        if (this.timeChanged) {
          return
        }
        if (!this.playHistory.length) {
          this.playing = true
          this.$refs.video.play()
          return
        }
        this.playing = true
        let index = this.playHistory.findIndex((i) => {
          return parseInt(i.partId) === parseInt(this.currentPartId)
        })
        if (navigator.userAgent.match(/MQQBrowser/)) {
          setTimeout(() => {
            if (index >= 0) {
              let ctTime = Number(this.playHistory[index].percent) * Number(this.playHistory[index].duration)
              this.$refs.video.currentTime = ctTime
            }
          }, 1000)
        } else {
          if (index >= 0) {
            let ctTime = Number(this.playHistory[index].percent) * Number(this.playHistory[index].duration)
            this.$refs.video.currentTime = ctTime
          }
        }
        this.$refs.video.play()
        this.timeChanged++
      },
      _initPlayer() {
        this.$refs.video.pause()
        this.$refs.video.src = ''
        this.timeChanged = 0
        this.playing = false
        this.playUrl = ''
        this.durationReady = false
        this.cannotPlay = false

        this.serialList = []
        this.videoList = []
        this.likeVideo = []
      },
      _getSerialList(data) {
        if (data.seriesList) {
          this.serialList = data.seriesList

          this.currentSerialIndex = this.serialList.findIndex((i) => {
            return parseInt(i.clipId) === parseInt(data.list[0].clipId)
          })
        } else {
          this.serialList = []
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
      _initTab() {
        this.$nextTick(() => {
          scrollX(this.$refs.playlistTab, this.$refs.playlistBox)
          this.currentPlayIndex = this.videoList.findIndex((i) => {
            return Number(i.partId) === Number(this.currentVideo.partId)
          })

          scrollX(this.$refs.serialTab, this.$refs.serialBox)
        })
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

        video.percent = this.$refs.video.currentTime === 0 ? 0 : this.$refs.video.currentTime / this.$refs.video.duration
        video.duration = this.$refs.video.duration
        let time = new Date()
        video.viewtime = time.getFullYear() + '-' + this._padZero(time.getMonth()) + '-' + this._padZero(time.getDate()) + ' ' + this._padZero(time.getHours()) + ':' + this._padZero(time.getMinutes()) + ':' + this._padZero(time.getSeconds())
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
        this.$refs.video.src = newVal
        this.cannotPlay = false
      },
      serialList(v) {
        setTimeout(() => {
          this._initTab()
        }, 20)
      }
    },
    components: {
      Loading,
      Error
    }
  }
</script>

<style type="text/css" lang="stylus">
  @import "~common/stylus/variable"

  .player
    font-size: 10px
    .content-wrapper
      .video
        position: relative
        z-index: 102
      .video-loading
        height: 200px
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
      .serial-tab
        overflow: hidden
        .serial-box
          .serial-item
            display: inline-block
            font-size: 15px
            font-weight: bold
            padding: 0 10px
            .item
              display: inline-block
              height: 40px
              line-height: 40px
            .item-active
              border-bottom: 3px solid $color-theme
              box-sizing: border-box
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
                right: 1.8px
                bottom: 1.8px
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
                max-height: 120px
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
              bottom: 1.9px
              right: 1px
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