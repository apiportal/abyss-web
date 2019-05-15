<template>
  <div>
    <DeletePolicy
      :routePath="`/app/my-policies/my-policies/${page}`"
    />
  </div>
</template>

<script>
import DeletePolicy from '@/components/shared/subjects/policies/DeletePolicy';

export default {
  components: {
    DeletePolicy,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>