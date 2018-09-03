<template>
    <div class="player" v-show="playList.length > 0">
        <transition  name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img  width="100%" height="100%" :src="currentSong.image" alt="">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="iconfont icon-down-circle"></i>
                    </div>
                    <h1 class="title">{{currentSong.name}}</h1>
                    <h2 class="subtitle">{{currentSong.singer}}</h2>
                </div>
                <div class="middle"
                    @touchstart.prevent="middleTouchStart"
                    @touchmove.prevent="middleTouchMove"
                    @touchend.prevent="middleTouchEnd"
                >
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="playAnimation">
                                <img ref="cdImg" :src="currentSong.image" alt="" class="image"  >
                            </div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p
                                    ref="lyricLine"
                                    class="text"
                                    :class="{'current': currentLineNum === index}"
                                    v-for="(line, index) in currentLyric.lines" :key="index"
                                >
                                    {{line.txt}}
                                </p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <!-- icon-sync -->
                            <i class="iconfont" :class="iconMode"></i>
                        </div>
                        <div class="icon i-left">
                            <i @click="prev" class="iconfont icon-left-circle"></i>
                        </div>
                        <div class="icon i-center">
                            <i @click="togglePlaying" class="iconfont" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right">
                            <i @click="next" class="iconfont icon-right-circle"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="iconfont icon icon-heart"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img class="miniImg" width="40" height="40"  :src="currentSong.image" alt="" :class="playAnimation">
                </div>
                <div class="text">
                    <div class="name">{{currentSong.name}}</div>
                    <div class="desc">{{currentSong.singer}}</div>
                </div>
                <div class="control">
                    <progress-circle :percent="percent">
                        <i  @click.stop="togglePlaying" class="iconfont icon-mini" :class="miniPlayIcon"></i>
                    </progress-circle>
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="icon-smile iconfont"></i>
                </div>
            </div>
        </transition>
        <playlist ref="playlist"></playlist>
        <audio id="audio" ref="audio"
            :preload="currentSong.url"
            :src="currentSong.url"
            @canplay="ready"
            @error="error"
            @timeupdate="updateTime"
            @ended="end"
        ></audio>
    </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters,mapMutations} from "vuex"
