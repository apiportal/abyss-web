<template>
  <div>
    <p><strong>Title:</strong> {{ item.name }}</p>
    <p><strong>Description:</strong> {{ item.description }}</p>
    <p><strong>Policy Instance:</strong> {{ item.policyinstance }}</p>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>