<template>
    <div class="administer-permissions-container">
      <div class="administer-permissions-header silver-bg">
        <div class="row">
          <div class="col-md-9">
            <InputWithIcon
              :prepend="{ icon: 'filter' }"
              placeholder="Type to filter"
              :onKeyup="handleFilterKeyup"
            />
          </div>
        <div class="col-md-1">
          <b-button
            v-b-tooltip.hover 
            title="Refresh"
            block
            @click="refreshData"
          >
            <Icon icon="redo" />
          </b-button>
        </div>
          <div class="col-md-2">
            <b-button
              :to="`/app/administer-permissions/${page}/add-new`"
              variant="primary"
              block
            >
              Add
            </b-button>
          </div>
        </div>
      </div>
      <div class="administer-permissions-content">
        <table class="table verapi-table">            
          <thead>
            <tr>
              <th class="status">
                Status
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  sortByKey="isactive"
                  sortByKeyType="boolean"
                />
              </th>
              <th>
                Permission Name
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  sortByKey="permission"
                  sortByKeyType="string"
                />
              </th>
              <th>
              Resource Type
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  sortByKey="resourcetypename"
                  sortByKeyType="string"
                />
              </th>
              <th>
                Resource Action
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  sortByKey="resourceactionname"
                  sortByKeyType="string"
                />
              </th>
              <th>
                Access Manager
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  sortByKey="accessmanagername"
                  sortByKeyType="string"
                />
              </th>
              <th>
                Organization
                <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  sortByKey="organizationname"
                  sortByKeyType="string"
                />
              </th>
            </tr>
          </thead>
        <TBodyLoading
          v-if="isLoading && tableRows.length === 0"
          :cols="6"
        />
          <TbodyCollapsible
            v-for="(item, index) in paginatedRows" v-bind:key="index"
            :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
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
              <td @click="() => handleCollapseTableRows(item.uuid)">
                {{ item.resourcetypename }}
              </td>
              <td @click="() => handleCollapseTableRows(item.uuid)">
                {{ item.resourceactionname }}
              </td>
              <td @click="() => handleCollapseTableRows(item.uuid)">
                {{ item.accessmanagername }}
              </td>
              <td @click="() => handleCollapseTableRows(item.uuid)">
                {{ item.organizationname }}
              </td>
            </tr>
            <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
              <td colspan="6">
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
      <div class="administer-permissions-footer" v-if="tableRows.length > itemsPerPage">
        <b-pagination 
          size="md"
          :total-rows="tableRows.length"
          v-model="page" 
          :per-page="itemsPerPage"
          align="center"
          @change="handlePageChange"
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
        this.collapsedRows.push(itemId);
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

<style lang="scss" scoped>
.administer-permissions-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .administer-permissions-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .administer-permissions-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }

  .administer-permissions-content {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }
}
</style>