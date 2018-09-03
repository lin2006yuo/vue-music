<template>
    <div class="singer" ref="singerContainer">
        <list-view ref="singerlist" :data="singers" v-if="singers" @select="selectSinger"></list-view>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listView/listView'
import {mapMutations} from 'vuex'
import {playListMixin} from 'common/js/mixin'

const HOT_SINGER_LEN = 10


export default {
    name: 'singer',
    mixins: [playListMixin],
    data() {
        return {
            singers: []
        };
    },
    created() {
        this._getSingerList()
    },
    methods: {
        handlePlayList(playList){        
            const bottom = playList.length > 0 ? '60px' : '';          
            this.$refs.singerContainer.style.bottom = bottom
            this.$refs.singerlist.refresh()
        },
        selectSinger(singer){
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        _getSingerList(){
            getSingerList().then(res => {
                if(res.code === ERR_OK){
                    this.singers = this._normalizeSinger(res.data.list)
                }
            }).catch(e => {
                console.log(e)
            })
        },
        _normalizeSinger(list){
            let map = {
                hot: {
                    title: '热门',
                    items: []
                }
            }

            list.forEach((item,index) => {
                if(index <= HOT_SINGER_LEN){
                    map.hot.items.push(new Singer(item.Fsinger_mid,item.Fsinger_name))                   
                }
                const key = item.Findex
                if(!map[key]){
                    map[key] = {
                        title: key,
                        items: []
                    }
                    
                }
                map[key].items.push(new Singer(item.Fsinger_mid,item.Fsinger_name))
            });
            //得到有序列表
            let hot = []
            let ret =[]
            for(let key in map){
                let val = map[key]
                if(val.title === '热门'){
                    hot.push(val)
                }else if(val.title.match(/[a-zA-Z]/)){
                    ret.push(val)
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    },
    computed: {
    },
    components: {
        ListView
    },
};
</script>

<style scoped lang="stylus">
.singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
