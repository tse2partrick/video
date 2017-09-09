<template>
  <div class="v-menu-wrapper" ref="vMenuWrapper">
    <div class="tag-tab" v-show="vData.length">
      <div class="all-tag">{{getAllTitle}}</div>
      <div class="tag kind-tag" v-show="lastKindActive !== 0">{{getKindTag}}</div>
      <div class="tag" v-show="getShowSlahOne">/</div>
      <div class="tag area-tag" v-show="lastAreaActive !== 0">{{getAreaTag}}</div>
      <div class="tag" v-show="getShowSlahTwo">/</div>
      <div class="tag charge-tag" v-show="lastChargeActive !== 0">{{getChargeTag}}</div>
      <div class="tag" v-show="getShowSlahThree">/</div>
      <div class="tag edition-tag" v-show="lastEditionActive !== 0">{{getEditionTag}}</div>
      <div class="switch" @click="toggleMenu">筛选</div>
    </div>
    <div class="menu-box" v-show="menuOpen">
      <div class="menu-tab-wrapper" ref="kindTab" v-if="menu[0]">
        <div class="menu-tab" ref="kindBox">
          <div class="menu" v-for="(item, index) in menu[0]" :data-id="item.id" ref="kind" @click="goFilter(item.id, index, 'kind')">
            <span class="name" ref="kindName">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="menu-tab-wrapper" ref="areaTab" v-if="menu[1]">
        <div class="menu-tab" ref="areaBox">
          <div class="menu" v-for="(item, index) in menu[1]" :data-id="item.id" ref="area" @click="goFilter(item.id, index, 'area')">
            <span class="name" ref="areaName">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="menu-tab-wrapper" ref="chargeTab" v-if="menu[2]">
        <div class="menu-tab" ref="chargeBox">
          <div class="menu" v-for="(item, index) in menu[2]" :data-id="item.id" ref="charge" @click="goFilter(item.id, index, 'charge')">
            <span class="name" ref="chargeName">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="menu-tab-wrapper" ref="editionTab" v-if="menu[3]">
        <div class="menu-tab" ref="editionBox">
          <div class="menu" v-for="(item, index) in menu[3]" :data-id="item.id" ref="edition" @click="goFilter(item.id, index, 'edition')">
            <span class="name" ref="editionName">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="movie-box" ref="movieBox">
      <div class="item-box" v-for="item in vData" @click="goToPlay(item, item.info.clipId, item.info.playPartId)" ref="itemBox">
        <div class="image-box" :style="[{'background-image': 'url(' + item.image + ')'}, {'background-size': '100% 100%'}]">
          <img class="image" v-lazy="item.image">
          <span class="chargeTip" :style="{'background': item.rightCorner.corlor}">{{item.rightCorner.text}}</span>
          <span class="time">{{item.subtitle}}</span>
        </div>
        <div class="title">{{item.name}}</div>
      </div>
    </div>
    <loading v-show="!vData.length"></loading>
  </div>
</template>

