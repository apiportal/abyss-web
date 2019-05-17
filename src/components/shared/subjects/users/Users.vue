<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th class="status">
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Status"
              sortByKey="isactivated"
              sortByKeyType="boolean"
            />
          </th>
          <th>

          </th>
            <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="User Name"
              sortByKey="displayname"
              sortByKeyType="string"
              data-qa="tableHeadName"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="E-mail"
              sortByKey="email"
              sortByKeyType="string"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Organization"
              sortByKey="organizationname"
              sortByKeyType="string"
            />
          </th>
          <th></th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="6"
      />
      <TbodyCollapsible
        v-for="(item, index) in paginatedRows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
          :data-qa="`tableRow-${index}`"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
          <td class="status" @click="() => handleCollapseTableRows(item.uuid)">
            <Icon
              :icon="item.isactivated ? 'check-circle' : 'times-circle'"
              :class="item.isactivated ? 'text-success' : 'text-danger'"
            />
          </td>
          <td>
            <Images :uuid="item.uuid" :itext="item.displayname" type="subjects" shape="circle"></Images>
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" :data-qa="`tableRowName-${index}`">
            {{ item.displayname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.email }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.organizationname }}
          </td>
          <td class="actions">
          <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item data-qa="btnEdit" :to="`${routePath}/edit-user/${item.uuid}`"><Icon icon="edit" /> Edit User</b-dropdown-item>
              <b-dropdown-item data-qa="btnDelete" :to="`${routePath}/delete-user/${item.uuid}`"><Icon icon="trash-alt" /> Delete User</b-dropdown-item>

              <b-dropdown-header class="p-0"></b-dropdown-header>

              <b-dropdown-item data-qa="btnEditGroups" :to="`${routePath}/edit-user-groups/${item.uuid}`"><Icon icon="users" /> Edit User Groups</b-dropdown-item>
              <b-dropdown-item data-qa="btnEditRoles" :to="`${routePath}/edit-user-roles/${item.uuid}`"><Icon icon="user-tag" /> Edit User Roles</b-dropdown-item>
              <b-dropdown-item data-qa="btnEditOrganizations" :to="`${routePath}/edit-user-organizations/${item.uuid}`"><Icon icon="home" /> Edit User Organizations</b-dropdown-item>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item data-qa="btnLogsAll" :to="`${routePath}/logs/${item.uuid}/subject/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1" data-qa="tableFooter">
          <td colspan="6">
            <div class="collapsible-content">
              <User
                :user="item"
                :routePath="routePath"
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
import User from '@/components/shared/subjects/users/User';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Helpers from '@/helpers';
import Images from '@/components/shared/Images';

export default {
  props: {
    rows: {
      type: Array,
      required: false,
      default() { return []; },
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
    page: {
      Type: Number,
      required: false,
      default() { return 1; },
    },
    itemsPerPage: {
      Type: Number,
      required: false,
      default() { return 2000; },
    },
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
      users: state => state.users.items,
      groups: state => state.groups.items,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection, rows,
        organizations, subjectDirectories } = this;
      const { sortArrayOfObjects } = Helpers;
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const getDirectoryName = (subjectdirectoryid) => {
        const directory = subjectDirectories.find(item => item.uuid === subjectdirectoryid);
        return directory ? directory.directoryname : subjectdirectoryid;
      };
      return sortArrayOfObjects({
        array: rows
          .map(item => ({
            ...item,
            organizationname: getOrganizationName(item.organizationid),
            directoryname: getDirectoryName(item.subjectdirectoryid),
          })),
        sortByKey,
        sortByKeyType,
        sortDirection,
      });
    },
    paginatedRows() {
      const { tableRows, itemsPerPage, page } = this;
      const { paginateArray } = Helpers;
      return paginateArray({
        array: tableRows,
        itemsPerPage,
        page,
      });
    },
  },
  created() {
    this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes', {});
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('subjectOrganizations/getSubjectOrganizations', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('groups/getGroups', {});
  },
  components: {
    User,
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
    Images,
  },
  data() {
    return {
      collapsedRows: [],
      sortByKey: 'displayname',
      sortByKeyType: 'string',
      sortDirection: 'desc',
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
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>
