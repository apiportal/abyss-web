<template>
  <div>
    <EditUserGroups
      :routePath="`/app/administer-groups/${page}`"
    />
  </div>
</template>

<script>
import EditUserGroups from '@/components/shared/subjects/users/EditUserGroups';

export default {
  components: {
    EditUserGroups,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>