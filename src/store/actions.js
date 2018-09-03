import * as types from './mutation-type'
import { saveSearch, deleteSearch, clearSearch} from 'common/js/caches.js'

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function ({commit,state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAY_LIST, list)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({commit, state}, song){
    let playlist = state.playList.slice() //  创建一个副本
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    //记录当前歌曲
    let currentSong = playlist[currentIndex]

    let fpIndex = findIndex(playlist, song)
    currentIndex++
    playlist.splice(currentIndex, 0, song)

    //如果已经包含这首歌
    if(fpIndex > -1){
        //如果当前插入的序号大于列表中的序号
        if(currentIndex > fpIndex){
            playlist.splice(fpIndex,1)
            currentIndex--
        }else{
            playlist.splice(fpIndex+1,1)
        }
    }
    
    let currentSIndex = findIndex(sequenceList, currentSong) + 1

    let fsIndex = findIndex(sequenceList, song)
    
    sequenceList.splice(currentSIndex, 0, song)

    if(fsIndex > -1){
        if(currentSIndex > fsIndex){
            sequenceList.splice(fsIndex, 1)
        }else{
            sequenceList.splice(fsIndex + 1, 1)
        }
    }

    commit(types.SET_PLAY_LIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export function saveSearchHistory({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export function deleteSearchHistory({commit}, item) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(item))
}

export function clearSearchHistory({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export function deleteSong({commit, state}, song) {
    let playlist = state.playList.slice() //  创建一个副本
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)
    
    if(currentIndex > pIndex || currentIndex === playlist.length){ //且删除的是最后一首歌
        currentIndex --
    }

    
    commit(types.SET_PLAY_LIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    if(!playlist.length){
        commit(types.SET_PLAYING_STATE, false)
    }
}

export function deleteSongList({commit}) {
    commit(types.SET_PLAY_LIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}