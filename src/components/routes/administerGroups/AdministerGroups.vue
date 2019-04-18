<template>
  <div class="page-container page-groups">

    <div class="page-header">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="false" to="/app/organizations/1">
          <span class="link-text" data-qa="linkOrganizations">Organizations</span> <b-badge pill>{{ computedOrganizations.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="false" to="/app/administer-users/users/1">
          <span class="link-text" data-qa="linkUsers">Users</span> <b-badge pill>{{ users.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="true">
          <span class="link-text" data-qa="linkGroups">Groups</span> <b-badge pill>{{ groups.length }}</b-badge>
        </b-nav-item>
      </b-nav>
      <div class="row">
        <div class="col">
          <InputWithIcon
            :prepend="{ icon: 'filter' }"
            placeholder="Type to filter"
            :onKeyup="handleFilterKeyup"
            class="page-filter"
          />
        </div>
        <div class="col-auto">
          <b-button
            v-b-tooltip.hover
            title="Refresh"
            variant="link"
            class="page-btn-refresh"
            block
            @click="refreshData"
            data-qa="btnRefresh"
          >
            <Icon icon="redo" />
          </b-button>
        </div>
        <div class="col-auto">
          <b-button
            :to="`/app/administer-groups/${page}/add-new`"
            variant="primary"
            class="page-btn-add"
            block
            data-qa="btnAddNew"
          >
            <span class="btn-text">Add New</span>
            <Icon icon="plus" />
          </b-button>
        </div>
      </div>
    </div>

    <div class="page-content">
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
          v-if="isLoading && totalRows.length === 0"
          :cols="5"
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

                <b-dropdown-item data-qa="btnEdit" :to="`/app/administer-groups/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
                <b-dropdown-item data-qa="btnDelete"  :to="`/app/administer-groups/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>

                <b-dropdown-header></b-dropdown-header>

                <b-dropdown-item data-qa="btnEditGroupUsers" :to="`/app/administer-groups/${page}/edit-group-users/${item.uuid}`"><Icon icon="users" /> Edit Group Users</b-dropdown-item>

                <b-dropdown-header>LOGS</b-dropdown-header>

                <b-dropdown-item data-qa="btnLogsAll"  :to="`/app/administer-groups/${page}/logs/${item.uuid}/subject/1`">All</b-dropdown-item>

                <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

              </b-dropdown>
            </td>
          </tr>
          <tr slot="footer" class="footer" data-qa="tableFooter">
            <td colspan="5">
              <div class="collapsible-content">
                <!-- <AdministerGroup
                  :group="item"
                  :users="users"
                  :memberships="memberships"
                  :page="page"
                /> -->
                <AdministerGroup
                  :group="item"
                  :page="page"
                />
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
      <router-view></router-view>
    </div>
    <div class="page-footer" v-if="totalRows.length > itemsPerPage">
      <b-pagination
        size="md"
        :total-rows="totalRows.length"
        v-model="page"
        :per-page="itemsPerPage"
        align="center"
        @change="handlePageChange"
        data-qa="footerPagination"
      >
      </b-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AdministerGroup from '@/components/routes/administerGroups/AdministerGroup';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Helpers from '@/helpers';

export default {
  components: {
    AdministerGroup,
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
      currentUser: state => state.user,
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
      subjectOrganizations: state => state.subjectOrganizations.items,
      groups: state => state.groups.items,
      users: state => state.users.items,
      memberships: state => state.subjectMemberships.items,
    }),
    computedOrganizations() {
      const { subjectOrganizations, currentUser } = this;
      const organizationSubjects = subjectOrganizations
        .filter(item => item.subjectid === currentUser.uuid);
      return organizationSubjects;
    },
    totalRows() {
      const { subjectDirectories, organizations, groups, users } = this;
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
          // !item.isdeleted &&
          item.subjectgroupid === groupId);
        // console.log('members.length: ', members.length);
        const groupUsers = users.filter(el =>
          members.some(f =>
            f.subjectid === el.uuid,
          ),
        );
        // console.log('users.length: ', groupUsers.length);
        return groupUsers;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: groups.map(item => ({
          ...item,
          directoryname: getDirectoryName(item.subjectdirectoryid),
          organizationname: getOrganizationName(item.organizationid),
          users: getUsers(item.uuid),
          userscount: getUsers(item.uuid).length,
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.firstname &&
              item.firstname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.lastname &&
              item.lastname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.displayname &&
              item.displayname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.email &&
              item.email.toLowerCase().indexOf(filterKeyLowerCase) > -1
            )
          );
        }),
        sortByKey,
        sortByKeyType,
        sortDirection,
      });
    },
    paginatedRows() {
      const { totalRows, itemsPerPage, page } = this;
      const { paginateArray } = Helpers;
      return paginateArray({
        array: totalRows,
        itemsPerPage,
        page,
      });
    },
  },
  created() {
    this.$store.commit('currentPage/setRootPath', 'administer-groups');
    this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes', {});
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('subjectOrganizations/getSubjectOrganizations', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('groups/getGroups', {});
    this.$store.dispatch('subjectMemberships/getAllSubjectMemberships', {});
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'firstname',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      filterKey: '',
      collapsedRows: [],
      itemsPerPage: 20,
    };
  },
  methods: {
    handleSortByClick({ sortByKey, sortByKeyType, sortDirection }) {
      this.sortByKey = sortByKey;
      this.sortByKeyType = sortByKeyType;
      this.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    },
    handleFilterKeyup({ value }) {
      this.filterKey = value;
    },
    handlePageChange(page) {
      this.$router.push(`/app/administer-groups/${page}`);
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
    refreshData() {
      this.$store.dispatch('groups/getGroups', {
        refresh: true,
      });
    },
  },
};
</script>
