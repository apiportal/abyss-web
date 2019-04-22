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
        <Permissions
          :rows="paginatedRows"
          :routePath="`/app/administer-permissions/${page}`"
          :handleSortByClick="handleSortByClick"
          :sortByKey="sortByKey"
          :sortDirection="sortDirection"
          :sortByKeyType="sortByKeyType"
        />
        <router-view></router-view>
      </div>
      <div class="page-footer" v-if="tableRows.length > itemsPerPage">
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
import Permissions from '@/components/shared/subjects/permissions/Permissions';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Icon,
    Permissions,
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
