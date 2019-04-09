<template>
  <div>
    <ExploreModal
      v-if="isProxiesLoaded"
      :onClose="handleModalClose"
      :hideHeader="true"
      :cardItem="getCardItem(apiId)"
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
      proxies: state => state.proxies.items,
      isProxiesLoaded: state => state.proxies.lastUpdatedAt > 0,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push('/app/explore/');
    },
    getCardItem(apiId) {
      return this.proxies.find(item => item.uuid === apiId);
    },
  },
  data() {
    return {
      apiId: this.$route.params.apiId,
    };
  },
};
</script>
