<template>
  <div class="page-container page-access-managers">

    <div class="page-header">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="true">
          <span class="link-text" data-qa="linkAccessManagers">Access Managers</span> <b-badge pill>{{ accessManagers.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="false"
          to="/app/access-manager-types/1"
        >
          <span class="link-text" data-qa="linkAccessManagerTypes">Access Manager Types</span> <b-badge pill>{{ accessManagerTypes.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="false"
          to="/app/roles/1"
        >
          <span class="link-text" data-qa="linkRoles">Roles</span> <b-badge pill>{{ roles.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="false"
          to="/app/administer-permissions/1"
        >
          <span class="link-text" data-qa="linkPermissions">Permissions</span> <b-badge pill>{{ permissions.length }}</b-badge>
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
            :to="`/app/access-managers/${page}/add-new`"
            variant="primary"
            v-b-tooltip.hover
            title="Add New Access Manager"
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
                sortByKey="isactive"
                sortByKeyType="boolean"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Access Manager Name"
                sortByKey="accessmanagername"
                sortByKeyType="string"
                data-qa="tableHeadName"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Access Manager Type"
                sortByKey="accessmanagertypename"
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
                :icon="item.isactive ? 'check-circle' : 'times-circle'"
                :class="item.isactive ? 'text-success' : 'text-danger'"
              />
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)" :data-qa="`tableRowName-${index}`">
              {{ item.accessmanagername }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.accessmanagertypename }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
            <td class="actions">
              <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
                <template slot="button-content">
                  <Icon icon="ellipsis-h" />
                </template>

                <b-dropdown-item data-qa="btnEdit" :to="`/app/access-managers/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit Access Manager</b-dropdown-item>
                <b-dropdown-item data-qa="btnDelete" :to="`/app/access-managers/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete Access Manager</b-dropdown-item>

                <b-dropdown-header>LOGS</b-dropdown-header>

                <b-dropdown-item data-qa="btnLogsAll" :to="`/app/access-managers/${page}/logs/${item.uuid}/accessmanager/1`">All</b-dropdown-item>

                <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

              </b-dropdown>
            </td>
          </tr>
          <tr slot="footer" class="footer" data-qa="tableFooter">
            <td colspan="5">
              <div class="collapsible-content">
                <div class="abyss-table-content">
                  <div class="row">
                    <dl class="col">
                      <dt>Access Manager Name:</dt>
                      <dd>{{ item.accessmanagername }}</dd>
                      <dt>Type:</dt>
                      <dd>{{ item.accessmanagertypename }}</dd>
                    </dl>
                    <dl class="col">
                      <dt>Description:</dt>
                      <dd>{{ item.description }}</dd>
                      <dt>Organization:</dt>
                      <dd>{{ item.organizationname }}</dd>
                    </dl>
                    <dl class="col">
                      <dt>Created:</dt>
                      <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
                      <dt v-if="!item.isdeleted">Updated:</dt>
                      <dd v-if="!item.isdeleted">{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
                      <dt v-if="item.isdeleted">Deleted:</dt>
                      <dd v-if="item.isdeleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
        <router-view></router-view>
      </table>
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
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
      accessManagers: state => state.accessManagers.items,
      accessManagerTypes: state => state.accessManagerTypes.items,
      organizations: state => state.organizations.items,
      roles: state => state.roles.items,
      permissions: state => state.permissions.items,
    }),
    tableRows() {
      const { accessManagers, accessManagerTypes, organizations } = this;
      const getAccessManagerTypeName = (accessManagerId) => {
        const accessManager = accessManagerTypes.find(item => item.uuid === accessManagerId);
        return accessManager ? accessManager.typename : accessManagerId;
      };
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: accessManagers.map(item => ({
          ...item,
          accessmanagertypename: getAccessManagerTypeName(item.accessmanagertypeid),
          organizationname: getOrganizationName(item.organizationid),
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.accessmanagername &&
              item.accessmanagername.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.accessmanagertypename &&
              item.accessmanagertypename.toLowerCase().indexOf(filterKeyLowerCase) > -1
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
    this.$store.commit('currentPage/setRootPath', 'access-managers');
    this.$store.dispatch('accessManagers/getAccessManagers', {});
    this.$store.dispatch('accessManagerTypes/getAccessManagerTypes', {});
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('roles/getRoles', {});
    this.$store.dispatch('permissions/getPermissions', {});
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'accessmanagername',
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
      this.$router.push(`/app/access-managers/${page}`);
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
      this.$store.dispatch('accessManagers/getAccessManagers', {
        refresh: true,
      });
    },
  },
};
</script>
