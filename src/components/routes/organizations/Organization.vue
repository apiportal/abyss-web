<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col">
        <dt>Name:</dt>
        <dd>{{ organization.name }}</dd>
        <dt>Parent Organization:</dt>
        <dd>{{ organization.organizationname }}</dd>
      </dl>
      <dl class="col">
        <dt>Url:</dt>
        <dd>{{ organization.url }}</dd>
        <dt>Description:</dt>
        <dd>{{ organization.description }}</dd>
      </dl>
      <dl class="col-1">
        <dt>Users:</dt>
        <dd>{{ organizationUsers.length }}</dd>
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
    <div class="row abyss-table-buttons">
      <b-button
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Users"
        @click="listOrganizationUsers"
        :class="{'active': isShowOrganizationUsers}"
        v-if="organizationUsers.length"
      >
        <Icon icon="users" /> Users
        <b-badge pill>{{ organizationUsers.length }}</b-badge>
      </b-button>
      <b-button
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Sub Organizations"
        @click="showSubOrganizations"
        :class="{'active': isShowSubOrganizations}"
        v-if="organization.suborganizations > 0"
      >
        <Icon icon="list-ol" /> Sub Organizations
        <b-badge pill>{{ organization.suborganizations }}</b-badge>
      </b-button>
    </div>
    <div v-if="isShowOrganizationUsers && organizationUsers.length">
      <Users
        :users="organizationUsers"
        path="organizations"
        title="Organization"
        :page="page"
      />
    </div>
  
    <div class="abyss-table-content" v-if="organization.suborganizations > 0 && organization.uuid !== rootorganization && isShowSubOrganizations">
      <table class="table abyss-table abyss-table-cards">
        <thead>
          <tr>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Name"
                sortByKey="name"
                sortByKeyType="string"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Owner"
                sortByKey="organizationowner"
                sortByKeyType="string"
              />
            </th>
            <th class="text-nowrap">
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Sub Organizations"
                sortByKey="suborganizations"
                sortByKeyType="number"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Users"
                sortByKey="organizationusers"
                sortByKeyType="number"
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(item, index) in organizations" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
          v-if="item.organizationid === organization.uuid && item.uuid !== rootorganization"
          :level="1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.name }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationowner }}
            </td>
            <td class="number" @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.suborganizations }}
            </td>
            <td class="number" @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationusers }}
            </td>
            <td class="actions">
              <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted">
                <template slot="button-content">
                  <Icon icon="ellipsis-h" />
                </template>
      
                <b-dropdown-item :to="`/app/organizations/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
                <b-dropdown-item :to="`/app/organizations/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>
      
                <b-dropdown-header>LOGS</b-dropdown-header>
      
                <b-dropdown-item :to="`/app/organizations/${page}/logs/${item.uuid}/organization/1`">All</b-dropdown-item>
      
                <b-dropdown-header><code>{{ organization.uuid }}</code></b-dropdown-header>

              </b-dropdown>
            </td>
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="5">
              <div class="collapsible-content">
                <Organization
                  :organizations="organizations"
                  :organization="item"
                  :page="page"
                />
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Users from '@/components/shared/Users';

export default {
  name: 'Organization',
  components: {
    Icon,
    SortBy,
    TbodyCollapsible,
    Users,
  },
  props: {
    organization: {
      Type: Object,
      required: false,
      default() { return {}; },
    },
    rootorganization: {
      Type: String,
      required: false,
      default() { return ''; },
    },
    page: {
      Type: Number,
      required: false,
      default() { return 1; },
    },
    organizations: {
      Type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {
    ...mapState({
      // groups: state => state.groups.items,
      users: state => state.users.items,
      apps: state => state.apps.items,
      apis: state => state.apis.items,
      subjectOrganizations: state => state.subjectOrganizations.items,
    }),
    organizationUsers1() {
      const { users, organization } = this;
      return users.filter(item => item.organizationid === organization.uuid);
    },
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
    organizationUsers() {
      const { users, organizationSubjects } = this;
      const organizationUsers = users.filter(user =>
        organizationSubjects.some(f =>
          f.subjectid === user.uuid,
        ),
      );
      return organizationUsers;
    },
  },
  created() {
    this.$store.dispatch('users/getUsers', {});
    // this.$store.dispatch('groups/getGroups', {});
    // this.$store.dispatch('apps/getApps', {});
    // this.$store.dispatch('apis/getApis', {});
    // this.getUsersOfOrganizations();
    this.$store.dispatch('subjectOrganizations/getSubjectOrganizations', {});
  },
  data() {
    return {
      sortByKey: 'name',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      collapsedRows: [],
      // organizationSubjects: [],
      isShowOrganizationUsers: false,
      isShowSubOrganizations: false,
    };
  },
  methods: {
    getUsersOfOrganizations() {
      api.getUsersOfOrganizations(this.organization.uuid).then((response) => {
        if (!this.organizationSubjects.length) {
          this.organizationSubjects = response.data;
        }
      });
    },
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
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>
