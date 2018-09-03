<template>
    <div class="m-header">
        <div class="icon"></div>
        <div class="text">LXY Music</div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {}
    },
    components: {}
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin.styl'
@import '~common/stylus/variable.styl'
.m-header
    position relative
    height 44px
    text-align center
    font-size 0
    color $color-theme
    .text
        display inline-block
        vertical-align center
        line-height 44px
        font-size $font-size-large
</style>
