<template>
  <div>
    <EditOrganizationUsers
      :routePath="`/app/organizations/${page}`"
    />
  </div>
</template>

<script>
import EditOrganizationUsers from '@/components/shared/subjects/users/EditOrganizationUsers';

export default {
  components: {
    EditOrganizationUsers,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>