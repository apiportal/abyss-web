<template>
  <div class="my-licenses-container">
    <div class="my-licenses-header">
      <b-button variant="primary">
        My Licenses <b-badge variant="light">{{ subjectLicenses.length }}</b-badge>
      </b-button>
    </div>
    <div class="my-licenses-content">
      <router-view></router-view>
    </div>
  </div> 
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      currentUser: state => state.user,
      subjectLicenses: state => state.subjectLicenses.items,
    }),
  },
  mounted() {
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
    this.$store.dispatch('policies/getPolicies', this.currentUser.uuid);
  },
};
</script>

<style lang="scss" scoped>
.my-licenses-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .my-licenses-header {
    flex: 50px 0 0;
    padding: 1rem 1rem 0 1rem;
  }

  .my-licenses-content {
    flex: 1 0 0;
    display: flex;
  }
}
</style>