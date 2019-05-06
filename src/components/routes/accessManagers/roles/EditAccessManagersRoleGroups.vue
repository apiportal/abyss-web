<template>
  <div>
    <EditRoleGroups
      :routePath="`/app/roles/${page}`"
    />
  </div>
</template>

<script>
  import EditRoleGroups from '@/components/shared/subjects/roles/EditRoleGroups';

  export default {
    components: {
      EditRoleGroups,
    },
    data() {
      return {
        page: this.$route.params.page,
      };
    },
  };
</script>
