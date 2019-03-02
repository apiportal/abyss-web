<template>
  <div class="my-licenses-container">
    <div class="my-licenses-header silver-bg">
      <b-nav tabs>
        <b-nav-item active>
          My Policies <b-badge variant="light">{{ policies.length }}</b-badge>
        </b-nav-item>
      </b-nav>
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
      policies: state => state.policies.items,
    }),
  },
  mounted() {
    this.$store.commit('currentPage/setRootPath', 'my-policies');
    this.$store.dispatch('policies/getPolicies', this.currentUser.uuid);
    this.$store.dispatch('policyTypes/getPolicyTypes');
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