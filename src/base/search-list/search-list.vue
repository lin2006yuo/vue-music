<template>
    <div class="search-list">
        <transition-group name="list" tag="ul">
            <li class="search-item" 
                v-for="(item, index) in searches" 
                :key="index"
                @click="selectItem(item)"
            >
                <span class="text">{{item}}</span>
                <span class="icon"
                      @click.stop="deleteOne(item)"
                >
                    <i class="iconfont icon-searchclose"
                    ></i>
                </span>
            </li>
        </transition-group>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {};
    },
    props: {
        searches: {
            type: Array,
            default: []
        }
    },
    components: {},
    methods: {
        selectItem(item){
            this.$emit('select', item)
        },
        deleteOne(item){
            this.$emit('delete', item)
        }
    }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.search-list
    .search-item
        display flex
        align-items center
        height 40px
        overflow hidden
        &.list-enter-active, &.list-leave-active
            transition all .1s
        &.list-enter, &.list-leave-to
            height 0
        .text
            flex 1
            color $color-text-l
        .icon
            extend-click()
            .icon-searchclose
                font-size $font-size-small
                color $color-text-d

</style>
