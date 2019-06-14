<template>
  <div>
    <EditUser
      :routePath="`/app/administer-groups/groups/${page}`"
    />
  </div>
</template>

<script>
import EditUser from '@/components/shared/subjects/users/EditUser';

export default {
  components: {
    EditUser,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>