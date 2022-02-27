<template>
  <swiper>
    <swiper-item v-for="(item, index) in banners" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from 'components/common/swiper/index'

export default {
  name: 'HomeSwiper',
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    Swiper, 
    SwiperItem
  },
  data() {
    return {
      isLoad: false,
    }
  },
  methods: {
    imageLoad() {
      if (!this.isLoad) {
        this.isLoad = true;
        this.$emit('swiperImageLoad');
      }
    }
  }
}
</script>

<style>

</style>