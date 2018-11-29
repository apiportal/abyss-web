<template>
  <div v-if="isRolled" class="rollable-widget-container" :style="`flex: ${rolledWidth} 0 0;`">
    <main>
      <div class="rotated-title-container" @click="handleToggle">
        <div class="rotated-title">{{ title }}</div>
      </div>
    </main>
  </div>
  <div v-else class="rollable-widget-container" :style="`flex: ${unrolledWidth} 0 0;`">
    <header @click="handleToggle">
      {{ title }}
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default() { return ''; },
    },
    rolledWidth: {
      type: String,
      required: false,
      default() { return '45px'; },
    },
    unrolledWidth: {
      type: String,
      required: false,
      default() { return '290px'; },
    },
    isRolled: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    onToggle: {
      type: Function,
      required: false,
      default() { return false; },
    },
  },
  methods: {
    handleToggle() {
      this.onToggle();
    },
  },
};
</script>

<style lang="scss" scoped>
.rollable-widget-container {
  border: 1px solid silver;
  display: flex;
  flex-direction: column;

  .rotated-title-container {
    white-space: nowrap;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .rotated-title {
      position: absolute;
      top: 175px;
      left: -130px;
      width: 300px;
      text-align: right;
      -webkit-transform: rotate(-90deg);
      -moz-transform: rotate(-90deg);
      -o-transform: rotate(-90deg);
      -ms-transform: rotate(-90deg);
      transform: rotate(-90deg);
    }
  }

  header {
    border-bottom: 1px solid silver;
    flex: 30px 0 0;
  }

  main {
    flex: 1 0 0;
    position: relative;
    overflow-y: auto;
  }
}
</style>
