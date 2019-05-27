<template>
  <div>
    <EditApiLifeCycle
      :routePath="`/app/my-apis/my-proxy-apis/${page}`"
    />
  </div>
</template>

<script>
import EditApiLifeCycle from '@/components/shared/subjects/apis/EditApiLifeCycle';

export default {
  components: {
    EditApiLifeCycle,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>