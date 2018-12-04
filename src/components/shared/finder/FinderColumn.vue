<template>
  <div class="finder-column-vue">
    <slot></slot>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss">
.finder-column-vue {
  flex: 200px 0 0;
  border-right: 1px solid silver;
  overflow-y: auto;
}
</style>