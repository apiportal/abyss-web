<template>
  <div class="loading-modal-backdrop">
    <div class="loading-modal">
      <font-awesome-icon :icon="['fa', 'spinner']" spin /> 
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isModalVisible: true,
      isMounted: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="scss">
.loading-modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 9999;
  display: flex;

  .loading-modal {
    display: flex;
    flex: 1 100%;
    flex-direction: column;
    font-size: 3em;
    align-items: center;
    justify-content: center;
  }
}
</style>