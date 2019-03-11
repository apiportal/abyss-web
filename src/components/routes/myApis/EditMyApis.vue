<template>
  <EditApi
    :routePath="`/app/my-apis/businesses/${page}`"
  />
</template>

<script>
import EditApi from '@/components/shared/subjects/apis/EditApi';

export default {
  components: {
    EditApi,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>