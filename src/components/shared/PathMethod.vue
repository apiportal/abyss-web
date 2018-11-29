<template>
  <div :class="`path-method-container path-method-${methodType}`">
    <header>
      <strong>{{ methodType }}</strong>
    </header>
    <main>
      {{ methodProps }}
    </main>
  </div>
</template>

<script>
export default {
  props: {
    methodType: {
      type: String,
      required: true,
      default() { return ''; },
    },
    methodProps: {
      type: Object,
      required: true,
      default() { return {}; },
    },
  },
};
</script>

<style lang="scss">
.path-method-container {
  &.path-method-get {
    background-color: rgba(97, 175, 254, 0.1);
  }
  &.path-method-post {
    background-color: rgba(73, 204, 144, 0.1)
  }
  &.path-method-put {
    background-color: rgba(252, 161, 48, 0.1);
  }
  &.path-method-delete {
    background-color: rgba(249, 62, 62, 0.1);
  }
}
</style>
