<template>
  <div>
    <EditApiModal
      v-if="isApisLoaded"
      role="edit"
      :api="getApi()"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditApiModal from '@/components/shared/modals/EditApiModal';

export default {
  components: {
    EditApiModal,
  },
  props: {
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      apis: state => state.apis.items,
      isApisLoaded: state => state.apis.lastUpdatedAt > 0,
    }),
  },
  data() {
    return {
      apiId: this.$route.params.apiId,
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getApi() {
      return this.apis.find(item => item.uuid === this.apiId);
    },
  },
};
</script>
