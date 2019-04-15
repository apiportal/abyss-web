<template>
  <EditApi
    :routePath="`/app/my-apis/${currentPage.firstChildPath}/${page}`"
  />
</template>

<script>
import { mapState } from 'vuex';
import EditApi from '@/components/shared/subjects/apis/EditApi';

export default {
  components: {
    EditApi,
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