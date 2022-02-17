<template>
  <div class="tab-control">
    <div v-for="(item, index) in titles" :key="index" class="titles">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabControl',
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style scoped>
  .tab-control {
    display: flex;
    text-align: center;
  }
  .titles {
    flex: 1;
  }
</style>