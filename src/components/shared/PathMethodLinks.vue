<template>
  <div>
    <header>
      LINKS
    </header>
    <main>
      {{ links }}
    </main>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Object,
      required: false,
      default() { return {}; },
    },
  },
};
</script>