<template>
    <div class="progress-bar" ref="progressBar" @click.stop.prevent="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import {profixStyle} from 'common/js/dom'
const transform = profixStyle('transform')
const progressBtnWidth = 16

export default {
    data() {
        return {};
    },
    props:{
        percent: {
            type: Number,
            default: 0
        }
    },
    watch:{
        percent(newProcent){
            if(newProcent >= 0 && !this.touch.initialed){
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                const offsetWidth = newProcent * barWidth
                this._offset(offsetWidth)
            }
        }
    },
    components: {},
    created() {
        this.touch = {}
    },
    methods: {
        progressClick(e){
            const rect = this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth = e.pageX - rect.left
            this._offset(offsetWidth)
            this._triggerPercent()
        },
        progressTouchStart(e){
            this.touch.initialed = true
            this.touch.startX = e.touches[0].pageX
            this.touch.left = this.$refs.progress.clientWidth
        },
        progressTouchMove(e){
            if(!this.touch.initialed){
                return 
            }
            const deltaX = e.touches[0].pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - 
            progressBtnWidth, Math.max(0, this.touch.left + deltaX))
            this._offset(offsetWidth)
            // this._triggerPercent()
        },
        progressTouchEnd(){
            this.touch.initialed = false
            this._triggerPercent()
        },
        _offset(offsetWidth){
            this.$refs.progress.style.width = offsetWidth + 'px'
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`           
        },
        _triggerPercent(){
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
            const percent = this.$refs.progress.clientWidth / barWidth
            this.$emit('percentChange', percent)
        }
        
    }
};
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.progress-bar
    height 30px
    .bar-inner
        position relative
        top 13px
        height 4px
        background rgba(0, 0, 0, 0.3)
        .progress
            position absolute
            height 100%
            background-color $color-theme
        .progress-btn-wrapper
            position absolute
            left -8px
            top -13px
            width 30px
            height 30px
            .progress-btn
                position relative
                top 7px
                left 7px
                box-sizing border-box
                width 16px
                height 16px
                border: 3px solid $color-text
                border-radius 50%
                background-color $color-theme

</style>
