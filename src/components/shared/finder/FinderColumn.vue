<template>
  <div class="finder-column-container zebra">
    <slot></slot>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss">
.finder-column-container {
  flex: 250px 0 0;
  border-right: 1px solid silver;
  overflow-y: auto;

  &.zebra {
    background: repeating-linear-gradient(
      to bottom,
      #fff,
      transparent 40px,
      #f8f8f8 40px,
      #f8f8f8 80px);
      background-position: 0% 0%;
  }
}
</style>