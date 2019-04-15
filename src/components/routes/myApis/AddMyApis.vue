<template>
  <AddNewApiModal
    :onClose="handleCloseModal"
  />
</template>

<script>
import AddNewApiModal from '@/components/shared/modals/AddNewApiModal';

export default {
  components: {
    AddNewApiModal,
  },
  methods: {
    handleCloseModal() {
      this.$router.push('/app/my-apis/businesses/1');
    },
  },
};
</script>