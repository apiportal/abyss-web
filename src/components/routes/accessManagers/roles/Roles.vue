<template>
  <div class="page-container page-roles">

    <div class="page-header">
      <b-nav class="page-tabs" tabs>
        <b-nav-item
          :active="false"
          to="/app/access-managers/1"
        >
          <span class="link-text" data-qa="linkAccessManagers">Access Managers</span> <b-badge pill>{{ accessManagers.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="false"
          to="/app/access-manager-types/1"
        >
          <span class="link-text" data-qa="linkAccessManagerTypes">Access Manager Types</span> <b-badge pill>{{ accessManagerTypes.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="true"
        >
          <span class="link-text" data-qa="linkRoles">Roles</span> <b-badge pill>{{ roles.length }}</b-badge>
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
            :to="`/app/roles/${page}/add-new`"
            variant="primary"
            class="page-btn-add"
            data-qa="btnAddNew"
            block
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
                text="Role Name"
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
                text="Permissions"
                sortByKey="permissionscount"
                sortByKeyType="number"
              />
            </th>
            <th>
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
                text="Groups"
                sortByKey="groupscount"
                sortByKeyType="number"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Effective Start Date"
                sortByKey="effectivestartdate"
                sortByKeyType="string"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Effective End Date"
                sortByKey="effectiveenddate"
                sortByKeyType="string"
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <TBodyLoading
          v-if="isLoading && tableRows.length === 0"
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
            <td @click="() => handleCollapseTableRows(item.uuid)" class="number">
              {{ item.permissions.length }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)" class="number">
              {{ item.users.length }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)" class="number">
              {{ item.groups.length }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.effectivestartdate | moment("DD.MM.YYYY HH:mm")  }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.effectiveenddate | moment("DD.MM.YYYY HH:mm") }}
            </td>
            <td class="actions">
              <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
                <template slot="button-content">
                  <Icon icon="ellipsis-h" />
                </template>

                <b-dropdown-item data-qa="btnEdit" :to="`/app/roles/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit Role</b-dropdown-item>
                <b-dropdown-item data-qa="btnDelete" :to="`/app/roles/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete Role</b-dropdown-item>

                <b-dropdown-header class="p-0"></b-dropdown-header>
                <b-dropdown-item data-qa="btnRolePermissions" :to="`/app/roles/${page}/edit-role-permissions/${item.uuid}`"><Icon icon="user-cog" /> Edit Role Permissions</b-dropdown-item>
                <b-dropdown-item data-qa="btnRoleUsers" :to="`/app/roles/${page}/edit-role-users/${item.uuid}`"><Icon icon="users" /> Edit Role Users</b-dropdown-item>
                <b-dropdown-item data-qa="btnRoleGroups" :to="`/app/roles/${page}/edit-role-groups/${item.uuid}`"><Icon icon="user-friends" /> Edit Role Groups</b-dropdown-item>

                <b-dropdown-header>LOGS</b-dropdown-header>

                <b-dropdown-item data-qa="btnLogsAll" :to="`/app/roles/${page}/logs/${item.uuid}/subject/1`">All</b-dropdown-item>

                <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

              </b-dropdown>
            </td>
          </tr>
          <tr slot="footer" class="footer" data-qa="tableFooter">
            <td colspan="8">
              <div class="collapsible-content">
                <Role
                  :item="item"
                />
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
        <router-view></router-view>
      </table>
    </div>
    <div class="page-footer">
      <b-pagination
        size="md"
        :total-rows="tableRows.length"
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
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Role from '@/components/routes/accessManagers/roles/Role';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
    Role,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      isLoading: state => state.traffic.isLoading,
      roles: state => state.roles.items,
      accessManagers: state => state.accessManagers.items,
      accessManagerTypes: state => state.accessManagerTypes.items,
      users: state => state.users.items,
      memberships: state => state.subjectMemberships.items,
      roleMemberships: state => state.roleMemberships.items,
      groupRoleMemberships: state => state.groupRoleMemberships.items,
      organizations: state => state.organizations.items,
      permissions: state => state.permissions.items,
      resourceTypes: state => state.resourceTypes.items,
      resources: state => state.resources.items,
      resourceActions: state => state.resourceActions.items,
      groups: state => state.groups.items,
      subjectTypes: state => state.subjectTypes.items,
    }),
    tableRows() {
      const { roles, users, organizations, groups } = this;
      const { resources, resourceActions, accessManagers, resourceTypes } = this;
      const getUsers = (roleId) => {
        const members = this.roleMemberships.filter(item =>
          !item.isdeleted &&
          item.subjectgroupid === roleId);
        const roleUsers = users.filter(el =>
          members.some(f =>
            f.subjectid === el.uuid,
          ),
        );
        return roleUsers;
      };
      const getGroups = (roleId) => {
        const members = this.groupRoleMemberships.filter(item =>
          !item.isdeleted &&
          item.subjectgroupid === roleId);
        const roleGroups = groups.filter(el =>
          members.some(f =>
            f.subjectid === el.uuid,
          ),
        );
        return roleGroups;
      };
      const getPermissions = (roleId) => {
        const permissions = this.permissions.filter(item =>
          !item.isdeleted &&
          item.subjectid === roleId);
        const getOrganizationName = (organizationId) => {
          const organization = organizations.find(item => item.uuid === organizationId) || {};
          return organization.name || organizationId;
        };
        const getResourceName = (resourceId) => {
          const resource = resources.find(item => item.uuid === resourceId) || {};
          return resource.resourcename || resourceId;
        };
        const getResourceActions = (resourceActionId) => {
          const resourceAction = resourceActions.find(item => item.uuid === resourceActionId) || {};
          return resourceAction.actionname || resourceActionId;
        };
        const getAccessManagerName = (accessManagerId) => {
          const accessManager = accessManagers.find(item => item.uuid === accessManagerId) || {};
          return accessManager.accessmanagername || accessManagerId;
        };
        const getResourceTypeId = (resourceId) => {
          const resource = resources.find(item => item.uuid === resourceId) || {};
          return resource.resourcetypeid || resourceId;
        };
        const getResourceTypeName = (resourceId) => {
          const resourceTypeId = getResourceTypeId(resourceId);
          const resourceType = resourceTypes.find(item => item.uuid === resourceTypeId) || {};
          return resourceType.type || resourceTypeId;
        };
        return permissions.map(item => ({
          ...item,
          resourceactionname: getResourceActions(item.resourceactionid),
          organizationname: getOrganizationName(item.organizationid),
          resourcename: getResourceName(item.resourceid),
          accessmanagername: getAccessManagerName(item.accessmanagerid),
          resourcetypename: getResourceTypeName(item.resourceid),
        }));
      };

      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: roles.map(item => ({
          ...item,
          users: getUsers(item.uuid),
          organizationname: getOrganizationName(item.organizationid),
          permissions: getPermissions(item.uuid),
          groups: getGroups(item.uuid),
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
    this.$store.commit('currentPage/setRootPath', 'roles');
    this.$store.dispatch('roles/getRoles', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('accessManagers/getAccessManagers', {});
    this.$store.dispatch('roleMemberships/getAllRoleMemberships', {});
    this.$store.dispatch('groupRoleMemberships/getAllGroupRoleMemberships', {});
    this.$store.dispatch('accessManagerTypes/getAccessManagerTypes', {});
    this.$store.dispatch('permissions/getPermissions', {});
    this.$store.dispatch('resources/getResources', {});
    this.$store.dispatch('resourceTypes/getResourceTypes', {});
    this.$store.dispatch('resourceActions/getResourceActions', {});
    this.$store.dispatch('groups/getGroups', {});
    this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    this.$store.dispatch('organizations/getOrganizations', {});
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'displayname',
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
      this.$router.push(`/app/roles/${page}`);
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    refreshData() {
      this.$store.dispatch('roles/getRoles', {
        refresh: true,
      });
    },
  },
};
</script>
