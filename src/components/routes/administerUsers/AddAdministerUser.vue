<template>
  <div>
    <AddUser
      :routePath="`/app/administer-users/users/${page}`"
    />
  </div>
</template>

<script>
import AddUser from '@/components/shared/subjects/users/AddUser';

export default {
  components: {
    AddUser,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>