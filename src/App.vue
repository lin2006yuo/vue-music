<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <keep-alive>
      <router-view></router-view>    
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from './components/m-header/m-header.vue'
import MTab from 'components/tab/tab' 
import Player from './components/player/player'

export default {
  data () {
    return {}
  },
  components: {
    MHeader,
    MTab,
    Player
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'

  
</style>
