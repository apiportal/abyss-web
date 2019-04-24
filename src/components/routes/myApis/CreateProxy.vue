<template>
  <div>
    <CreateProxy
      :routePath="`/app/my-apis/${currentPage.firstChildPath}/${page}`"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CreateProxy from '@/components/shared/subjects/apis/CreateProxy';

export default {
  components: {
    CreateProxy,
  },
  computed: {
    ...mapState({
      currentPage: state => state.currentPage,
    }),
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>