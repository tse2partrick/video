<template>
  <div class="edu">
    <v-menu :v-data="vData" :menu="menu" @needFilter="onNeedFilter"></v-menu>
  </div>
</template>

<script type="text/javascript">
  import {getEduMenu, getEdu} from 'api/edu'
  import {RES_OK} from 'common/js/config'
  import {menuMixin} from 'common/js/mixins'
  import VMenu from 'components/v-menu/v-menu'

  export default {
    mixins: [menuMixin],
    data() {
      return {
        menu: [],
        kindId: '',
        areaId: '',
        chargeId: '',
        editionId: '',
        vData: []
      }
    },
    created() {
      this._getEduMenu()
    },
    methods: {
      onNeedFilter(id, type) {
        switch (type) {
          case 'kind':
            this.kindId = id
            break
          case 'area':
            this.areaId = id
            break
          case 'charge':
            this.chargeId = id
            break
          case 'edition':
            this.editionId = id
            break
          default:
            break
        }
        this._getEdu(this.kindId, this.areaId, this.chargeId, this.editionId)
      },
      _getEduMenu() {
        getEduMenu().then((res) => {
          if (res.code === RES_OK) {
            this.menu = this._simplizeMenu(res.data.filterItems)
            this.kindId = this.menu[0][0].id
          }
        })
      },
      _getEdu(kindId, areaId, chargeId, editionId) {
        getEdu(kindId, areaId, chargeId, editionId).then((res) => {
          if (res.code === RES_OK) {
            this.vData = res.data
          }
        })
      }
    },
    watch: {
      menu() {
        this.$nextTick(() => {
          this._getEdu(this.kindId, this.areaId, this.chargeId, this.editionId)
        })
      }
    },
    components: {
      VMenu
    }
  }
</script>

<style type="text/css" lang="stylus">
</style>