<template>
    <div class="loading">
        <img  width="24" hight="14"  src="./images/loading.gif" alt="">
        <p class="desc">{{title}}</p>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {};
    },
    props:{
        title: {
            type: String,
            default: '正在载入...'
        }
    },
    components: {}
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.loading
    width 100%
    text-align center
    .desc
        line-height 20px
        font-size $font-size-small
        color $color-text-l
</style>
