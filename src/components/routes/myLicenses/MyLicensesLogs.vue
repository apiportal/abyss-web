<template>
  <SubjectLogs
    title="Logs"
    :routePath="`/app/my-licenses/my-licenses/${page}`"
  />
</template>

<script>
import SubjectLogs from '@/components/shared/SubjectLogs';

export default {
  components: {
    SubjectLogs,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>