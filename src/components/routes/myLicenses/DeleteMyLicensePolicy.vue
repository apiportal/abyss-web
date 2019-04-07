<template>
  <div>
    <DeletePolicy
      :routePath="`/app/my-licenses/my-licenses/${page}`"
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