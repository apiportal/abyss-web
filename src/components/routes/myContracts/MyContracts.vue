<template>
  <div class="page-container page-my-contracts">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="true">
          <span class="link-text" data-qa="linkMyAllContacts">My All Contacts</span>
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
      contracts: state => state.contracts.items,
    }),
  },
  mounted() {
    this.$store.dispatch('contracts/getAllContracts', {});
    this.$store.dispatch('contractStates/getContractStates', {});
  },
};
</script>