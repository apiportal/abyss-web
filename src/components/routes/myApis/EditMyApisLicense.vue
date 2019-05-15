<template>
  <div>
    <EditLicense
      :routePath="`/app/my-apis/my-proxy-apis/${page}`"
    />
  </div>
</template>

<script>
import EditLicense from '@/components/shared/subjects/licenses/EditLicense';

export default {
  components: {
    EditLicense,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>