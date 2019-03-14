<template>
  <div>
    <DeleteApp
      :routePath="`/app/my-apps/my-apps/${page}`"
    />
  </div>
</template>

<script>
import DeleteApp from '@/components/shared/subjects/apps/DeleteApp';

export default {
  components: {
    DeleteApp,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>