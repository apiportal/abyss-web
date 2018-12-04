<template>
  <div class="finder-layout-container">
    <header>
      {{ name }} {{ path.join(' &raquo; ') }}
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: false,
      default() { return ''; },
    },
    path: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.finder-layout-container {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;

  header {
    border-bottom: 1px solid silver;
    flex: 30px 0 0;
  }

  main {
    flex: 1 0 0;
    display: flex;
    flex-direction: row;
    overflow-y: auto;
  }
}
</style>
