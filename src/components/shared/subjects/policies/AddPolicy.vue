<template>
  <div>
    <EditPolicyModal
      v-if="
        isPolicyTypesLoaded
      "
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :policy="getPolicy()"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import EditPolicyModal from '@/components/shared/modals/EditPolicyModal';

export default {
  components: {
    EditPolicyModal,
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
      isPolicyTypesLoaded: state => (state.policyTypes.lastUpdatedAt > 0),
    }),
  },
  data() {
    return {};
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getPolicy() {
      return {
        crudsubjectid: this.currentUser.props.uuid,
        description: '',
        isactive: true,
        name: '',
        organizationid: this.currentUser.props.organizationid,
        policyinstance: {},
        subjectid: this.currentUser.props.uuid,
        typeid: null,
      };
    },
  },
};
</script>