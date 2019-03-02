<template>
  <div>
    <AddApp
      :routePath="`/app/my-apps/my-apps/${page}`"
    />
  </div>
</template>

<script>
import AddApp from '@/components/shared/subjects/apps/AddApp';

export default {
  components: {
    AddApp,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>