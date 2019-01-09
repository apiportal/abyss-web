<template>
  <div>
    <div>
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
    <div>
      <b-dropdown variant="secondary" size="sm">
        <template slot="button-content">
          <Icon icon="list-ol" />
          <span>Logs</span>
        </template>
        <b-dropdown-item :to="`/app/administer-users/${page}/logs/${user.uuid}/all/1`">All</b-dropdown-item>
      </b-dropdown>
      <b-button
        :to="`/app/administer-users/${page}/edit/${user.uuid}`"
        size="sm"
        variant="secondary"
        v-b-tooltip.hover
        title="Edit"
      >
        <Icon icon="edit" />
        <span>Edit User</span>
      </b-button>
      <b-button
        :to="`/app/administer-users/${page}/edit-groups/${user.uuid}`"
        size="sm"
        variant="secondary"
        v-b-tooltip.hover
        title="Edit Groups"
      >
        <Icon icon="users-cog" />
        <span>Edit User Groups</span>
      </b-button>
      <b-button
        :to="`/app/administer-users/${page}/delete/${user.uuid}`"
        size="sm"
        variant="danger"
        v-b-tooltip.hover
        title="Delete"
        :disabled="user.isdeleted"
      >
        <Icon icon="trash-alt" />
        <span>Delete</span>
      </b-button>
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
