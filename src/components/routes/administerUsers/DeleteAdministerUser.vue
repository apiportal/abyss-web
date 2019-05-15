<template>
  <div>
    <DeleteUser
      :routePath="`/app/administer-users/users/${page}`"
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