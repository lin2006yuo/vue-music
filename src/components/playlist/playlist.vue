<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="iconfont" :class="iconMode" @click="changeMode"></i>
                        <span class="text"></span>
                        <span class="clear" @click="showConfirm">
                            <i class="iconfont icon-garbage"></i>
                        </span>
                    </h1>
                </div>
                <scroll ref="listContent" class="list-content" :data="playList">
                    <transition-group name="list" tag="ul">
                        <li class="item" 
                            v-for="(item, index) in playList" 
                            :key="item.id"
                            @click="selectItem(item, index)"
                            ref="listItem"
                        >
                            <i :class="getCurrentIcon(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <span class="like">
                                <i class="iconfont icon-heart"></i>
                            </span>
                            <span class="delete" @click.stop="deleteOne(item)">
                                <i class="iconfont icon-searchclose"></i>
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-operate">
                    <div class="add">
                        <i class="iconfont icon-plus"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { mapActions } from 'vuex';
import {playMode} from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'

import {playerMixin} from 'common/js/mixin'

export default {
    mixins: [playerMixin],
    data() {
        return {
            showFlag: false
        };
    },
    components: {
        Scroll,
        Confirm
    },
    computed: {

    },
    methods: {
        show(){
            this.showFlag = true
            setTimeout(() => {
                this.$refs.listContent.anotherRefresh()
            }, 20);
        },
        hide(){
            this.showFlag = false
        },
        getCurrentIcon(item){
            if(this.currentSong.id === item.id){
                return 'current iconfont icon-target'
            }
            return 'current'
        },
        selectItem(item, index){          
            if(this.mode === playMode.random){
                index = this.playList.findIndex((song) => {
                    return item.id === song.id
                })
            }            
            this.setCurrentIndex(index)
        },
        scrollToCurrent(current){
            const index= this.sequenceList.findIndex((item)=>{
                return item.id === current.id
            })
            this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300) //300ms动画
        },
        deleteOne(item){
            this.deleteSong(item)
        },
        showConfirm(){
            this.$refs.confirm.show()
        },
        confirmClear(){
            this.deleteSongList()
        },
        ...mapActions([
            'deleteSong',
            'deleteSongList'
        ])
    },
    watch: {
        currentSong(newSong){
            if(!this.showFlag){
                return 
            }
            this.scrollToCurrent(newSong)
        }
    }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.playlist
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 200
    background-color $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-to
        transition opacity .3s
        .list-wrapper
            transition all .3s
    &.list-fade-enter, &.list-fade-leave-to
        opacity 0
        .list-wrapper
            transform translate3d(0, 100%, 0)
    .list-wrapper
        position absolute
        left 0
        bottom 0
        width 100%
        background-color $color-highlight-background
        .list-header
            position relative
            padding 20px 30px 10px 20px
            .title
                display flex
                align-items center
                .iconfont
                    margin-right 10px
                    font-size 30px
                    color $color-theme-d
                .text
                    flex 1
                    font-size $font-size-medium
                    color $color-text-l
                .clear
                    extend-click()
                    .iconfont
                        font-size $font-size-medium
                        color $color-text-d
        .list-content
            max-height 240px
            overflow hidden        
            .item
                display flex
                align-items center
                height 40px
                padding 0 30px 0 20px
                overflow hidden
                &.list-enter-active, &.list-leave-active
                    transition all .1s linear
                &.list-enter, &.list-leave-to
                    height 0
                .current
                    flex 0 0 20px
                    width 20px
                    font-size $font-size-small
                    color $color-theme-d
                .text
                    flex 1
                    no-wrap()
                    font-size $font-size-medium
                    color $color-text-d
                .like
                    extend-click()
                    margin-right 15px
                    font-size $font-size-small
                    color $color-theme
                    .icon-heart
                        color $color-sub-theme
                .delete
                    extend-click()
                    font-size $font-size-small
                    color $color-theme
                    .icon-searchclose
                        font-size $font-size-small
        .list-operate
            width 140px
            margin 20px auto 30px auto
            .add
                display flex
                align-items center
                padding 8px 16px
                border 1px solid $color-text-l
                border-radius 100px
                color $color-text-l
                .icon-plus
                    margin-right 5px
                    font-size $font-size-small-s
                    color $color-theme-d
                .text
                    font-size font-size-small
        .list-close
            text-align center
            line-height 50px
            background-color $color-background
            font-size $font-size-medium-x
            color $color-text-l


</style>
