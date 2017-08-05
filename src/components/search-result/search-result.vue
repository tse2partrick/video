<template>
  <div class="search-result">
    <div class="item-wrapper">
      <div class="item" v-for="item in currentSearchResult" @click="goToPlay(item)">
        <div class="image">
          <img width="100%" height="100%" :src="item.image" ref="img" />
        </div>
        <div class="title-wrapper">
          <span class='title' ref="title">{{item.title}}</span>
          <span class="info" ref="info">简介：{{item.story}}</span>
          <span class="newest" ref="newest">更新至：{{item.newest}}</span>
        </div>
      </div>
      <div class="no-item" v-show="!currentSearchResult.length">没有搜索结果...（芒果没有这版权）</div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'currentSearchResult'
      ])
    },
    methods: {
      goToPlay(item) {
        this.setCurrentClipId(item.clidId)
        this.setCurrentPartId(item.partId)
        this.setCurrentVideo(item)
        this.$router.push({
          path: '/player'
        })
      },
      ...mapMutations({
        'setCurrentClipId': 'SET_CURRENT_CLIP_ID',
        'setCurrentPartId': 'SET_CURRENT_PART_ID',
        'setCurrentVideo': 'SET_CURRENT_VIDEO'
      })
    }
  }
</script>

<style type="text/css" lang="stylus">
  .search-result
    font-size: 10px
    .item-wrapper
      display: flex
      flex-wrap: wrap
      box-sizing: border-box
      padding: 5px
      .item
        text-align: center
        box-sizing: border-box
        margin: 10px 0
        .image
          display: inline-block
          width: 40%
        .title-wrapper
          display: inline-block
          width: 50%
          vertical-align: top
          box-sizing: border-box
          padding: 0 10px
          .title, .info, .newest
            display: block
            text-align: left
            font-size: 15px
            box-sizing: border-box
          .info
            padding: 20px 0
      .no-item
        margin: auto
        font-size: 15px
</style>