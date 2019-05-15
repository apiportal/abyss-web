<template>
  <EditApp
    :routePath="`/app/my-apps/my-apps/${page}`"
  />
</template>

<script>
import EditApp from '@/components/shared/subjects/apps/EditApp';

export default {
  components: {
    EditApp,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>