import animations from 'create-keyframe-animation'
import {profixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'


import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
import { playMode } from 'common/js/config'

import {playerMixin} from 'common/js/mixin'

const transform = profixStyle('transform')
const animationPlayState = profixStyle('animation-play-state')
const transitionDuration = profixStyle('transition-duration')
const transitionTimingFunction = profixStyle('transition-timing-function')

export default {
    mixins: [playerMixin],
    data() {
        return {
            songReady: false,
            currentTime: 0,
            currentLyric: null,
            currentLineNum: 0,
            currentShow: 'cd'
        };
    },
    components: {
        ProgressBar,
        ProgressCircle,
        Scroll,
        Playlist
    },
    created() {
        this.touch = {}
    },
    computed: {

        percent(){
            return this.currentTime / this.currentSong.duration
        },
        playAnimation(){
            console.log(this.playing);

            return this.playing ? 'play' : 'play pause'
        },
        playIcon(){
            return this.playing ? 'icon-timeout' : 'icon-right-circle'
        },
        miniPlayIcon(){
            return this.playing ? 'icon-timeout' : 'icon-right-circle'
        },
        ...mapGetters([
            'fullScreen',
            'playing',
            'currentIndex',
        ])
    },
    methods: {
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',

        }),
        middleTouchStart(e){
            this.touch.initialed = true
            const touch = e.touches[0]
            this.touch.startX = touch.pageX
            this.touch.startY = touch.pageY
            this.$refs.lyricList.$el.style[transitionDuration] = '0s'
        },
        middleTouchMove(e){
            if(!this.touch.initialed){
                return 
            }
            const touch = e.touches[0]
            const deltaX = touch.pageX - this.touch.startX
            const deltaY = touch.pageY - this.touch.startY
            //滚动歌词是上下滚动的，如果纵轴大于横轴，则不滚动
            if(Math.abs(deltaY) > Math.abs(deltaX)){
                return 
            }
            
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
            const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
            this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            
            //修改背景透明度
            // console.log(this.touch.percent);
            
           this.$refs.middleL.style.opacity = 1 - this.touch.percent
        },
        middleTouchEnd(){

            
            let offsetWidth = 0
            //如果从右向左滑
            let opacity = 0
            if(this.currentShow === 'cd'){
                   if(this.touch.percent > 0.2){
                       offsetWidth = -window.innerWidth
                       opacity = 0
                       this.currentShow = 'lyric'
                       this.touch.percent = 1
                   }else{
                       opacity = 1
                       offsetWidth = 0
                   }
            }else{
                if(this.touch.percent < 0.8){
                    offsetWidth =  0
                    opacity = 1
                    this.currentShow = 'cd'
                }else{
                    opacity = 0
                    offsetWidth = -window.innerWidth
                }
            }
            
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration] = '.3s'          
            this.$refs.middleL.style.transition = 'opacity .4s'
            this.$refs.middleL.style.opacity = opacity
        },
        getLyric(){
            this.currentSong.getLyric().then((lyric) =>{
                this.currentLyric = new Lyric(lyric,this.handleLyric)            
                if(this.playing){
                    this.currentLyric.play()
                }
            })
        },
        handleLyric({lineNum, currentLyric}){
            this.currentLineNum = lineNum
            if(lineNum > 5){
                let linEL = this.$refs.lyricLine[lineNum - 5]
                this.$refs.lyricList.scrollToElement(linEL,1000)
            }else{
                 this.$refs.lyricList.scrollTo(0, 0, 1000)
            }
        },
        end(){
            if(this.mode === playMode.loop){
                this.loop()
            }else{
                this.next()
            }
        },
        loop(){
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            if(this.currentLyric){
                this.currentLyric.seek(0)
            }
        },

        onProgressBarChange(percent){
            const currentTime = this.currentSong.duration * percent
            this.$refs.audio.currentTime = currentTime
            if(this.currentLyric){
                this.currentLyric.seek(currentTime * 1000)
                if(!this.playing){
                    this.currentLyric.togglePlay()
                }
            }

        },
        format(interval){
            interval = interval | 0
            const minute = interval / 60 | 0
            const second = this._pad(interval % 60)
            return `${minute}:${second}`
        },
        updateTime(e){
            this.currentTime = e.target.currentTime
        },
        error(){
            this.songReady = false
        },
        ready(){
            this.songReady = true
        },
        prev(){
            if(!this.songReady){
                return
            }
            let index = this.currentIndex - 1
            if(index === -1){
                index = this.playList.length - 1
            }
            this.setCurrentIndex(index)
            this.setPlayingState(true)
            this.songReady = false
        },
        next(){
            if(!this.songReady){
                return
            }
            let index = this.currentIndex + 1
            if(index === this.playList.length){
                index = 0
            }
            this.setCurrentIndex(index)
            this.setPlayingState(true)
            this.songReady = false
        },
        open(){
            this.setFullScreen(true)
        },
        back(){
            this.setFullScreen(false)
        },
        enter(el, done){
            const {x, y, scale} = this._getPosAndScale()
            let animation = {
                0: {
                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })

            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter(el){
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el,done){
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const {x, y, scale} = this._getPosAndScale()
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)

        },
        afterLeave(el){
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        },
        showPlaylist(){
            this.$refs.playlist.show()
        },
        _getPosAndScale(){
            const targetWidth = 40
            const paddingLift = 40
            const paddingBottom = 30
            const paddingTop = 80
            const width = window.innerWidth * 0.8
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - paddingLift)
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {
                x,
                y,
                scale
            }
        },
        _pad(num, n = 2){
            let len = num.toString().length
            while(len<2){
                num = '0' + num
                len ++
            }
            return num
        },
        togglePlaying(){
            // this.$refs.cdImg.style[animationPlayState] = this.playAnimation
            this.setPlayingState(!this.playing)
            this.playing ? this.$refs.audio.play() : this.$refs.audio.pause()
            if(this.currentLyric){
                this.currentLyric.togglePlay()
            }
        },
        handler(){
            var musicEle0 = document.getElementById('audio');
                musicEle0.play();
                document.removeEventListener('touchstart',this.handler,false)
            console.log('play');
        },
        _one(action){
            document.addEventListener(action,this.handler,false)
        }
    },
    watch: {
        currentSong(){
            //清楚歌词对象计时器
            if(this.currentLyric){
                this.currentLyric.stop()
            }
           if(this.playing){
                this.$nextTick(()=>{
                this.$refs.audio.play()
                this.getLyric()
            })
           }
        },
        sequenceList(){
            this.setPlayMode(playMode.sequence)
        },
        // playing(newPlaying){
        //     const audio= this.$refs.audio
        //     this.$nextTick(()=> {
        //         newPlaying ? audio.play() : audio.pause()
        //     })
        // }
        playing(play){
            play ? this.$refs.audio.play() : this.$refs.audio.pause()
        }
        
    },
    mounted() {
        this._one('touchstart')
        this.$refs.audio.volume = 0.2
    },
};
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.player
    .normal-player
        position fixed
        left 0
        top 0
        right 0
        bottom 0
        z-index 200
        background-color $color-background
        color #fff
        .background
            position absolute
            left 0
            top 0
            width 100%
            height 100%
            z-index -1
            opacity 0.6
            filter: blur(20px)
        .top
            position relative
            margin-bottom 25px
            .back
                position absolute
                top 0
                left 6px
                z-index 50
                .icon-down-circle
                    display block
                    padding 9px
                    font-size $font-size-large-x
                    color $color-theme
            .title
                width 70%
                margin 9px auto 0
                line-height 40px
                text-align center
                no-wrap()
                font-size $font-size-large
                color $color-text
            .subtitle
                line-height 20px
                text-align center
                font-size $font-size-medium
                color $color-theme
        .middle
            position fixed
            width 100%
            top 80px
            bottom 170px
            white-space nowrap
            font-size 0
            .middle-l
                display inline-block
                vertical-align top
                position relative
                width 100%
                height 0
                padding-top 80%

                .cd-wrapper
                    position absolute
                    left 10%
                    top 0
                    width 80%
                    box-sizing border-box
                    height 100%
                    .cd
                        width 100%
                        height 100%
                        border-radius 50%
                        &.play
                            animation rotate 20s linear infinite
                        &.pause
                            animation-play-state paused
                        .image
                            position absolute
                            left 0
                            top 0
                            width 100%
                            height 100%
                            box-sizing border-box
                            border-radius 50%
                            border 10px solid rgba(255,255,255,0.1)

            .middle-r
                display inline-block
                vertical-align top
                width 100%
                height 100%
                overflow hidden
                .lyric-wrapper
                    width 80%
                    margin 0 auto
                    overflow hidden
                    text-align center
                    .text
                        line-height 32px
                        color $color-text-l
                        font-size $font-size-medium
                        &.current
                            color $color-text
                    .pure-music
                        padding-top 50%
                        line-height 32px
                        color $color-text-l
                        font-size $color-size-medium

        .bottom
            position absolute
            bottom 50px
            width 100%
            .dot-wrapper
                text-align center
                font-size 0
                .dot
                    display inline-block
                    vertical-align middle
                    margin 0 4px
                    width 8px
                    height 8px
                    border-radius 50%
                    background-color $color-text-l
                    &.active
                        width 20px
                        border-radius 5px
                        background-color $color-theme
            .progress-wrapper
                display flex
                width 85%
                margin 0 auto
                padding 10px 0
                .time
                    color $color-text
                    font-size $font-size-medium
                    flex 0 0 35px
                    width 30px
                    line-height 30px
                    &.time-l
                        text-align left
                        margin-right 5px
                    &.time-r
                        text-align right
                        margin-left 5px
                .progress-bar-wrapper
                    flex 1
            .operators
                display flex
                align-items center
                .icon
                    flex 1
                    color $color-theme
                    i
                        font-size 30px
                .i-left
                    text-align right
                .i-center
                    padding 0 20px
                    text-align center
                    i
                        font-size 50px
                .i-right
                    text-align left
                .i-favorite
                    color: $color-theme
        &.normal-enter-active, &.normal-leave-active
            transition all .4s
            .top, .bottom
                transition  all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        &.normal-enter, &.normal-leave-to
            opacity 0
            .top
                transform translate3d(0, -100px, 0)
            .bottom
                transform translate3d(0, 100px, 0)

    .mini-player
        width 100%
        display flex
        align-items center
        position fixed
        left 0
        bottom 0
        z-index 180
        height 60px
        background-color $color-highlight-background
        .icon
            flex 0 0 40px
            width 40px
            height 40px
            padding 0 10px 0 20px
            .miniImg
                border-radius 50%
                &.play
                    animation rotate 20s linear infinite
                &.pause
                    animation-play-state paused

        .text
            display flex
            flex-direction column
            justify-content center
            flex 1
            line-height 20px
            overflow hidden
            .name
                font-size $font-size-small
                color $color-text-d
            .desc
                font-size $font-size-small
                color $color-text-d
        .control
            flex 0 0 30px
            width 100%
            padding 0 10px
            .icon-smile
                font-size 30px
                color $color-theme
            .icon-right-circle
                color $color-theme
                font-size 30px
            .icon-timeout

                font-size 30px
            .icon-mini
                font-size 32px
                position absolute
                left 0
                top 0
                z-index 10
                color $color-theme-d
@keyframes rotate {
    0%{
        transform rotate(0)
    }
    100%{
        transform rotate(360deg)
    }
}

</style>
