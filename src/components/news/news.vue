<template>
  <div class="news">
    <sec-menu :v-banner="vBanner" :v-data="vData" @goSubChannel="onGoSubChannel"></sec-menu>
  </div>
</template>

<script type="text/javascript">
  import {getNewsData, getSubNewsData} from 'api/news'
  import {secMenuMixin} from 'common/js/mixins'
  import {RES_OK} from 'common/js/config'
  import SecMenu from 'components/sec-menu/sec-menu'
  export default {
    mixins: [secMenuMixin],
    data() {
      return {
        vBanner: [],
        vData: []
      }
    },
    created() {
      this._getNewsData()
    },
    methods: {
      onGoSubChannel(jumpId) {
        getSubNewsData(jumpId).then((res) => {
          if (res.code === RES_OK) {
            let {banner, ret} = this._simplizeData(res.data)
            this.vBanner = banner
            this.vData = ret
          }
        })
      },
      _getNewsData() {
        getNewsData().then((res) => {
          if (res.code === RES_OK) {
            let {banner, ret} = this._simplizeData(res.data)
            this.vBanner = banner
            this.vData = ret
          }
        })
      }
    },
    components: {
      SecMenu
    }
  }
</script>