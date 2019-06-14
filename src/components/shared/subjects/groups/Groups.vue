<template>
    <div class="abyss-table-content">
      <table class="table abyss-table abyss-table-cards">
        <thead>
          <tr>
            <th></th>
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
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Group Name"
                sortByKey="displayname"
                sortByKeyType="string"
                data-qa="tableHeadName"
              />
            </th>
            <th class="number">
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Users"
                sortByKey="userscount"
                sortByKeyType="number"
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
            <td class="picture">
              <Pictures :uuid="item.uuid" :altText="item.displayname" type="subjects" shape="circle" :lastUpdatedAt="itemsLastUpdatedAt"></Pictures>
            </td>
            <td class="status" @click="() => handleCollapseTableRows(item.uuid)">
              <Icon
                :icon="item.isactivated ? 'check-circle' : 'times-circle'"
                :class="item.isactivated ? 'text-success' : 'text-danger'"
              />
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)" :data-qa="`tableRowName-${index}`">
              {{ item.displayname }}
            </td>
            <td class="number" @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.userscount }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
            <td class="actions">
              <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
                <template slot="button-content">
                  <Icon icon="ellipsis-h" />
                </template>

                <b-dropdown-item data-qa="btnEdit" :to="`${routePath}/edit-group/${item.uuid}`"><Icon icon="edit" /> Edit Group</b-dropdown-item>
                <b-dropdown-item data-qa="btnDelete"  :to="`${routePath}/delete-group/${item.uuid}`"><Icon icon="trash-alt" /> Delete Group</b-dropdown-item>

                <b-dropdown-header class="p-0"></b-dropdown-header>

                <b-dropdown-item data-qa="btnEditGroupUsers" :to="`${routePath}/edit-group-users/${item.uuid}`"><Icon icon="users" /> Edit Group Users</b-dropdown-item>

                <b-dropdown-header>LOGS</b-dropdown-header>

                <b-dropdown-item data-qa="btnLogsAll"  :to="`${routePath}/logs/${item.uuid}/subject/1`">All</b-dropdown-item>

                <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

              </b-dropdown>
            </td>
          </tr>
          <tr slot="footer" class="footer" data-qa="tableFooter">
            <td colspan="6">
              <div class="collapsible-content">
                <Group
                  :group="item"
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
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Group from '@/components/shared/subjects/groups/Group';
import Helpers from '@/helpers';
import Pictures from '@/components/shared/Pictures';

export default {
  name: 'Groups',
  components: {
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
    Group,
    Pictures,
  },
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
      organizations: state => state.organizations.items,
      users: state => state.users.items,
      memberships: state => state.subjectMemberships.items,
      userGroupMemberships: state => state.subjectMemberships.userGroup,
      itemsLastUpdatedAt: state => state.groups.lastUpdatedAt,
    }),
    tableRows() {
      const { subjectDirectories, organizations, rows, users } = this;
      const getDirectoryName = (subjectdirectoryid) => {
        const directory = subjectDirectories.find(item => item.uuid === subjectdirectoryid);
        return directory ? directory.directoryname : subjectdirectoryid;
      };
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const getUsers = (groupId) => {
        const members = this.memberships.filter(item =>
          !item.isdeleted &&
          item.subjectgroupid === groupId);
        const groupUsers = users.filter(el =>
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
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: rows.map(item => ({
          ...item,
          directoryname: getDirectoryName(item.subjectdirectoryid),
          organizationname: getOrganizationName(item.organizationid),
          users: getUsers(item.uuid),
          userscount: getUsers(item.uuid).length,
          currentuser: getUserFromGroups(item.uuid),
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
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('subjectMemberships/getAllSubjectMemberships', {});
    this.$store.dispatch('subjectMemberships/getUserGroupMemberships', {});
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
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>
