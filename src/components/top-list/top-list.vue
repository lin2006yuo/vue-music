<template>
    <transition name="slide">
        <div class="top-list">
            <music-list  :rank="rank" :title="title" :bg-img="bgImage" :songs="songs"></music-list>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getDetailTopList} from 'api/rank'
import  {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
    data() {
        return {
            songs: [],
            rank: true
        };
    },
    components: {
        MusicList
    },
    computed:{
        title(){
            return this.topList.topTitle
        },
        bgImage(){
            if(this.songs.length){
                return this.songs[0].image
            }
            return ''
        },
        ...mapGetters([
           'topList' 
        ]),
    },
    created(){
        this._getDetailTopList()
    },
    methods: {
        _getDetailTopList(){
            if(!this.topList.id){
                this.$router.push('/rank')
            }
            getDetailTopList(this.topList.id).then(res => {
            this.songs = this._normalizeSong(res.songlist)
            })
        },
        _normalizeSong(list){ 
          
            let ret = []
            if(!list){
                return 
            }
            list.forEach(song => {
                ret.push(createSong(song.data))
            });
            return ret
        }
    }
};
</script>

<style scoped lang="stylus">
.top-list
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 100
    background-color #222
.slide-enter-active, .slide-leave-active
    transition all .3s
.slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
