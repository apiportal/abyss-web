<template>
  <div>
    <EditLicense
      :routePath="`/app/my-apis/businesses/${page}`"
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