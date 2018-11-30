<template>
  <div>
    <header>
      CALLBACKS
    </header>
    <main>
      {{ callbacks }}
    </main>
  </div>
</template>

<script>
export default {
  props: {
    callbacks: {
      type: Object,
      required: false,
      default() { return {}; },
    },
  },
};
</script>