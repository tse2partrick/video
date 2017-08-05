<template>
  <div class="cartoon">
    <v-menu :menu="menu" :v-data="vData" @needFilter="onNeedFilter"></v-menu>
  </div>
</template>

<script type="text/javascript">
  import {getCartoonMenu, getCartoon} from 'api/Cartoon'
  import {RES_OK} from 'common/js/config'
  import {menuMixin} from 'common/js/mixins'
  import VMenu from 'components/v-menu/v-menu'
  export default {
    mixins: [menuMixin],
    data() {
      return {
        menu: [],
        vData: [],
        kindId: '',
        areaId: '',
        fitAgeId: '',
        editionId: ''
      }
    },
    created() {
      this._getCartoonMenu()
    },
    methods: {
      onNeedFilter(id, type) {
        switch (type) {
          case 'kind':
            this.kindId = id
            break
          case 'area':
            this.editionId = id
            break
          case 'charge':
            this.fitAgeId = id
            break
          case 'edition':
            this.areaId = id
            break
          default:
            break
        }

        this._getCartoon(this.kindId, this.areaId, this.fitAgeId, this.editionId)
      },
      _getCartoonMenu() {
        getCartoonMenu().then((res) => {
          if (res.code === RES_OK) {
            this.menu = this._simplizeMenu(res.data.filterItems)
            this.kindId = this.menu[0][0].id
          }
        })
      },
      _getCartoon(kindId, areaId, fitAgeId, editionId) {
        getCartoon(kindId, areaId, fitAgeId, editionId).then((res) => {
          if (res.code === RES_OK) {
            this.vData = res.data
          }
        })
      }
    },
    watch: {
      menu() {
        this._getCartoon(this.kindId, this.areaId, this.fitAgeId, this.editionId)
      }
    },
    components: {
      VMenu
    }
  }
</script>

<style type="text/css" lang="stylus"></style>