<template>
  <div>
    <header>
      RESPONSES
    </header>
    <main>
      {{ responses }}
    </main>
  </div>
</template>

<script>
export default {
  props: {
    responses: {
      type: Object,
      required: true,
      default() { return {}; },
    },
  },
};
</script>