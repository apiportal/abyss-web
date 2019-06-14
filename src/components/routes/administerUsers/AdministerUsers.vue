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
        <b-nav-item :active="false" to="/app/administer-groups/groups/1">
          <span class="link-text" data-qa="linkGroups">Groups</span> <b-badge pill>{{ computedGroups.length }}</b-badge>
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
      memberships: state => state.subjectMemberships.items,
      userGroupMemberships: state => state.subjectMemberships.userGroup,
    }),
    computedOrganizations() {
      const { subjectOrganizations, currentUser } = this;
      const organizationSubjects = subjectOrganizations
        .filter(item => item.subjectid === currentUser.uuid && !item.isdeleted);
      return organizationSubjects;
    },
    computedGroups() {
      const getUsers = (groupId) => {
        const members = this.memberships.filter(item =>
          !item.isdeleted &&
          item.subjectgroupid === groupId);
        const groupUsers = this.users.filter(el =>
          members.some(f =>
            f.subjectid === el.uuid,
          ),
        );
        return groupUsers;
      };
      const getUserFromGroups = (groupId) => {
        const group = this.userGroupMemberships.find(item => item.subjectgroupid === groupId) || {};
        return group.subjectid || groupId;
      };
      const { groups, currentUser } = this;
      const filteredGroups = groups.filter(item =>
        getUserFromGroups(item.uuid) === currentUser.uuid
        || getUsers(item.uuid).find(i => i.uuid === currentUser.uuid));
      return filteredGroups;
    },
  },
  created() {
    this.$store.commit('currentPage/setRootPath', 'administer-users');
    this.$store.dispatch('subjectOrganizations/getSubjectOrganizations', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('groups/getGroups', {});
    this.$store.dispatch('subjectMemberships/getAllSubjectMemberships', {});
    this.$store.dispatch('subjectMemberships/getUserGroupMemberships', {});
  },
};
</script>
