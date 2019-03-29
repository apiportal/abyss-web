<template>
  <div>
    <EditPolicy
      :routePath="`/app/my-licenses/my-licenses/${page}`"
    />
  </div>
</template>

<script>
import EditPolicy from '@/components/shared/subjects/policies/EditPolicy';

export default {
  components: {
    EditPolicy,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>