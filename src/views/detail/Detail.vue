<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detailInfo="detailInfo"
                         @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :paramInfo="goodsParam"></detail-param-info>
      <detail-comment-info :commentInfo="commentInfo"></detail-comment-info>
    </scroll>
  </div>
</template>

<script>

import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'

import Scroll from 'components/common/scroll/Scroll'

import { getDetail, Goods, Shop, GoodsParam } from 'network/detail'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      goodsParam: {},
      commentInfo: {},
    }
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
    }
  },
  created() {
    // 1. 保存存入的iid
    this.iid = this.$route.params.iid;

    // 2. 获取detail数据
    getDetail(this.iid).then(res => {
      const data = res.result;
      // 1. 获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages;

      // 2. 获取商品基本信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

      // 3. 创建店铺信息
      this.shop = new Shop(data.shopInfo);

      // 4. 获取商品详细信息
      this.detailInfo = data.detailInfo;

      // 5. 获取参数信息
      this.goodsParam = new GoodsParam(data.itemParams.info, data.itemParams.rule);

      // 6. 获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    })
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    height: 100vh;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>