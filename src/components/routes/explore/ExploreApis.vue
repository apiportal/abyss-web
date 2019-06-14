<template>
  <div>
    <ExploreModal
      v-if="isApisLoaded"
      :onClose="handleModalClose"
      :hideFooter="true"
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
      currentUser: state => state.user,
      apis: state => state.exploreApis.items,
      isApisLoaded: state => state.exploreApis.lastUpdatedAt > 0,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push('/app/explore/');
      this.$store.commit('licenses/setLicenseId', null);
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
