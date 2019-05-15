<template>
  <div>
    <EditApiLicenses
      :routePath="`/app/my-apis/my-proxy-apis/${page}`"
    />
  </div>
</template>

<script>
import EditApiLicenses from '@/components/shared/subjects/apis/EditApiLicenses';

export default {
  components: {
    EditApiLicenses,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>