import _ from './learnUnderscore'

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null,
    }
  },
  mounted() {
    // 1. 监听图片加载
    const refresh = _.debounce(this.$refs.scroll.refresh, 200);

    this.itemImageListener = () => {
      refresh();
    }
    this.$bus.$on('itemImageLoad', this.itemImageListener);
  },
}

export const backToTop = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTop(position) {
      
      if (-position.y > 1000) {
        this.isShowBackTop = true;
      } else {
        this.isShowBackTop = false;
      }
    },
    backClick(){
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
  }
}