<template>
  <div>
    <EditUserRoles
      :routePath="`/app/administer-users/users/${page}`"
    />
  </div>
</template>

<script>
import EditUserRoles from '@/components/shared/subjects/users/EditUserRoles';

export default {
  components: {
    EditUserRoles,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>