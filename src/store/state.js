import {playMode} from 'common/js/config' 
import {loadSearch} from 'common/js/caches'

const state = {
    singer: {},
    playing: false,
    fullScreen: false,   //全屏
    playList: [],
    sequenceList: [],  //随机播放列表
    mode: playMode.sequence,
    currentIndex: -1,  //当前播放的索引
    disc: {},
    topList: [],
    searchHistory: loadSearch()
}

export default state