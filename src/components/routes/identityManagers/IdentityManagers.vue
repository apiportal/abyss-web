<template>
  <div class="page-container page-identity-managers">

    <div class="page-header">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="true">
          <span id="IdLinkIdentityManagers" class="link-text">Identity Managers</span>  <b-badge pill>{{ subjectDirectories.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="false"
          to="/app/identity-manager-types/1"
        >
          <span id="IdLinkIdentityManagerTypes" class="link-text">Identity Manager Types</span> <b-badge pill>{{ subjectDirectoryTypes.length }}</b-badge>
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
            id="IdBtnRefresh"
          >
            <Icon icon="redo" />
          </b-button>
        </div>
        <div class="col-auto">
          <b-button
            :to="`/app/identity-managers/${page}/add-new`"
            variant="primary"
            class="page-btn-add"
            block
            id="IdBtnAddNew"
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
            <th id="IdTheadName">
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Identity Manager Name"
                sortByKey="directoryname"
                sortByKeyType="string"
              />
            </th>
            <th class="text-nowrap">
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Priority Order"
                sortByKey="directorypriorityorder"
                sortByKeyType="number"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Directory Type"
                sortByKey="directorytypename"
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
          :cols="6"
        />
        <TbodyCollapsible
          v-for="(item, index) in paginatedRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
          id="IdIdentityManagersItem"
        >
          <tr id="IdTableRow" slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
            <td class="status" @click="() => handleCollapseTableRows(item.uuid)">
              <Icon 
                :icon="item.isactive ? 'check-circle' : 'times-circle'" 
                :class="item.isactive ? 'text-success' : 'text-danger'"
              />
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.directoryname }}
            </td>
            <td class="number" @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.directorypriorityorder }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.directorytypename }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
            <td class="actions">
              <b-dropdown id="IdItemDropDown" variant="link" size="lg" no-caret right v-if="!item.isdeleted">
                <template slot="button-content">
                  <Icon icon="ellipsis-h" />
                </template>

                <b-dropdown-item id="IdBtnEdit" :to="`/app/identity-managers/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
                <b-dropdown-item id="IdBtnDelete" :to="`/app/identity-managers/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>

                <b-dropdown-header>LOGS</b-dropdown-header>

                <b-dropdown-item id="IdBtnLogsAll" :to="`/app/identity-managers/${page}/logs/${item.uuid}/subjectdirectory/1`">All</b-dropdown-item>

                <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

              </b-dropdown>
            </td>
          </tr>
          <tr id="IdTableFooter" slot="footer" class="footer">
            <td colspan="6">
              <div class="collapsible-content">
                <div class="abyss-table-content">
                  <div class="row">
                    <dl class="col">
                      <dt>Name:</dt>
                      <dd title="Name">{{ item.directoryname }}</dd>
                      <dt>Description:</dt>
                      <dd title="Description">{{ item.description }}</dd>
                      <dt>Organization:</dt>
                      <dd title="Organization">{{ item.organizationname }}</dd>
                    </dl>
                    <dl class="col">
                      <dt>Priority Order:</dt>
                      <dd>{{ item.directorypriorityorder }}</dd>
                      <dt>Directory Type:</dt>
                      <dd>{{ item.directorytypename }}</dd>
                    </dl>
                    <dl class="col">
                      <dt>Active:</dt>
                      <dd>{{ item.isactive | booleanToText }}</dd>
                      <dt>Template:</dt>
                      <dd>{{ item.istemplate | booleanToText }}</dd>
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
        id="IdPagination"
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
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
    }),
    tableRows() {
      const { subjectDirectories, subjectDirectoryTypes, organizations } = this;
      const getDirectoryTypeName = (directoryId) => {
        const directory = subjectDirectoryTypes.find(item => item.uuid === directoryId);
        return directory ? directory.typename : directoryId;
      };
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: subjectDirectories.map(item => ({
          ...item,
          directorytypename: getDirectoryTypeName(item.directorytypeid),
          organizationname: getOrganizationName(item.organizationid),
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.directoryname &&
              item.directoryname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.directorytypename &&
              item.directorytypename.toLowerCase().indexOf(filterKeyLowerCase) > -1
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
    this.$store.commit('currentPage/setRootPath', 'identity-managers');
    this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes', {});
    this.$store.dispatch('organizations/getOrganizations', {});
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'directorypriorityorder',
      sortByKeyType: 'number',
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
      this.$router.push(`/app/identity-managers/${page}`);
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
      this.$store.dispatch('subjectDirectories/getSubjectDirectories', {
        refresh: true,
      });
    },
  },
};
</script>
