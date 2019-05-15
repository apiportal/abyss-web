<template>
  <SubjectLogs
    title="Logs"
    :routePath="`/app/organizations/${page}`"
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