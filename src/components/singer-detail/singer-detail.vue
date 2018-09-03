<template>
    <transition name="slide">
        <div class="singer-detail">
            <music-list :songs="songs" :bg-img="bgImg" :title="title"></music-list>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
    data() {
        return {
            songs: []
        };
    },
    components: {
        MusicList
    },
    computed: {
        title(){
            return this.singer.name
        },
        bgImg(){
            return this.singer.avatar
        },
        ...mapGetters(['singer'])
    },
    created() {
        this._getDetail()
    },
    methods: {
        _getDetail(){
            if(!this.singer.id){
                this.$router.push('/singer')
                return
            }
            getSingerDetail(this.singer.id).then(res => {
                this.songs = this._normalizeSongs(res.data.list)               
            })
        },
        _normalizeSongs(list){
            const ret = []
            list.forEach(item => {
                let {musicData} = item
                if(musicData.songid && musicData.albummid){                   
                    ret.push(createSong(musicData))
                }
            });
            return ret
        }
    },
    updated() {
        console.log('update');
        
    },
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
    .singer-detail
        position fixed
        z-index 150
        top 0
        left 0
        right 0
        bottom 0
        background-color $color-background




    .slide-enter-active, .slide-leave-active
        transition transform .3s
    .slide-enter, .slide-leave-to
        transform translateX(100%)
</style>
