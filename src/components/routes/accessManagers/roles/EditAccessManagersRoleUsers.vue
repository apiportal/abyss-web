<template>
  <div>
    <EditRoleUsers
      :routePath="`/app/roles/1`"
    />
  </div>
</template>

<script>
  import EditRoleUsers from '@/components/shared/subjects/roles/EditRoleUsers';

  export default {
    components: {
      EditRoleUsers,
    },
    data() {
      return {
        page: this.$route.params.page,
      };
    },
  };
</script>
