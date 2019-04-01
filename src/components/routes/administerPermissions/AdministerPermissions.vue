<template>
    <div class="page-container page-permissions">

      <div class="page-header">
        <b-nav class="page-tabs" tabs>
          <b-nav-item :active="true">
            <span class="link-text" data-qa="linkAccessManagers">Permissions</span> <b-badge pill>{{ permissions.length }}</b-badge>
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
              :to="`/app/administer-permissions/${page}/add-new`"
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
                  sortByKey="isactive"
                  sortByKeyType="boolean"
                />
              </th>
              <th>
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  text="Permission Name"
                  sortByKey="permission"
                  sortByKeyType="string"
                  data-qa="tableHeadName"
                />
              </th>
              <th>
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  text="Resource Type"
                  sortByKey="resourcetypename"
                  sortByKeyType="string"
                />
              </th>
              <th>
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  text="Resource Action"
                  sortByKey="resourceactionname"
                  sortByKeyType="string"
                />
              </th>
              <th>
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  text="Access Manager"
                  sortByKey="accessmanagername"
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
          v-if="isLoading && tableRows.length === 0"
          :cols="7"
        />
          <TbodyCollapsible
            v-for="(item, index) in paginatedRows" v-bind:key="index"
            :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
            :data-qa="`tableRow-${index}`"
          >
            <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
              <td class="status" @click="() => handleCollapseTableRows(item.uuid)">
                <Icon 
                  :icon="item.isactive ? 'check-circle' : 'times-circle'" 
                  :class="item.isactive ? 'text-success' : 'text-danger'"
                />
              </td>
              <td @click="() => handleCollapseTableRows(item.uuid)">
                {{ item.permission }}
              </td>
              <td class="type" @click="() => handleCollapseTableRows(item.uuid)">
                {{ item.resourcetypename }}
              </td>
              <td class="type" @click="() => handleCollapseTableRows(item.uuid)">
                {{ item.resourceactionname }}
              </td>
              <td @click="() => handleCollapseTableRows(item.uuid)">
                {{ item.accessmanagername }}
              </td>
              <td @click="() => handleCollapseTableRows(item.uuid)">
                {{ item.organizationname }}
              </td>
              <td class="actions">
                <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
                  <template slot="button-content">
                    <Icon icon="ellipsis-h" />
                  </template>

                  <b-dropdown-item data-qa="btnEdit" :to="`/app/administer-permissions/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
                  <b-dropdown-item data-qa="btnDelete" :to="`/app/administer-permissions/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>

                  <b-dropdown-header>LOGS</b-dropdown-header>

                  <b-dropdown-item data-qa="btnLogsAll" :to="`/app/administer-permissions/${page}/logs/${item.uuid}/subjectpermission/1`">All</b-dropdown-item>

                  <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

                </b-dropdown>
              </td>
            </tr>
            <tr slot="footer" class="footer" data-qa="tableFooter" v-if="collapsedRows.indexOf(item.uuid) > -1">
              <td colspan="7">
                <div class="collapsible-content">
                  <AdministerPermission
                    :permission="item"
                    :subjectTypes="subjectTypes"
                    :page="page"
                  />
                </div>
              </td>
            </tr>
          </TbodyCollapsible>
        </table>
        <router-view></router-view>
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
import AdministerPermission from '@/components/routes/administerPermissions/AdministerPermission';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
    AdministerPermission,
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
      accessManagers: state => state.accessManagers.items,
      organizations: state => state.organizations.items,
      permissions: state => state.permissions.items,
      resources: state => state.resources.items,
      resourceTypes: state => state.resourceTypes.items,
      resourceActions: state => state.resourceActions.items,
      subjectTypes: state => state.subjectTypes.items,
    }),
    tableRows() {
      const { accessManagers,
      organizations,
      permissions,
      resources,
      resourceTypes,
      resourceActions } = this;
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
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: permissions.map(item => ({
          ...item,
          resourceactionname: getResourceActions(item.resourceactionid),
          organizationname: getOrganizationName(item.organizationid),
          resourcename: getResourceName(item.resourceid),
          accessmanagername: getAccessManagerName(item.accessmanagerid),
          resourcetypename: getResourceTypeName(item.resourceid),
        }))
        .filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.permission &&
              item.permission.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.resourcetypename &&
              item.resourcetypename.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.subjectname &&
              item.subjectname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.subjecttypename &&
              item.subjecttypename.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.resourceactionname &&
              item.resourceactionname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.accessmanagername &&
              item.accessmanagername.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.organizationname &&
              item.organizationname.toLowerCase().indexOf(filterKeyLowerCase) > -1
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
    this.$store.commit('currentPage/setRootPath', 'administer-permissions');
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('resources/getResources', {});
    this.$store.dispatch('resourceTypes/getResourceTypes', {});
    this.$store.dispatch('resourceActions/getResourceActions', {});
    this.$store.dispatch('permissions/getPermissions', {});
    this.$store.dispatch('accessManagers/getAccessManagers', {});
    this.$store.dispatch('subjectTypes/getSubjectTypes', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('groups/getGroups', {});
    this.$store.dispatch('apps/getApps', {});
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'permission',
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
      this.$router.push(`/app/administer-permissions/${page}`);
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
      this.$store.dispatch('permissions/getPermissions', {
        refresh: true,
      });
    },
  },
};
</script>
