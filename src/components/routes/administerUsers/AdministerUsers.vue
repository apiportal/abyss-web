<template>
  <div class="page-container page-users">
    
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="true">
          <span class="link-text" data-qa="linkUsers">Users</span> <b-badge pill>{{ users.length }}</b-badge>
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
      isLoading: state => state.traffic.isLoading,
      // subjectDirectories: state => state.subjectDirectories.items,
      // subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      // organizations: state => state.organizations.items,
      users: state => state.users.items,
      // groups: state => state.groups.items,
    }),
  },
  created() {
    this.$store.commit('currentPage/setRootPath', 'administer-users');
    // this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    // this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes', {});
    // this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('users/getUsers', {});
    // this.$store.dispatch('groups/getGroups', {});
  },
};
</script>
