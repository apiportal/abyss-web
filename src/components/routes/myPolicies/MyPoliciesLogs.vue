<template>
  <SubjectLogs
    title="Logs"
    :routePath="`/app/my-policies/my-policies/${page}`"
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