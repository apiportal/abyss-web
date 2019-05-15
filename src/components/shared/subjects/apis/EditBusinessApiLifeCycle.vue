<template>
  <div>
    <EditBusinessApiLifeCycleModal
      :businessApi="businessApis.find(item => item.uuid === businessApiId)"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditBusinessApiLifeCycleModal from '@/components/shared/modals/EditBusinessApiLifeCycleModal';

export default {
  components: {
    EditBusinessApiLifeCycleModal,
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
      currentUser: state => state.user,
      businessApis: state => state.businessApis.items,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
      this.$store.commit('businessApis/setNextStateId', null);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
      this.$store.commit('businessApis/setNextStateId', null);
    },
  },
  data() {
    return {
      businessApiId: this.$route.params.apiId,
      page: this.$route.params.page,
    };
  },
};
</script>