<template>
  <div>
    <EditRolePermissions
      :routePath="`/app/roles/${page}`"
    />
  </div>
</template>

<script>
  import EditRolePermissions from '@/components/shared/subjects/roles/EditRolePermissions';

  export default {
    components: {
      EditRolePermissions,
    },
    data() {
      return {
        page: this.$route.params.page,
      };
    },
  };
</script>
