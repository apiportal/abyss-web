<template>
  <div>
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
        <dt>uuid:</dt>
        <dd><code>{{ organization.uuid }}</code></dd>
      </dl>
      <dl class="col-1">
        <dt>Users:</dt>
        <dd>{{ organizationUsers.length }}</dd>
        <dt>Groups:</dt>
        <dd>{{ organizationGroups.length }}</dd>
      </dl>
      <dl class="col-1">
        <dt>APPs:</dt>
        <dd>{{ organizationApps.length }}</dd>
        <dt>APIs:</dt>
        <dd>{{ organizationApis.length }}</dd>
      </dl>
      <dl class="col-3 col-xl-2">
        <dt>Created:</dt>
        <dd>{{ organization.created }}</dd>
        <dt>Updated:</dt>
        <dd>{{ organization.updated }}</dd>
        <dt>Deleted:</dt>
        <dd>{{ organization.deleted }}</dd>
      </dl>
    </div>
    <div>
      <b-dropdown variant="secondary" size="sm">
        <template slot="button-content">
          <Icon icon="list-ol" />
          <span>Logs</span>
        </template>
        <b-dropdown-item :to="`/app/organizations/${page}/logs/${organization.uuid}/all/1`">All</b-dropdown-item>
      </b-dropdown>
      <b-button
        :to="`/app/organizations/${page}/edit/${organization.uuid}`"
        size="sm"
        variant="primary"
        v-b-tooltip.hover
        title="Edit"
      >
        Edit <Icon icon="edit" />
      </b-button>
      <b-button
        :to="`/app/organizations/${page}/delete/${organization.uuid}`"
        size="sm"
        variant="danger"
        v-b-tooltip.hover
        title="Delete"
      >
        Delete <Icon icon="trash-alt" /> 
      </b-button>
    </div>
    <table class="table verapi-table" v-if="organization.suborganizations > 0 && organization.uuid !== rootorganization">
      <thead>
        <tr>
          <th>
            Name
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              sortByKey="name"
              sortByKeyType="string"
            />
          </th>
          <th>
            Parent Organization
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              sortByKey="organizationname"
              sortByKeyType="string"
            />
          </th>
          <th>
            Sub Organizations
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              sortByKey="suborganizations"
              sortByKeyType="number"
            />
          </th>
          <th>
            Url
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              sortByKey="url"
              sortByKeyType="string"
            />
          </th>
          <th>
            Description
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              sortByKey="description"
              sortByKeyType="string"
            />
          </th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(item, index) in organizations" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        v-if="item.organizationid === organization.uuid && item.uuid !== rootorganization"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.name }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.organizationname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.suborganizations }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.url }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.description }}
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
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';

export default {
  name: 'Organization',
  components: {
    Icon,
    SortBy,
    TbodyCollapsible,
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
      groups: state => state.groups.items,
      users: state => state.users.items,
      apps: state => state.apps.items,
      apis: state => state.apis.items,
    }),
    organizationUsers() {
      const { users, organization } = this;
      return users.filter(item => item.organizationid === organization.uuid);
    },
    organizationGroups() {
      const { groups, organization } = this;
      return groups.filter(item => item.organizationid === organization.uuid);
    },
    organizationApps() {
      const { apps, organization } = this;
      return apps.filter(item => item.organizationid === organization.uuid);
    },
    organizationApis() {
      const { apis, organization } = this;
      return apis.filter(item => item.organizationid === organization.uuid);
    },
  },
  mounted() {
    this.$store.dispatch('users/getUsers');
    this.$store.dispatch('groups/getGroups');
    this.$store.dispatch('apps/getApps');
    this.$store.dispatch('apis/getApis');
  },
  data() {
    return {
      sortByKey: 'name',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      collapsedRows: [],
    };
  },
  methods: {
    handleSortByClick({ sortByKey, sortByKeyType, sortDirection }) {
      this.sortByKey = sortByKey;
      this.sortByKeyType = sortByKeyType;
      this.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>
