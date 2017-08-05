<template>
  <div class="suggest" ref="suggest">
    <div class="box" ref="box">
      <div class="item-wrapper">
        <div class="item" v-for="item in suggest" @click="clickTitle(item)">
          <span class="title">{{item.title}}</span>
        </div>
      </div>
    </div>
    <loading v-if="!suggest.length"></loading>
  </div>
</template>

<script type="text/javascript">
  import {scrollY} from 'common/js/util'
  import Loading from 'base/loading/loading'
  export default {
    props: {
      suggest: {
        type: Array,
        default: []
      }
    },
    methods: {
      clickTitle(item) {
        this.$emit('clickTitle', item.title)
      }
    },
    watch: {
      suggest() {
        this.$nextTick(() => {
          scrollY(this.$refs.suggest, this.$refs.box)
        })
      }
    },
    components: {
      Loading
    }
  }
</script>

<style type="text/css" lang="stylus">
  @import "~common/stylus/variable"
  .suggest
    background: $color-sub-theme
    position: fixed
    width: 100%
    height: 200px
    z-index: 110
    overflow: hidden
    font-size: 10px
    .box
      .item-wrapper
        .item
          box-sizing: border-box
          padding: 10px
          margin: 5px 0
          border-bottom: 1px solid #fff
          &:last-child
            border-bottom: none
          .title
            font-size: 15px
  @keyframes tipdown
    0%
      transform: translate3d(0, -100%, 0) scaleY(1.2)
    50%
      transform: translate3d(0, 10%, 0) scaleY(1.2)
    100%
      transform: translate3d(0, 0, 0) scaleY(1)
</style>