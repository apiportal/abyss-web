<template>
  <div>
    <EditApiLifeCycleModal
      :proxy="proxies.find(item => item.uuid === proxyId)"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditApiLifeCycleModal from '@/components/shared/modals/EditApiLifeCycleModal';

export default {
  components: {
    EditApiLifeCycleModal,
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
      proxies: state => state.proxies.items,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
      this.$store.commit('proxies/setNextStateId', null);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
  },
  data() {
    return {
      proxyId: this.$route.params.apiId,
      page: this.$route.params.page,
    };
  },
  mounted() {
    // this.$store.dispatch(', {  });
    // this.$store.dispatch('', {});
  },
};

</script>