<template>
  <AddNewApiModal
    :onClose="handleCloseModal"
    :routePath="`/app/my-apis/${currentPage.firstChildPath}/${page}`"
    size="md"
  />
</template>

<script>
import { mapState } from 'vuex';
import AddNewApiModal from '@/components/shared/modals/AddNewApiModal';

export default {
  components: {
    AddNewApiModal,
  },
  computed: {
    ...mapState({
      currentPage: state => state.currentPage,
    }),
  },
  methods: {
    handleCloseModal() {
      const { firstChildPath } = this.currentPage;
      const { page } = this.$route.params;
      this.$router.push(`/app/my-apis/${firstChildPath}/${page}`);
    },
  },
  data() {
    return {
      page: this.$route.params.page,
    };
  },
};
</script>