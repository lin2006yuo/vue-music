<template>
    <transition name="slide">
        <div class="disc-list">
            <music-list :title="title" :bg-img="bgImg" :songs="songs"></music-list>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
    components: {
        MusicList
    },
    computed: {
        title(){
            return this.disc.dissname
        },
        bgImg(){
            return this.disc.imgurl
        },
        ...mapGetters(['disc'])
    },
    data() {
        return {
            songs: []
        };
    },
    created() {
        this._getSongList()
    },
    methods: {
        _getSongList(){
            if(!this.disc.dissid){
                this.$router.push('/recommend')
                return 
            }
            getSongList(this.disc.dissid).then(res => {
               if(res.code === ERR_OK){
                   this.songs = this._normalizeSongs(res.cdlist[0].songlist);       
               }
            })
        },
        _normalizeSongs(list){
            let ret = []
            list.forEach(musicData => {
               ret.push(createSong(musicData))
            });
            return ret
        }
    }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
    .disc-list
        position fixed
        z-index 10
        top 0
        left 0
        right 0
        bottom 0
        background-color $color-background
    .slide-enter-active, .slide-leave-active
        transition all .3s
    .slide-enter, .slide-leave-to
        transform translate3d(100%, 0, 0)
</style>
