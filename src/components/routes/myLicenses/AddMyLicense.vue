<template>
  <div>
    <AddLicense
      :routePath="`/app/my-licenses/my-licenses/${page}`"
    />
  </div>
</template>

<script>
import AddLicense from '@/components/shared/subjects/licenses/AddLicense';

export default {
  components: {
    AddLicense,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>