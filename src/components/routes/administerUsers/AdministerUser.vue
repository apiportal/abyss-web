<template>
  <div>
    <div class="row">
      <dl class="px-3">
        <dt class="bg-cover mb-2 bg-secondary rounded-circle embed-responsive embed-responsive-1by1" style="width: 150px;" :style="{ 'background-image': 'url(' + user.picture + ')' }"></dt>
      </dl>
      <dl class="col">
        <dt>First Name:</dt>
        <dd>{{ user.firstname }}</dd>
        <dt>Last Name:</dt>
        <dd>{{ user.lastname }}</dd>
        <dt>User Name:</dt>
        <dd>{{ user.subjectname }}</dd>
        <dt>Display Name:</dt>
        <dd>{{ user.displayname }}</dd>
      </dl>
      <dl class="col">
        <dt>Organization:</dt>
        <dd>{{ user.organizationname }}</dd>
        <dt>Directory:</dt>
        <dd>{{ user.directoryname }}</dd>
        <dt>Description:</dt>
        <dd>{{ user.description }}</dd>
        <dt>Groups:</dt>
        <dd v-if="computedMemberships.length > 0">
          Groups: 
          <span 
            v-for="(membership, index) in computedMemberships"
            v-bind:key="index"
          >
            {{ membership.subjectgroupname }}<span v-if="index < computedMemberships.length - 1">,</span>
          </span>
        </dd>
      </dl>
     
      <dl class="col">
        <dt>Email:</dt>
        <dd>{{ user.email }}</dd>
        <dt>Secondary Email:</dt>
        <dd>{{ user.secondaryemail }}</dd>
        <dt>uuid:</dt>
        <dd><code>{{ user.uuid }}</code></dd>
      </dl>
      
      <dl class="col-1">
        <dt>Active:</dt>
        <dd>{{ user.isactivated }}</dd>
        <dt>Deleted:</dt>
        <dd>{{ user.isdeleted }}</dd>
        <dt>Locked:</dt>
        <dd>{{ user.islocked }}</dd>
      </dl>
      
      <dl class="col">
        <dt>Created:</dt>
        <dd>{{ user.created }}</dd>
        <dt>Updated:</dt>
        <dd>{{ user.updated }}</dd>
        <dt>Deleted:</dt>
        <dd>{{ user.deleted }}</dd>
      </dl>
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
