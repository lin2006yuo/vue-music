<template>
    <scroll class="listview"  :data="data" ref="listView" :listenScroll="listenScroll"
        @scroll="scroll" :probeType=3
    >
        <ul>
            <li 
                class="item"
                v-for="(group,index) in data"
                :key="index"
                ref="listGroup"
            >
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li
                        class="list-group-item"
                        v-for="(item,index) in group.items"
                        :key="index"
                        @click="selectItem(item)"
                    >
                        <img class="avatar" :src="item.avatar" alt="">
                        <span class="name">{{ item.name }}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart"
        @touchmove.stop.prevent="onShortcutTouchmove"
        >
            <ul>
                <li 
                    class="item"
                    v-for="(item,index) in shotcutList"
                    :key="index"
                    :data-index="index"
                    :class="{current: index === anchorIndex}"
                >
                {{ item }}</li>
            </ul>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
export default {
    name: 'listView',
    props: {
        data: {
            type: Array,
            default: [],
        }
    },
    data() {
        return {
            anchorIndex: 0,
            scrollY: -1,
            itemHeight: [],
            diff: 0
        }
    },
    created() {
        this.touch = {},
        this.listenScroll = true
    },
    computed:{
        shotcutList(){
            return this.data.map(group => {
                return group.title.substr(0,1)
            })
        }
    },
    methods:{
        refresh(){         
            this.$refs.listView.anotherRefresh()                    
        },
        onShortcutTouchStart(e){
            if(!getData(e.target, 'index')){
                return 
            }       
            this.anchorIndex = Number(getData(e.target, 'index'))
            this.touch.anchorIndex = Number(getData(e.target, 'index'))
            this.touch.y1 = e.touches[0]
            this.$refs.listView.scrollToElement(this.$refs.listGroup[this.anchorIndex],0)
        },
        onShortcutTouchmove(e){
            this.touch.y2 = e.touches[0]
            let delta = (this.touch.y2.pageY - this.touch.y1.pageY) / 18 | 0
            this.anchorIndex  = this.touch.anchorIndex + delta
            if(this.anchorIndex < 0){
                this.anchorIndex = 0
            }else if(this.anchorIndex > this.itemHeight.length - 1){
                this.anchorIndex = 22
            }
            this.$refs.listView.scrollToElement(this.$refs.listGroup[this.anchorIndex],0)
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        selectItem(item){
            this.$emit('select', item)
        }
    },
    components: {
        Scroll
    },
    mounted() {
        // console.log(this.$refs.listGroup);
        
        // this.$nextTick(() => {
        //    console.log(this.$refs.listGroup);
           
        // })
    },
    updated() {
        // console.log('update');
    },
    watch: {
        data(){
            this.$nextTick(() => {
                for(let item of this.$refs.listGroup){
                    this.itemHeight.push(item.offsetTop)
                }
            })
        },
        scrollY(newY){
            if(newY > 0){
                this.anchorIndex = 0
                return 
            }
            for(let i= 0; i< this.itemHeight.length; i++){
                let h1 = this.itemHeight[i]
                let h2 = this.itemHeight[i+1]
                if(!h2 || (-newY > h1 && -newY < h2)){
                    this.anchorIndex = i
                    this.diff = h2 + newY
                    return
                }
            }
            
        },
        diff(newVal){

        }
    }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
.listview
    position absolute
    height 100%
    width 100%
    overflow hidden
    .list-group-title
        line-height 35px
        color $color-text-l
        background-color $color-highlight-background
        margin-bottom 10px
        text-indent 10px
    .list-group-item
        padding 10px 30px
        .avatar
            width 60px
            height 60px
            border-radius 50%
        .name
            color $color-text-l
            padding-left 15px
    .list-shortcut
        position absolute
        z-index 30
        right 0
        top 50%
        transform translateY(-50%)
        width 20px
        padding 20px 0
        background-color $color-background-d
        border-radius 10px
        text-align center
        .item
            padding 3px
            line-height 1
            color $color-text-l
            &.current
                color $color-theme
</style>
