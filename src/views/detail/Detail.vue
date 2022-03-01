<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick"
                    ref="nav"></detail-nav-bar>
    <scroll class="content" 
            ref="scroll" 
            @scroll="contentScroll"
            :probe-type="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detailInfo="detailInfo"
                         @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :paramInfo="goodsParam"
                         ref="params"></detail-param-info>
      <detail-comment-info :commentInfo="commentInfo"
                           ref="comment"></detail-comment-info>
      <goods-list :goods="recommends"
                   ref="recommend"></goods-list>
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
import GoodsList from 'components/content/goods/GoodsList'

import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
import { itemListenerMixin } from 'common/mixin'

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
    GoodsList,
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
      recommends: [],
      themeTopYs: [],
      currentIndex: 0,
    }
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();

      this.themeTopYs = []; 
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Infinity);
    },
    titleClick(index) {
      let y = this.themeTopYs[index] === 0 ? 0 : -(this.themeTopYs[index])
      this.$refs.scroll.scrollTo(0, y, 50)
    },
    contentScroll(position) {
      const positionY = -position.y;
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        if (this.currentIndex !== i && positionY >= this.themeTopYs[i] && positionY <= this.themeTopYs[i+1]) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
    }
  },
  mixins: [itemListenerMixin],
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

    // 3. 获取推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list;
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
    position: relative;
    height: calc(100% - 44px);
  }
</style>