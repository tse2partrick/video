<template>
  <div class="v-header" ref="vHeader">
    <div class="logo" ref="logo">
      Video
    </div>
    <div class="search-input-box" @click="onFocus" ref="searchBox">
      <input class="search-input" maxlength="100" placeholder="搜索想看的影视..." v-model="query" ref="searchInput" />
      <div class="iSearch" ref="iSearch">
        <i class="icon iconfont icon-search" @click="onSearch"></i>
      </div>
    </div>
    <div class="personal" ref="personal" @click="gopersonal">
      <span class="icon-personal iconfont icon-person"></span>
    </div>
    <suggest :suggest="suggestArr" v-show="showSuggest" @clickTitle="onClickSuggest"></suggest>
  </div>
</template>

<script type="text/javascript">
  import {prefixStyle, isMobile} from 'common/js/util'
  import {mapGetters, mapMutations} from 'vuex'
  import {getSuggest, getSearchRes} from 'api/search'
  import {RES_OK} from 'common/js/config'
  import {createSearchRes} from 'common/js/search'
  import Suggest from 'base/suggest/suggest'

  const MARGIN_SUM = 30
  const transform = prefixStyle('transform')
  export default {
    data() {
      return {
        query: '',
        suggestArr: [],
        scrollOffsetTop: 0,
        showSuggest: false,
        searchResult: []
      }
    },
    created() {
      this.mobile = isMobile()
      this._isMobile()

      // 监听滑动，隐藏搜索结果栏
      this._listenScroll()

      window.addEventListener('resize', () => {
        this.setNeedResetPage(this.needResetPage + 1)
      })
    },
    mounted() {
      setTimeout(() => {
        this._initSearchBoxWidth(false)
        this.$refs.searchInput.addEventListener('focus', () => {
          this._initSearchBoxWidth(true)
        })
        this.$refs.searchInput.addEventListener('blur', () => {
          this._initSearchBoxWidth(false)
        })
      }, 200)
    },
    computed: {
      ...mapGetters([
        'needResetPage'
      ])
    },
    methods: {
      onSearch() {
        this.onClickSuggest(this.query)
      },
      onClickSuggest(suggest) {
        getSearchRes(suggest).then((res) => {
          this.searchResult = this._filterRes(res.clips)
          this.setCurrentSearchResult(this.searchResult)
          this.$router.push({
            path: '/search-result'
          })
        })

        this.showSuggest = false

        window.removeEventListener('scroll', this.scrollHandle)
      },
      gopersonal() {
        this.$router.push({
          path: '/personal'
        })
      },
      onFocus() {
        this.$refs.searchInput.focus()
      },
      _filterRes(arr) {
        let ret = []
        arr.forEach((i) => {
          if (i.s_source === 'imgo' && i.video_full.length) {
            ret.push(createSearchRes(i))
          }
        })

        return ret
      },
      _listenScroll() {
        this.scrollHandle = () => {
          this.scrollOffsetTop = document.body.scrollTop
        }

        window.addEventListener('scroll', this.scrollHandle)
      },
      _getSuggest(val) {
        getSuggest(val).then((res) => {
          if (res.code === RES_OK) {
            if (res.data.length) {
              this.suggestArr = res.data
            }
          }
        })
      },
      _isMobile() {
        // PC端监听resize
        if (!this.mobile) {
          window.addEventListener('resize', () => {
            this._initSearchBoxWidth(false)
            this.$refs.searchBox.style.transition = ''
            this.$refs.searchInput.style.transition = ''
          })
        }
      },
      _initSearchBoxWidth(fullExpand) {
        let boxWidth
        if (!fullExpand) {
          this.$refs.personal.style[transform] = 'translate3d(0, 0, 0)'
          boxWidth = this.$refs.vHeader.clientWidth - this.$refs.logo.clientWidth - this.$refs.personal.clientWidth - MARGIN_SUM
          this.$refs.searchBox.style.width = boxWidth + 'px'
          this.$refs.iSearch.style.marginLeft = ''
        } else {
          this.$refs.personal.style[transform] = 'translate3d(110%, 0, 0)'
          boxWidth = this.$refs.vHeader.clientWidth - this.$refs.logo.clientWidth - 25
          this.$refs.searchBox.style.width = boxWidth + 'px'
          this.$refs.searchBox.style.transition = 'all 0.5s'
        }
        this.$refs.searchInput.style.width = boxWidth - this.$refs.iSearch.clientWidth + 'px'
        this.$refs.searchInput.style.transition = 'all 0.5s'
      },
      ...mapMutations({
        'setCurrentSearchResult': 'SET_CURRENT_SEARCH_RESULT',
        'setNeedResetPage': 'SET_NEED_RESET_PAGE'
      })
    },
    watch: {
      needResetPage() {
        if (!this.$refs.vHeader) {
          return
        }
        this._initSearchBoxWidth(false)
      },
      query(newVal) {
        if (this.query === '') {
          this.suggestArr = []
          this.showSuggest = false
          return
        }
        this._getSuggest(newVal)
        this.showSuggest = true
      },
      scrollOffsetTop(newVal) {
        if (newVal > 0) {
          this.showSuggest = false
        } else {
          if (this.suggestArr.length) {
            this.showSuggest = true
          }
        }
      }
    },
    components: {
      Suggest
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  .v-header
    width: 100%
    background: $color-sub-theme
    font-size: 10px
    color: #FFF
    overflow: hidden
    .logo
      display: inline-block
      font-size: 40px
      margin: 5px 5px 0 5px
    .search-input-box
      position: absolute
      display: inline-block
      width: 100%
      margin: 6px 10px 5px 0
      padding: 7px 5px 10px 5px
      background: #FFF
      border-radius: 5px
      font-size: 10px
      .search-input
        border: none
        outline: none
        font-size: 15px
      .iSearch
        position: absolute
        display: inline-block
        height: 27px
        vertical-align: top
        padding-right: 5px
        color: $color-sub-theme
        top: 5px
        background: white
        border-radius: 5px
        right: 0
        .icon
          font-size: 20px
    .personal
      position: relative
      float: right
      font-size: 15px
      border: 1px solid #FFF
      padding: 7px
      height: 17.5px
      line-height: 18px
      border-radius: 5px
      margin-top: 6px
      margin-right: 3px
      transition: all 0.5s
      display: flex
      color: $color-sub-theme
      background: #FFF
      border-radius: 5px
      .line
        margin: auto
</style>