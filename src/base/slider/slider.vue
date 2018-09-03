<template>
    <div class="slider">
        <swiper :options="swiperOption">
            <swiper-slide v-for="(item,index) in slideList" :key="index">
                <a :href="item.linkUrl">
                    <img :src="item.picUrl" alt="">
                </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script type="text/ecmascript-6">
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    data() {
        return {
            swiperOption: {
                pagination: {
                    el: '.swiper-pagination',
                    bulletClass: 'my-bullet',
                    bulletActiveClass: 'my-ActiveBullet'
                }
            }
        };
    },
    props:{
        slideList: {
            type: Array
        }
    },
    components: {
        swiper,
        swiperSlide
    }
};
</script>

<style lang="stylus">
.my-bullet
    display inline-block
    width 5px
    height 5px
    background-color #fff
    margin 0 4px
    border-radius 50%
    opacity 0.5
    &.my-ActiveBullet
        opacity 1
        width 10px
        border-radius 3px
</style>
