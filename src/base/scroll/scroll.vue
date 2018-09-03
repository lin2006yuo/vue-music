<template>
    <div class="wrapper" ref="wrapper">
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
    data() {
        return {};
    },
    props: {
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: []
        },
        listenScroll: {
            type: Boolean,
            default: false
        },
        pullup: {
            type: Boolean,
            default: false
        },
        beforeScroll: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        setTimeout(() => {
            this._initScroll()
        }, 20);
    },
    methods: {
        _initScroll(){
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click,
            })

            if(this.listenScroll){
                const vm = this
                this.scroll.on('scroll', (pos) => {
                    vm.$emit('scroll', pos)
                })
            }
            
            if(this.pullup){
                this.scroll.on('scrollEnd', () => {
                    if(this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToEnd')
                    }          
                })
            }

            if(this.beforeScroll) {
                this.scroll.on('beforeScrollStart', ()=>{
                    this.$emit('beforeScroll')
                })
            }
        },
        enable(){
            this.scroll && this.scroll.enable()
        },
        disable(){
            this.scroll && this.scroll.disable()
        },
        refresh(){
            if(!this.checkLoaded){
                //因为图片有多个，防止多次被执行
                this.scroll && this.scroll.refresh()
                this.checkLoaded = true
            }
        },
        anotherRefresh(){
            //上面一个refresh在刷新bottom 60px后无法执行
            this.scroll && this.scroll.refresh()
        },
        scrollTo(){
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement(){
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
    },
    watch: {
        data(){
            setTimeout(() => {
                this.refresh()
            }, 20);
        }
    },
    components: {}
};
</script>

<style scoped lang="stylus">
</style>
