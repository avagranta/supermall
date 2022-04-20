<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template v-slot:center>购物街</template>
    </nav-bar>
    <tab-control
    :titles="['流行','新款','精选']"
    @tabClick='tabClick'
    ref="tabControl1"
    class="tab-control"
    v-show="isTabFixed"></tab-control>
    <scroll class="content" 
    ref="scroll"
    :probe-type="3"
    :pull-up-load="true"
    @scroll="contentScroll"
    @pullingUp="loadMore">
      <home-swiper :banners='banners'
      @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends='recommends'></recommend-view>
      <feature-view></feature-view>
      <tab-control
      :titles="['流行','新款','精选']"
      @tabClick='tabClick'
      ref="tabControl2"
      ></tab-control>
      <goods-list :goods='showGoods'></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>

  import HomeSwiper from './childComps/HomeSwiper.vue';
  import RecommendView from './childComps/RecommendView.vue'
  import FeatureView from './childComps/FeatureView.vue'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl.vue'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import { getHomeMultidata, getHomeGoods} from 'network/home';
  import { itemListenerMixin, backToTop } from 'common/mixin'


  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1. 请求多个数据
      this.getHomeMultidata();

      // 2. 请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    mixins: [itemListenerMixin, backToTop],
    activated() {
      this.$refs.scroll.refresh();
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY();
      this.$bus.$off('itemImgLoad', this.itemImageListener);
    },
    methods: {
      // 事件监听相关部分
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell'
            break;
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },

    
      contentScroll(position) {
        // 1. 判断backtop是否显示
        this.backTop(position);
        // 2.决定tabControl是否吸顶
        if (-position.y > this.tabOffsetTop) {
          this.isTabFixed = true;
        } else {
          this.isTabFixed = false;
        }
      },

      loadMore() {
        this.getHomeGoods(this.currentType)
      },

      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },

      // 网络请求相关部分
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page++;
          this.$refs.scroll.finishPullUp();
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    position: relative;
    height: 100vh;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
  }
  
  .content {
    position: absolute;
    height: calc(100% - 93px);
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  .tab-control {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>

