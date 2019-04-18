<template>
  <AddNewApiModal
    :onClose="handleCloseModal"
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
};
</script>