<template>
  <div>
    <AddPolicy
      :routePath="`/app/my-policies/my-policies/${page}`"
    />
  </div>
</template>

<script>
import AddPolicy from '@/components/shared/subjects/policies/AddPolicy';

export default {
  components: {
    AddPolicy,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>