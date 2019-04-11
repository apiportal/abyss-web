<template>
  <div>
    <ExploreModal
      v-if="isApisLoaded && isLicensesLoaded"
      :onClose="handleModalClose"
      :hideHeader="true"
      :api="getCardItem(apiId)"
      size="lg"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ExploreModal from '@/components/shared/modals/ExploreModal';

export default {
  components: {
    ExploreModal,
  },
  computed: {
    ...mapState({
      apis: state => state.apis.items,
      isApisLoaded: state => state.apis.lastUpdatedAt > 0,
      licenses: state => state.licenses.items,
      isLicensesLoaded: state => state.licenses.lastUpdatedAt > 0,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push('/app/explore/');
    },
    getCardItem(apiId) {
      return this.apis.find(item => item.uuid === apiId);
    },
  },
  data() {
    return {
      apiId: this.$route.params.apiId,
    };
  },
};
</script>
