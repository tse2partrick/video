<template>
  <div class="v-menu-sec" ref="vMenuSec">
    <div class="banner-wrapper" ref="bannerWrapper" v-if="vBanner.length">
      <div class="banner" ref="banner">
        <div class="banner-item" v-for="item in vBanner" @click="goToPlay(item)">
          <div class="banner-image">
            <img width="100%" height="100%" :src="item.imgHUrl">
          </div>
          <div class="banner-title">{{item.name}}</div>
        </div>
      </div>
      <div class="dot" ref="dot">
        <div class="dot-item" v-for="item in vBanner" ref="dotItem"></div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="content" v-for="datas in vData">
        <div class="content-title">{{datas.title}}</div>
        <div class="content-data" :class="data.moduleType" v-for="data in datas.data" @click="goToPlay(data)">
          <img width="100%" height="100%" v-lazy="getContentImg(data)">
          <div class="name">{{data.name}}</div>
          <div class="subname">{{data.subName || data.name}}</div>
        </div>
      </div>
    </div>
    <loading v-if="!vData.length"></loading>
  </div>
</template>

<script type="text/javascript">
  import {initBanner} from 'common/js/util'
  import {mapMutations} from 'vuex'
  import Loading from 'base/loading/loading'
  export default {
    props: {
      vBanner: {
        type: Array,
        default: []
      },
      vData: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        getShowSubName: true
      }
    },
    updated() {
      setTimeout(() => {
        initBanner(this.$refs.bannerWrapper, this.$refs.banner, this.$refs.dot)
      }, 20)
    },
    computed: {
      getContentWrapperStyle() {
        return this.vBanner.length ? {'margin-top': '20px', 'padding': '5px', 'box-sizing': 'border-box'} : ''
      }
    },
    methods: {
      goToPlay(item) {
        if (item.jumpId === item.childId) {
          this.$emit('goSubChannel', item.jumpId)
        } else {
          this.setCurrentClipId(item.jumpId)
          this.setCurrentPartId(item.childId)
          this.setCurrentVideo(item)
          this.$router.push({
            path: '/player'
          })
        }
      },
      getContentImg(data) {
        if (data.moduleType === 'bcrossm') {
          if (data.phoneImgUrl) {
            return data.phoneImgUrl
          }
        }

        return data.imgHUrl
      },
      ...mapMutations({
        'setCurrentClipId': 'SET_CURRENT_CLIP_ID',
        'setCurrentPartId': 'SET_CURRENT_PART_ID',
        'setCurrentVideo': 'SET_CURRENT_VIDEO'
      })
    },
    components: {
      Loading
    }
  }
</script>

<style type="text/css" lang="stylus">
  @import "~common/stylus/variable"
  .v-menu-sec
    color: #000
    font-size: 10px
    .banner-wrapper
      position: relative
      width: 100%
      height: 2.3rem
      overflow: hidden
      .banner
        position: relative
        .banner-item
          display: inline-block
          float: left
          .banner-image
            height: 2rem
          .banner-title
            font-size: 15px
            text-align: center
            height: 0.2rem
            line-height: 0.2rem
            padding-top: 0.1rem
            font-weight: bold
      .dot
        position: absolute
        width: 100%
        top: 75%
        text-align: center
      .dot-item
        display: inline-block
        width: 15px
        height: 15px
        background: #ccc
        border-radius: 50%
        margin: 0 3px
      .dot-item-active
        background: #fff
    .content-wrapper
      padding: 0 5px 5px 5px
      .content
        margin-top: 10px
        padding-top: 10px
        border-top: 3px solid #FFF
        &:nth-child(1)
          padding-top: 0
          margin-top: 0
          border: 0
        .content-title
          font-size: 18px
          color: $color-theme
          font-weight: bold
          box-sizing: border-box
          padding-left: 5px
        &:before
          content: ""
          position: absolute
          width: 0
          height: 0
          border: 5px solid transparent
          border-left: 10px solid $color-theme
          border-top: 10px solid $color-theme
          margin-left: -10px
        .content-data
          display: inline-block
          width: 50%
          box-sizing: border-box
          padding: 5px
          .name
            font-size: 14px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            padding: 3px 0
          .subname
            font-size: 15px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            padding: 3px 0
        .bcrossm
          display: inline-block
          width: 100%
          .name
            font-size: 14px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            padding-bottom: 3px
          .subname
            font-size: 15px
            text-overflow: ellipsis
            white-space: nowrap
            overflow: hidden
            padding: 3px 0
</style>