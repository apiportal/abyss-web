<template>
  <div>
    Explore
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit('currentPage/setRootPath', 'explore');
  },
};
</script>