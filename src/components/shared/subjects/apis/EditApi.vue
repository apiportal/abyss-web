<template>
  <div>
    <EditApiModal
      v-if="isBusinessApisLoaded"
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
      businessApis: state => state.businessApis.items,
      isBusinessApisLoaded: state => state.businessApis.lastUpdatedAt > 0,
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
      return this.businessApis.find(item => item.uuid === this.apiId);
    },
  },
};
</script>
