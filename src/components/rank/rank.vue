<template>
    <div class="rank" ref="rank">
            <scroll class="toplist" :data="topList" ref="toplist_scroll">
                <ul>
                    <li class="item" v-for="(item,index) in topList" :key="index" @click="selectItem(item)">
                        <div class="icon">
                            <img width="100" height="100"  :src="item.picUrl" alt="">
                        </div>
                        <ul class="songlist">
                            <li class="song" v-for="(song,index) in item.songList" :key="index">
                                <span>{{index + 1 + '.'}}</span>
                                <span>{{song.singername + '--' + song.songname}}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="loading-contianer" v-show="!topList.length">
                    <loading></loading>
                </div>
            </scroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
    mixins: [playListMixin],
    data() {
        return {
            topList: []
        };
    },
    components: {
        Scroll,
        Loading
    },
    created(){
        this._getTopList()
    },
    methods: {
        selectItem(item){
            this.$router.push(`/rank/${item.id}`)
            this.setTopList(item)
        },
        handlePlayList(playList){
            const bottom = playList.length > 0 ? '69px' : '';          
            this.$refs.rank.style.bottom = bottom
            this.$refs.toplist_scroll.anotherRefresh()
        },
        ...mapMutations({
            setTopList: 'SET_TOP_LIST'
        }),
        _getTopList(){
            getTopList().then(res => {
                if(res.code === ERR_OK){
                   this.topList = res.data.topList        
                }
            })
        }
    }
};
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.rank
    position fixed
    width 100%
    top 88px
    bottom 9px
    .toplist
        height 100%
        overflow hidden
        .item
            display flex
            margin 0 20px
            padding-top 20px
            height 100px
            &.last-child
                padding-bottom 20px
            .icon
                flex 0 0 100px
                width 100px
                height 100px
            .songlist
                flex 1
                display flex
                flex-direction column
                justify-content center
                padding 0 20px
                height 100px
                overflow hidden
                background-color $color-highlight-background
                color $color-text-d
                font-size $font-size-small
                box-shadow 2px 2px 0 #f5387D,2px 2px 0px #b20fa
                .song
                    @include no-wrap()
                    line-height 26px
        .loading-container
            position absolute
            width 100%
            top 50%
            transform translateY(-50%)   
                

</style>
