<template>
    <div class="recommend">
        <scroll class="recommend-content" :data="recommendList" ref="scroll">
            <div>
                <div class="recommend-wrapper">
                    <slider :slideList="slideList" v-if="slideList"></slider>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门推荐</h1>
                    <ul>
                        <li  @click="selectItem(item)" v-for="(item,index) in recommendList" :key="index" class="item">
                            <div class="icon">
                                <img @load="loadImage" width="60" height="60" v-lazy="item.imgurl" alt="">
                            </div>
                            <div class="text">
                                <h2 class="name">{{item.creator.name}}</h2>
                                <p class="desc">{{item.dissname}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-content" v-show="!recommendList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import {getRecommend, getDiscList} from 'api/recommend'
import Scroll from 'base/scroll/scroll'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
    mixins: [playListMixin],
    data() {
        return {
            slideList: [],
            recommendList: [],
        };
    },
    created() {
        this._getRecommend()
        this.$nextTick(()=>{
            this._getDiscList()
        })
    },
    methods: {
        //传递歌单数据
        selectItem(item){  
            this.$router.push({
                path: `recommend/${item.dissid}`
            })

            this.setDisc(item)
        },
        handlePlayList(playList){
            const bottom = playList.length > 0 ? '60px' : '';          
            this.$refs.scroll.$el.style.bottom = bottom
            this.$refs.scroll.anotherRefresh()
        },
        _getRecommend(){
            getRecommend().then(res => {
                if(res.code === ERR_OK){
                    this.slideList = res.data.slider
                }
            })
        },
        _getDiscList(){
            getDiscList().then(res => {
                this.recommendList = res.data.list
            })
        },
        loadImage(){
            //有可能轮播图加载慢，导致BScroll计算高度错误，当图片加载完毕后触发load事件，
            //然后调用refresh
            this.$refs.scroll.refresh()
        },
        ...mapMutations({
            setDisc: 'SET_DISC'
        })
    },
    components: {
        Slider,
        Scroll,
        Loading
    }
};
</script>

<style lang="stylus">
@import '~common/stylus/variable'
.recommend
    overflow hidden
    .recommend-content
        width 100%
        position absolute
        top 88px
        bottom 0
        overflow hidden
        .recommend-wrapper
            position relative
            width 100%
            overflow hidden
            img 
                width 100%
        .recommend-list
            .list-title
                height 65px
                line-height 65px
                text-align center
                font-size $font-size-medium
                color $color-theme
            .item
                display flex
                padding 0 20px 20px 20px
                .icon
                    flex 0 0 60px
                    padding-right 20px
                .text
                    flex 1
                    display flex
                    flex-direction column
                    justify-content center
                    line-height 20pxf
                    font-size: $font-size-medium
                    .name
                        margin-bottom 10px
                        color $color-text
                    .desc
                        color $color-text-d
        .loading-conten
             position absolute
             width 100%
             top 50%
             transform translateY(-50%)         
                

</style>
