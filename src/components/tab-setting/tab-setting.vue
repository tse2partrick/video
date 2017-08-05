<template>
  <div class="tab-setting">
    <div class="header">
      <div class="back-wrapper" @click="goBack" v-show="backFlag">
        <span class="iBack iconfont icon-back"></span>
      </div>
      <p class="title">{{getTitle}}</p>
      <div class="self-methods" @click="settingOn" v-show="!setting">
        <span class="iMethod">编辑</span>
      </div>
      <div class="self-methods" @click="settingOff" v-show="setting">
        <span class="iMethod">完成</span>
      </div>
    </div>
    <div class="channel-wrapper" ref="channelWrapper">
      <div class="item-wrapper" v-for="(item, index) in srcChannel" :key="index">
        <span class="item" ref="item">{{item.cName}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import baseHeader from 'base/base-header/base-header'
  import {mapGetters, mapMutations} from 'vuex'
  import {sequence} from 'common/js/util'
  import Sortable from 'sortablejs'
  import {localConfig} from 'common/js/config'
  export default {
    data() {
      return {
        title: '频道',
        selfMethodTitle: '编辑',
        backFlag: true,
        setting: false,
        copyChannel: [],
        srcChannel: [],
        sortable: null
      }
    },
    computed: {
      getTitle() {
        return this.setting ? '拖动以完成编辑' : '频道'
      },
      ...mapGetters([
        'channel',
        'currentChannel',
        'needScroll'
      ])
    },
    created() {
      this.copyChannel = this.channel
      this.srcChannel = this.channel
    },
    methods: {
      goBack() {
        if (this.setting) {
          return
        }
        if (this.copyChannel === this.srcChannel) {
          this.setNeedScroll(this.needScroll + 1)
        }
        this.$router.back()
      },
      settingOn() {
        this.setting = true
        this.backFlag = false
        let self = this
        this.sortable = new Sortable(this.$refs.channelWrapper, {
          sort: true,
          animation: 200,
          onSort(e) {
            self.copyChannel = sequence(self.copyChannel, e.oldIndex, e.newIndex)
            let c = []
            for (let i = 0; i < self.copyChannel.length; i++) {
              c.push(self.copyChannel[i].cName)
            }
          }
        })
      },
      settingOff() {
        this.setting = false
        this.backFlag = true
        this.sortable.sort = false
        this.setChannel(this.copyChannel)
        localStorage.setItem(localConfig.channel, JSON.stringify(this.copyChannel))
      },
      ...mapMutations({
        'setChannel': 'SET_CHANNEL',
        'setNeedScroll': 'SET_NEED_SCROLL'
      })
    },
    components: {
      baseHeader
    }
  }
</script>

<style type="text/css" lang="stylus">
  @import "~common/stylus/variable"
  .tab-setting
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: #EEE
    .header
      position: relative
      top: 0
      left: 0
      width: 100%
      height: $base-header-height
      background: $color-sub-theme
      color: #FFF
      font-size: 15px
      .back-wrapper
        position: absolute
        left: 0
        display: flex
        width: 50px
        height: 100%
        .iBack
          margin: auto
      .title
        display: inline-block
        width: 100%
        height: 50px
        line-height: 50px
        text-align: center
      .self-methods
        position: absolute
        top: 0
        right: 0
        display: flex
        width: 60px
        height: 100%
        float: right
        .iMethod
          margin: auto
    .channel-wrapper
      .item-wrapper
        display: inline-block
        width: 25%
        font-size: 15px
        padding: 20px 0
        text-align: center
        .item
          display: inline-block
          width: 90%
          height: 30px
          line-height: 30px
          background: $color-sub-theme
          color: #FFF
      .sortable-ghost
        .item
          border: 1px dashed #ccc
          color: #fff
          background: #fff
</style>