<script type="text/javascript">
  import {scrollX, addClass, removeClass} from 'common/js/util'
  import {mapMutations, mapGetters} from 'vuex'
  import Loading from 'base/loading/loading'
  export default {
    props: {
      vData: {
        type: Array,
        default: []
      },
      menu: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        menuOpen: false,
        lastKindActive: 0,
        lastAreaActive: 0,
        lastChargeActive: 0,
        lastEditionActive: 0
      }
    },
    updated() {
      this.$nextTick(() => {
        this._initTab()
        this._addEmptyDiv()
      })
    },
    computed: {
      getShowSlahOne() {
        if (this.lastKindActive !== 0 && this.lastAreaActive !== 0) {
          return true
        }
      },
      getShowSlahTwo() {
        if (this.lastKindActive !== 0 && this.lastChargeActive !== 0 || this.lastAreaActive !== 0 && this.lastChargeActive !== 0) {
          return true
        }
      },
      getShowSlahThree() {
        if (this.lastKindActive !== 0 && this.lastEditionActive !== 0 || this.lastAreaActive !== 0 && this.lastEditionActive !== 0 || this.lastChargeActive !== 0 && this.lastEditionActive !== 0) {
          return true
        }
      },
      getAllTitle() {
        return this.lastKindActive === 0 && this.lastAreaActive === 0 && this.lastChargeActive === 0 && this.lastEditionActive === 0 ? '全部分类' : ''
      },
      getKindTag() {
        return this.lastKindActive === 0 ? '' : this.$refs.kindName[this.lastKindActive].innerHTML
      },
      getAreaTag() {
        return this.lastAreaActive === 0 ? '' : this.$refs.areaName[this.lastAreaActive].innerHTML
      },
      getChargeTag() {
        return this.lastChargeActive === 0 ? '' : this.$refs.chargeName[this.lastChargeActive].innerHTML
      },
      getEditionTag() {
        return this.lastEditionActive === 0 ? '' : this.$refs.editionName[this.lastEditionActive].innerHTML
      },
      ...mapGetters([
        'needResetPage'
      ])
    },
    methods: {
      goFilter(id, index, type) {
        this.$emit('needFilter', id, type)
        switch (type) {
          case 'kind':
            removeClass(this.$refs.kindName[this.lastKindActive], 'active')
            this.lastKindActive = index
            addClass(this.$refs.kindName[this.lastKindActive], 'active')
            break
          case 'area':
            removeClass(this.$refs.areaName[this.lastAreaActive], 'active')
            this.lastAreaActive = index
            addClass(this.$refs.areaName[this.lastAreaActive], 'active')
            break
          case 'charge':
            removeClass(this.$refs.chargeName[this.lastChargeActive], 'active')
            this.lastChargeActive = index
            addClass(this.$refs.chargeName[this.lastChargeActive], 'active')
            break
          case 'edition':
            removeClass(this.$refs.editionName[this.lastEditionActive], 'active')
            this.lastEditionActive = index
            addClass(this.$refs.editionName[this.lastEditionActive], 'active')
            break
          default:
            break
        }
      },
      goToPlay(item, clipId, partId) {
        this.$router.push({
          path: '/player'
        })
        this.setCurrentClipId(clipId)
        this.setCurrentPartId(partId)
        this.setCurrentVideo(item)
      },
      toggleMenu() {
        this.menuOpen ? this.hideMenu() : this.showMenu()
      },
      showMenu() {
        this.menuOpen = true
      },
      hideMenu() {
        this.menuOpen = false
      },
      _addEmptyDiv() {
        if (!this.$refs.itemBox) {
          return
        }
        let pageWidth = document.body.clientWidth
        let itemWidth = this.$refs.itemBox[0].clientWidth
        let num = (pageWidth / itemWidth) | 0

        for (let i = 0; i < num; i++) {
          let emptyItem = document.createElement('div')
          emptyItem.className = 'empty-item-box'
          this.$refs.movieBox.appendChild(emptyItem)
        }
      },
      _initTab() {
        if (!this.menuOpen) {
          return
        }
        if (this.$refs.kindTab) {
          addClass(this.$refs.kindName[this.lastKindActive], 'active')
          scrollX(this.$refs.kindTab, this.$refs.kindBox)
        }
        if (this.$refs.areaTab) {
          addClass(this.$refs.areaName[this.lastAreaActive], 'active')
          scrollX(this.$refs.areaTab, this.$refs.areaBox)
        }
        if (this.$refs.chargeTab) {
          addClass(this.$refs.chargeName[this.lastChargeActive], 'active')
          scrollX(this.$refs.chargeTab, this.$refs.chargeBox)
        }
        if (this.$refs.editionTab) {
          addClass(this.$refs.editionName[this.lastEditionActive], 'active')
          scrollX(this.$refs.editionTab, this.$refs.editionBox)
        }
      },
      ...mapMutations({
        'setCurrentClipId': 'SET_CURRENT_CLIP_ID',
        'setCurrentPartId': 'SET_CURRENT_PART_ID',
        'setCurrentVideo': 'SET_CURRENT_VIDEO'
      })
    },
    watch: {
      menu() {
        this.$nextTick(() => {
          this._initTab()
        })
      },
      needResetPage() {
        if (!this.$refs.vMenuWrapper) {
          return
        }

        this._addEmptyDiv()
      }
    },
    components: {
      Loading
    }
  }
</script>

<style type="text/css" lang="stylus">
  @import "~common/stylus/variable"
  .v-menu-wrapper
    color: #FFF
    font-size: 10px
    .tag-tab
      width: 100%
      height: 40px
      line-height: 40px
      font-size: 15px
      margin-top: 20px
      background: $color-sub-theme
      .all-tag
        display: inline-block
        margin-left: 10px
      .tag
        display: inline-block
        margin-left: 5px
        box-sizing: border-box
      .switch
        display: inline-block
        float: right
        padding: 0 20px
    .menu-box
      width: 100%
      .menu-tab-wrapper
        width: 100%
        line-height: 40px
        margin: 5px 0
        background: $color-sub-theme
        overflow: hidden
        .menu-tab
          .menu
            display: inline-block
            padding: 5px 2px
            .name
              display: inline-block
              font-size: 15px
              padding: 3px 10px
            .active
              color: $color-sub-theme
              border: 1px solid $color-sub-theme
              background: #FFF
              border-radius: 10px
    .movie-box
      display: flex
      flex-wrap: wrap
      .item-box
        display: inline-block
        width: 110px
        padding: 0.05rem
        margin-bottom: 0.2rem
        margin: auto
        .image-box
          position: relative
          .image
            width: 100%
            height: auto
            border: none
          .chargeTip
            position: absolute
            top: 0
            right: 0
            padding: 3px
            margin: 2px
          .time
            position: absolute
            bottom: 0
            right: 0
            background: #000
            text-overflow: hidden
            white-space: nowrap
            font-size: 15px
            box-sizing: border-box
            padding: 5px
            max-width: 70%
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
      .title
        font-size: 18px
        text-overflow: ellipsis
        white-space: nowrap
        overflow: hidden
        margin: 5px 0 10px 0
        color: #000
      .empty-item-box
        display: inline-block
        width: 110px
        padding: 0.05rem
        margin-bottom: 0.2rem
        margin: auto
</style>