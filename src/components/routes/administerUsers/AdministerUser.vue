<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand>{{ user.firstname }}</b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="list-ol" />
              <em>Logs</em>
            </template>
            <b-dropdown-item :to="`/app/administer-users/${page}/logs/${user.uuid}/subject/1`">All</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="cog" />
              <em>Operations</em>
            </template>
            <b-dropdown-item :to="`/app/administer-users/${page}/edit/${user.uuid}`"><Icon icon="edit" /> Edit User</b-dropdown-item>
            <b-dropdown-item :to="`/app/administer-users/${page}/edit-groups/${user.uuid}`"><Icon icon="edit" /> Edit User Groups</b-dropdown-item>
            <b-dropdown-item :to="`/app/administer-users/${page}/delete/${user.uuid}`"><Icon icon="trash-alt" /> Delete User</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;">
      <p>First Name: {{ user.firstname }}</p> 
      <p>Last Name: {{ user.lastname }}</p>
      <p>Display Name: {{ user.displayname }}</p>
      <p>User Name: {{ user.subjectname }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Secondary Email: {{ user.secondaryemail }}</p>
      <p>Description: {{ user.description }}</p>
      <p>Active: {{ user.isactivated }}</p>
      <p>Deleted: {{ user.isdeleted }}</p>
      <p>Locked: {{ user.islocked }}</p>
      <p>Directory: {{ user.directoryname }}</p>
      <p>Organization: {{ user.organizationname }}</p>
      <p>Created: {{ user.created }}</p>
      <p>Updated: {{ user.updated }}</p>
      <p v-if="computedMemberships.length > 0">
        Groups: 
        <span 
          v-for="(membership, index) in computedMemberships"
          v-bind:key="index"
        >
          {{ membership.subjectgroupname }}<span v-if="index < computedMemberships.length - 1">,</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
  },
  props: {
    user: {
      Type: Object,
      required: false,
      default() { return {}; },
    },
    page: {
      Type: Number,
      required: false,
      default() { return 1; },
    },
    groups: {
      Type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {
    computedMemberships() {
      const { memberships, groups } = this;
      return memberships.map((item) => {
        const subjectgroup = groups.find(group => group.uuid === item.subjectgroupid);
        return {
          subjectgroupid: item.subjectgroupid,
          subjectgroupname: subjectgroup ? subjectgroup.displayname : item.subjectgroupid,
        };
      });
    },
  },
  data() {
    return {
      memberships: [],
    };
  },
  mounted() {
    this.getSubjectMemberships();
  },
  methods: {
    getSubjectMemberships() {
      api.getSubjectMemberships(this.user.uuid).then((response) => {
        if (response && response.data) {
          this.memberships = response.data;
        }
        this.isMembershipsLoaded = true;
      });
    },
  },
};
</script>
