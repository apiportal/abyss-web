<template>
  <div>
    <header>
      PARAMETERS
    </header>
    <main>
      {{ parameters }}
    </main>
  </div>
</template>

<script>
export default {
  props: {
    parameters: {
      type: Object,
      required: false,
      default() { return {}; },
    },
  },
};
</script>