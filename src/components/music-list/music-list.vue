<template>
    <div class="music-list">
        <div class="back" @click="$router.back()">返回</div>
        <h1 class="title">{{ title }}</h1>
        <div class="bg-img" :style="bgStyle" ref="bgImg">
            
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll  @scroll="scroll" :data="songs" class="list" ref="list" :probe-type="3" :listen-scroll="true" >
            <div class="song-list-wrapper">
                <song-list  :rank="rank" :songs="songs" @select="selectItem"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import {profixStyle} from 'common/js/dom'
import Loading from 'base/loading/loading'
import {playListMixin} from 'common/js/mixin'

import {mapActions} from 'vuex'

//css 前缀兼容
const transform = profixStyle('transform')
const backdrop = profixStyle('backdrop-filter')

export default {

    //插入mixin

    mixins: [playListMixin],
    data() {
        return {
            scrollY: 0,
            minTranslateY: ''
        };
    },
    props: {
        bgImg: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Scroll,
        SongList,
        Loading
    },
    computed: {
        bgStyle(){
            return `background-image:url(${this.bgImg})`
        }
    },
    mounted() {
        this.imageHeight = this.$refs.bgImg.clientHeight
        this.minTranslateY = -this.imageHeight + 40
        this.$refs.list.$el.style.top = `${this.imageHeight}px`       
    },
    methods: {
        handlePlayList(plasyList){
            const bottom = plasyList.length > 0 ? '60px' : ''
            this.$refs.list.$el.style.bottom = bottom
            this.$refs.list.anotherRefresh()
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        selectItem(item, index){
            this.selectPlay({
                list: this.songs,
                index: index
            })
        },
        ...mapActions([
            'selectPlay'
        ])
    },
    watch: {
        scrollY(newY){
            let translateY = Math.max(this.minTranslateY,newY)    
            this.$refs.layer.style[transform] = `translateY(${translateY}px)`
            let scale = 1
            let zIndex = 0
            let blur = 0
            const percent = Math.abs(newY / this.imageHeight)
            if(newY > 0){
                scale = 1 + percent
                zIndex = 100
            }else{
                blur = Math.min(20*percent,20)
            }
            this.$refs.filter.style[backdrop] = `blur(${blur}px)`
            // this.$refs.filter.style['background-color'] = `red`

            this.$refs.bgImg.style[transform] = `scale(${scale})`
            this.$refs.bgImg.style.zIndex = zIndex
            if(newY < this.minTranslateY){
                zIndex = 100
                this.$refs.bgImg.style.paddingTop = 0
                this.$refs.bgImg.style.height = `40px`
                this.$refs.bgImg.style.zIndex = zIndex
            }else{
                this.$refs.bgImg.style.height = `0`
                this.$refs.bgImg.style.zIndex = zIndex
                this.$refs.bgImg.style.paddingTop = '70%'
            }
        }
    }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
.music-list
    width 100%
    height 100%
    z-index 100
    .back
        z-index 1000
        position fixed
        line-height 40px
        left 10px
        color $color-theme
        font-size $font-size-medium
    .title
        position fixed
        z-index 101
        line-height 40px
        height 40px
        width 100%
        text-align center
        font-size $font-size-medium
        color $color-text
    .bg-img
        z-index -1
        width 100%
        padding-top 70%
        height 0
        position relative
        top 0
        left 0
        background-size cover
        background-repeat no-repeat
        transform-origin top
        .filter
            position absolute
            width 100%
            height 100%
            top 0
    .bg-layer
        position relative
        height 100%
        background-color $color-background
        transform translateY(0px)
        overflow hidden
    .list
        z-index 10
        position fixed
        top 0
        bottom 0
        background-color $color-background
        .song-list-wrapper
            padding 20px 30px
        .loading-container
            position fixed
            top 50%
            width 100%
            text-align center
</style>
