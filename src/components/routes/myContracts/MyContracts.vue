<template>
  <div class="page-container page-my-contracts">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="currentPage.firstChildPath === 'my-contracts'"
        to="/app/my-contracts/my-contracts/1">
          <span class="link-text" data-qa="linkMyAllContacts">My All Contacts</span> <b-badge pill>{{ userContracts.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="currentPage.firstChildPath === 'api-contracts'"
        to="/app/my-contracts/api-contracts/1">
          <span class="link-text" data-qa="linkMyApiContracts">My API Contracts</span> <b-badge pill>{{ userApiContracts.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="currentPage.firstChildPath === 'app-contracts'"
        to="/app/my-contracts/app-contracts/1">
          <span class="link-text" data-qa="linkMyAppContracts">My APP Contracts</span> <b-badge pill>{{ userAppContracts.length }}</b-badge>
        </b-nav-item>
      </b-nav>
    </div>
    <div class="page-content-nested">
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
      currentPage: state => state.currentPage,
      userContracts: state => state.userContracts.items,
      userApiContracts: state => state.userContracts.userApiContracts,
      userAppContracts: state => state.userContracts.userAppContracts,
    }),
  },
  mounted() {
    this.$store.commit('currentPage/setRootPath', 'my-contracts');
    this.$store.dispatch('userContracts/getUserContracts', { uuid: this.currentUser.uuid });
    this.$store.dispatch('userContracts/getUserApiContracts', { uuid: this.currentUser.uuid });
    this.$store.dispatch('userContracts/getUserAppContracts', { uuid: this.currentUser.uuid });
    this.$store.dispatch('contractStates/getContractStates', {});
  },
};
</script>