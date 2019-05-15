<template>
  <div>
    <EditGroupUsers
      :routePath="`/app/administer-groups/${page}`"
    />
  </div>
</template>

<script>
import EditGroupUsers from '@/components/shared/subjects/users/EditGroupUsers';

export default {
  components: {
    EditGroupUsers,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>