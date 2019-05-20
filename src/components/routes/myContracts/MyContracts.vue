<template>
  <div class="page-container page-my-contracts">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="true">
          <span class="link-text" data-qa="linkMyAllContacts">My All Contacts</span> <b-badge pill>{{ userContracts.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="false" to="/app/api-contracts/1">
          <span class="link-text" data-qa="linkMyApiContracts">My API Contracts</span> 
        </b-nav-item>
        <b-nav-item :active="false" to="/app/app-contracts/1">
          <span class="link-text" data-qa="linkMyAppContracts">My APP Contracts</span>
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
      userContracts: state => state.userContracts.items,
      userApiContracts: state => state.userContracts.userApiContracts.items,
      userAppContracts: state => state.userContracts.userAppContracts.items,
      currentUser: state => state.user,
    }),
  },
  mounted() {
    this.$store.dispatch('userContracts/getUserContracts', { uuid: this.currentUser.uuid });
    this.$store.dispatch('userContracts/getUserApiContracts', { uuid: this.currentUser.uuid });
    this.$store.dispatch('userContracts/getUserAppContracts', { uuid: this.currentUser.uuid });
    this.$store.dispatch('contractStates/getContractStates', {});
  },
};
</script>