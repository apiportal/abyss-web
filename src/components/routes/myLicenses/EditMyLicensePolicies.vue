<template>
  <div>
    <EditLicensePolicies
      :routePath="`/app/my-licenses/my-licenses/${page}`"
    />
  </div>
</template>

<script>
import EditLicensePolicies from '@/components/shared/subjects/licenses/EditLicensePolicies';

export default {
  components: {
    EditLicensePolicies,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>