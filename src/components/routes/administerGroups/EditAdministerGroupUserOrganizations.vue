<template>
  <div>
    <EditUserOrganizations
      :routePath="`/app/administer-groups/${page}`"
    />
  </div>
</template>

<script>
import EditUserOrganizations from '@/components/shared/subjects/users/EditUserOrganizations';

export default {
  components: {
    EditUserOrganizations,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>