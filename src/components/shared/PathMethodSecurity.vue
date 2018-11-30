<template>
  <div>
    <header>
      SECURITY
    </header>
    <main>
      {{ security }}
    </main>
  </div>
</template>

<script>
export default {
  props: {
    security: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
};
</script>