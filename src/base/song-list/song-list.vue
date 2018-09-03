<template>
    <div class="song-list">
        <ul>
            <li @click="selectItem(song, index)" class="item" v-for="(song,index) in songs" :key="index">
                <div class="rank" v-show="rank">
                    <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {};
    },
    props: {
        songs: {
            type: Array,
            default: []
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getDesc(song){
            return `${song.singer} - ${song.ablum}`
        },
        selectItem(song, index){
            this.$emit('select', song, index)
        },
        getRankCls(index){
            if(index <= 2){
                return `icon icon${index}`
            }else{
                return 'text'
            }
        },
        getRankText(index){
            if(index > 2){
                return index + 1
            }
        }
    },
    components: {}
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin'
.song-list
    .item
        display flex
        align-items cnenter 
        box-sizing border-box
        height 60px
        font-size $font-size-medium
        .rank
            flex 0 0 25px
            width 25px
            margin-right 30px
            text-align center
            .text
                color: $color-theme
                font-size: $font-size-large
            .icon
                display inline-block
                width 25px
                height 24px
                background-size 25px 24px
                &.icon0
                    bg-image('first')
                &.icon1
                    bg-image('second')
                &.icon2
                    bg-image('third')
        .content
            flex 1
            line-height 20px
            overflow hidden
            .name
                no-wrap()
                color: $color-text
            .desc
                no-wrap()
                margin-top 4px
                color $color-text-d

</style>
