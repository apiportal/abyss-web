<template>
  <div>
    <EditBusinessApiLifeCycle
      :routePath="`/app/my-apis/businesses/${page}`"
    />
  </div>
</template>

<script>
import EditBusinessApiLifeCycle from '@/components/shared/subjects/apis/EditBusinessApiLifeCycle';

export default {
  components: {
    EditBusinessApiLifeCycle,
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>