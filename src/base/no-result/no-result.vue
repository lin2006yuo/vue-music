<template>
    <div class="no-result">
       <div class="no-result-text">{{title}}</div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {};
    },
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    components: {}
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
.no-result
    text-align center
    .no-result-text
        margin-top 30px
        font-size $font-size-medium
        color $color-text-d
</style>
