<template>
  <div>
    <EditApiLicensesModal
      v-if="
        isApiLicensesLoaded &&
        isProxiesLoaded &&
        isApiLicensesLoaded
        "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :proxy="proxies.find(item => item.uuid === proxyId)"
      :licenses="licenses"
      :apiLicenses="apiLicenses"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditApiLicensesModal from '@/components/shared/modals/EditApiLicensesModal';

export default {
  components: {
    EditApiLicensesModal,
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
      licenses: state => state.subjectLicenses.items,
      apiLicenses: state => state.apiLicenses.items,
      proxies: state => state.proxies.items,
      isLicensesLoaded: state => state.licenses.lastUpdatedAt,
      isApiLicensesLoaded: state => state.apiLicenses.lastUpdatedAt,
      isProxiesLoaded: state => state.proxies.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
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
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
    this.$store.dispatch('apiLicenses/getApiLicensesRefs', {});
  },
};
</script>