<template>
  <div class="tab-wrapper" ref="tabWrapper">
    <div class="tab" ref="tab">
      <div class="box" ref="box">
        <router-link tag="div" class="item" v-for="(item, index) in channel" :to="item.eName" :key="index" ref="item">
          <span @click="goScroll(index, item)" class="name">{{item.cName}}</span>
        </router-link>
      </div>
    </div>
    <div class="setting" v-if="showSetting" @click="goSetting">
      <span class="iChange iconfont icon-more"></span>
    </div>
  </div>
</template>

<script>
  import {scrollX} from 'common/js/util'
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    data() {
      return {
        showSetting: true,
        itemPos: []
      }
    },
    computed: {
      ...mapGetters([
        'channel',
        'currentChannel',
        'needScroll',
        'needResetPage'
      ])
    },
    mounted() {
      scrollX(this.$refs.tab, this.$refs.box)
      this._showSetting()
      this._initItemPos()
      this._hashGoScroll()
      this.setCurrentChannel(this.$router.currentRoute.fullPath.slice(1))

      window.addEventListener('resize', () => {
        this.$nextTick(() => {
          scrollX(this.$refs.tab, this.$refs.box)
          this._showSetting()
          this._hashGoScroll()
        })
      })
    },
    methods: {
      goScroll(index, item) {
        if (!this.showSetting) {
          return
        }

        let offsetLeft = -(this.itemPos[index]) + this.itemPos[2]
        if (this.itemPos[index] + this.itemPos[2] >= this.$refs.box.clientWidth - this.itemPos[2] || offsetLeft - this.$refs.tab.clientWidth < -(this.$refs.box.clientWidth)) {
          offsetLeft = -(this.$refs.box.clientWidth - this.$refs.tab.clientWidth)
        }
        if (offsetLeft > 0) {
          offsetLeft = 0
        }
        if (offsetLeft + this.$refs.box.clientWidth - this.$refs.tab.clientWidth <= 10 && offsetLeft + this.$refs.box.clientWidth - this.$refs.tab.clientWidth !== 0) {
          offsetLeft = -(this.$refs.box.clientWidth - this.$refs.tab.clientWidth)
        }
        this.$refs.box.style.transform = `translate3d(${offsetLeft}px, 0, 0)`

        if (item && item !== this.currentChannel) {
          this.setCurrentChannel(item.eName)
        }
      },
      goSetting() {
        this.$router.push({
          path: '/tab-setting'
        })
      },
      _initItemPos() {
        for (let i = 0; i < this.$refs.item.length; i++) {
          let offsetLeft = this.$refs.item[i].$el.getBoundingClientRect().left
          this.itemPos.push(offsetLeft)
        }
      },
      _showSetting() {
        if (this.$refs.tabWrapper.clientWidth > this.$refs.box.clientWidth) {
          this.showSetting = false
        } else {
          this.showSetting = true
        }
      },
      _hashGoScroll() {
        let index = this.channel.findIndex((i) => {
          return i.eName === window.location.hash.slice(2)
        })
        if (index === -1) {
          index = this.channel.findIndex((i) => {
            return i.eName === this.currentChannel
          })
        }
        this.goScroll(index)
      },
      ...mapMutations({
        'setCurrentChannel': 'SET_CURRENT_CHANNEL',
        'setNeedResetPage': 'SET_NEED_RESET_PAGE'
      })
    },
    watch: {
      channel() {
        this._hashGoScroll()
      },
      needScroll() {
        this._hashGoScroll()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab-wrapper
    width: 100%
    background: $color-sub-theme
    font-size: 10px
    color: #FFF
    .tab
      display: inline-block
      width: 90%
      height: 40px
      line-height: 40px
      overflow: hidden
      .box
        height: 100%
        .item
          display: inline-block
          width: 70px
          font-size: 15px
          text-align: center
          .name
            display: inline-block
            width: 100%
            height: 100%
          &.router-link-active
            color: $color-sub-theme
            background: #FFF
    .setting
      position: relative
      display: flex
      width: 10%
      height: 30px
      margin-top: 5px
      float: right
      box-sizing: border-box
      border-left: 1px solid
      border-image: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.1)) 1 1
      &:after
        content: ""
        position: absolute
        height: 35px
        left: -2px
        box-shadow: 0 0 5px 1px #fff
      &:before
        content: ""
        position: absolute
        height: 37px
        top: -4px
        left: -1px
        box-shadow 0 0 5px 1px #fff
      .iChange
        margin: auto
        font-size: 15px
</style>