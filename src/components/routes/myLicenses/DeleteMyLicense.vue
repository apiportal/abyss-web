<template>
  <div>
    <DeleteLicense
      :routePath="`/app/my-licenses/my-licenses/${page}`"
    />
  </div>
</template>

<script>
import DeleteLicense from '@/components/shared/subjects/licenses/DeleteLicense';

export default {
  components: {
    DeleteLicense,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>