<template>
  <div class="page-container page-users">
    
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="false" to="/app/organizations/1">
          <span class="link-text" data-qa="linkOrganizations">Organizations</span> <b-badge pill>{{ computedOrganizations.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="true">
          <span class="link-text" data-qa="linkUsers">Users</span> <b-badge pill>{{ users.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="false" to="/app/administer-groups/1">
          <span class="link-text" data-qa="linkGroups">Groups</span> <b-badge pill>{{ groups.length }}</b-badge>
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
      subjectOrganizations: state => state.subjectOrganizations.items,
      users: state => state.users.items,
      groups: state => state.groups.items,
    }),
    computedOrganizations() {
      const { subjectOrganizations, currentUser } = this;
      const organizationSubjects = subjectOrganizations
        .filter(item => item.subjectid === currentUser.uuid);
      return organizationSubjects;
    },
  },
  created() {
    // this.$store.commit('currentPage/setRootPath', 'administer-users');
    // this.$store.dispatch('subjectOrganizations/getSubjectOrganizations', {});
    // this.$store.dispatch('users/getUsers', {});
    // this.$store.dispatch('groups/getGroups', {});
  },
};
</script>
