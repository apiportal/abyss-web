<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-auto">
        <dt class="bg-cover mb-2 bg-secondary embed-responsive embed-responsive-1by1 img-thumbnail" style="width: 200px;" :style="{ 'background-image': 'url(' + organization.picture + ')' }"></dt>
      </dl>
      <dl class="col">
        <dt>Organization Name:</dt>
        <dd>{{ organization.name }}</dd>
        <dt>Description:</dt>
        <dd>{{ organization.description }}</dd>
      </dl>
      <dl class="col">
        <dt>Parent Organization:</dt>
        <dd>{{ organization.organizationname }}</dd>
        <dt>Url:</dt>
        <dd>{{ organization.url }}</dd>
      </dl>
      <dl class="col-2">
        <dt>Users:</dt>
        <dd>{{ organization.organizationusers ? organization.organizationusers.length : 0 }}</dd>
        <dt>APPs:</dt>
        <dd>{{ organizationApps.length }}</dd>
        <dt>APIs:</dt>
        <dd>{{ organizationApis.length }}</dd>
      </dl>
      <dl class="col-3">
        <dt>Created:</dt>
        <dd>{{ organization.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="!organization.isdeleted">Updated:</dt>
        <dd v-if="!organization.isdeleted">{{ organization.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="organization.isdeleted">Deleted:</dt>
        <dd v-if="organization.isdeleted">{{ organization.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
      </dl>
    </div>

    <div class="row abyss-table-buttons" v-if="organization.isorganizationowner">
      <b-button
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Organization Users"
        @click="listOrganizationUsers"
        :class="{'active': isShowOrganizationUsers}"
        v-if="organization.organizationusers && organization.organizationusers.length"
        :id="`IDOrganizationUsersButton_${organization.uuid}`"
      >
        <Icon icon="users" />
        <span class="btn-text">Users</span>
        <b-badge pill>{{ organization.organizationusers ? organization.organizationusers.length : 0 }}</b-badge>
      </b-button>

      <b-button
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Sub Organizations"
        @click="showSubOrganizations"
        :class="{'active': isShowSubOrganizations}"
        v-if="organization.suborganizations && (organization.suborganizations.length > 0)"
        :id="`IDOrganizationSubOrganizationsButton_${organization.uuid}`"
      >
        <Icon icon="list-ol" />
        <span class="btn-text">Sub Organizations</span>
        <b-badge pill>{{ organization.suborganizations.length }}</b-badge>
      </b-button>
    </div>
    <div v-if="isShowOrganizationUsers && organizationUsers.length">
      <Users
        :rows="organizationUsers"
        :routePath="routePath"
      />
    </div>
    <div
      v-if="isShowSubOrganizations"
    >
      <Organizations
        :rows="subOrganizations"
        :organizations="organizations"
        :routePath="routePath"
      />
    </div>
    <!-- <pre>{{subOrganizations}}</pre> -->
    <!-- <pre>{{organization.organizationusers}}</pre> -->

  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';
import Users from '@/components/shared/subjects/users/Users';

export default {
  props: {
    organizations: {
      type: Array,
      required: false,
      default() { return []; },
    },
    rows: {
      type: Array,
      required: false,
      default() { return []; },
    },
    organization: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  components: {
    Icon,
    Users,
    Organizations: () => import('@/components/shared/subjects/organizations/Organizations'),
  },
  computed: {
    ...mapState({
      // groups: state => state.groups.items,
      users: state => state.users.items,
      apps: state => state.apps.items,
      apis: state => state.apis.items,
      // organizations: state => state.organizations.items,
      subjectOrganizations: state => state.subjectOrganizations.items,
    }),
    // organizationGroups() {
    //   const { groups, organization } = this;
    //   return groups.filter(item => item.organizationid === organization.uuid);
    // },
    organizationApps() {
      // const { apps, organization } = this;
      // return apps.filter(item => item.organizationid === organization.uuid);
      return 0;
    },
    organizationApis() {
      // const { apis, organization } = this;
      // return apis.filter(item => item.organizationid === organization.uuid);
      return 0;
    },
    organizationSubjects() {
      const { organization, subjectOrganizations } = this;
      const organizationSubjects = subjectOrganizations.filter(item =>
          // !item.isdeleted &&
          item.organizationrefid === organization.uuid);
      return organizationSubjects;
    },
    subOrganizations() {
      const { organization, organizations } = this;
      const subOrganizations = organizations.filter(item =>
        item.uuid !== item.organizationid &&
        item.organizationid === organization.uuid,
      );
      return subOrganizations;
    },
    organizationUsers() {
      // const { users, organizationSubjects } = this;
      const { users, organization } = this;
      const organizationUsers = users.filter(user =>
        // organizationSubjects.some(f =>
        organization.organizationusers.some(f =>
          f.subjectid === user.uuid,
        ),
      );
      return organizationUsers;
    },
  },
  data() {
    return {
      isShowOrganizationUsers: false,
      isShowSubOrganizations: false,
    };
  },
  methods: {
    // getUsersOfOrganizations() {
    //   api.getUsersOfOrganizations(this.organization.uuid).then((response) => {
    //     if (!this.organizationSubjects.length) {
    //       this.organizationSubjects = response.data.filter(item => !item.isdeleted);
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.status === 404) {
    //       this.organizationSubjects = [];
    //     }
    //   });
    // },
    listOrganizationUsers() {
      this.isShowOrganizationUsers = !this.isShowOrganizationUsers;
      if (this.isShowOrganizationUsers) {
        this.isShowSubOrganizations = false;
      }
    },
    showSubOrganizations() {
      this.isShowSubOrganizations = !this.isShowSubOrganizations;
      if (this.isShowSubOrganizations) {
        this.isShowOrganizationUsers = false;
      }
    },
    handleSortByClick({ sortByKey, sortByKeyType, sortDirection }) {
      this.sortByKey = sortByKey;
      this.sortByKeyType = sortByKeyType;
      this.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>
