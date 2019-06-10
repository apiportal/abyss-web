<template>
  <div>
    <DeleteUser
      :routePath="`/app/administer-groups/groups/${page}`"
    />
  </div>
</template>

<script>
import DeleteUser from '@/components/shared/subjects/users/DeleteUser';

export default {
  components: {
    DeleteUser,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>