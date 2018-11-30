<template>
  <div>
    <header>
      REQUESTBODY
    </header>
    <main>
      {{ requestBody }}
    </main>
  </div>
</template>

<script>
export default {
  props: {
    requestBody: {
      type: Object,
      required: false,
      default() { return {}; },
    },
  },
};
</script>