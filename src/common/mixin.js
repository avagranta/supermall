import { debounce } from './utils'

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null,
    }
  },
  mounted() {
    // 1. 监听图片加载
    const refresh = debounce(this.$refs.scroll.refresh, 200);

    this.itemImageListener = () => {
      refresh();
    }
    this.$bus.$on('itemImageLoad', this.itemImageListener);
  },
}