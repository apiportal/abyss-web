<template>
  <div>
    <ConfirmModal
      v-if="areAppsLoaded"
      title="Are you sure?"
      :text="`${app.subjectname} will be deleted. You can't revert your action.`"
      :onClose="handleModalClose"
      :onConfirm="handleModalConfirm"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import ConfirmModal from '@/components/shared/modals/ConfirmModal';

export default {
  components: {
    ConfirmModal,
  },
  props: {
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  methods: {
    ...mapActions('apps', ['deleteApps']),
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalConfirm() {
      const { deleteApps, app } = this;
      deleteApps({ ...app }).then(() => {
        this.$router.push(this.routePath);
      });
    },
  },
  computed: {
    ...mapState({
      apps: state => state.apps.items,
      areAppsLoaded: state => state.apps.lastUpdatedAt,
    }),
    app() {
      const { appId, apps } = this;
      return apps.find(item => item.uuid === appId);
    },
  },
  data() {
    return {
      appId: this.$route.params.appId,
    };
  },
};
</script>