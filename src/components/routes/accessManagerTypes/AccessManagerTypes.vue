<template>
  <div class="page-container page-access-manager-types">
    
    <div class="page-header">
      <b-nav tabs>
        <b-nav-item :active="true">
          Access Manager Types <b-badge pill>{{ accessManagerTypes.length }}</b-badge>
        </b-nav-item>
      </b-nav>
      <div class="row">
        <div class="col">
          <InputWithIcon
            :prepend="{ icon: 'filter' }"
            placeholder="Type to filter"
            :onKeyup="handleFilterKeyup"
            class="filter-table"
          />
        </div>
        <div class="col-auto">
          <b-button
            v-b-tooltip.hover 
            title="Refresh"
            variant="link"
            class="btn-refresh"
            block
            @click="refreshData"
          >
            <Icon icon="redo" />
          </b-button>
        </div>
        <div class="col-auto">
          <b-button
            :to="`/app/access-manager-types/${page}/add-new`"
            variant="primary"
            class="btn-add"
            block
          >
            <span>Add New</span>
            <Icon icon="plus" />
          </b-button>
        </div>
      </div>
    </div>

    <div class="page-content">
      <table class="table abyss-table abyss-table-cards">
        <thead>
          <tr>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Name"
                sortByKey="typename"
                sortByKeyType="string"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Description"
                sortByKey="description"
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
          :cols="4"
        />
        <TbodyCollapsible
          v-for="(item, index) in paginatedRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.typename }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.description }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
            <td class="actions">
              <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted">
                <template slot="button-content">
                  <Icon icon="ellipsis-h" />
                </template>

                <b-dropdown-item :to="`/app/access-manager-types/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
                <b-dropdown-item :to="`/app/access-manager-types/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>

                <b-dropdown-header>LOGS</b-dropdown-header>

                <b-dropdown-item :to="`/app/access-manager-types/${page}/logs/${item.uuid}/accessmanagertype/1`">All</b-dropdown-item>

                <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

              </b-dropdown>
            </td>
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="4">
              <div class="collapsible-content">
                <div class="abyss-table-content">
                  <div class="row">
                    <dl class="col">
                      <dt>Name:</dt>
                      <dd>{{ item.typename }}</dd>
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
      accessManagerTypes: state => state.accessManagerTypes.items,
      organizations: state => state.organizations.items,
    }),
    tableRows() {
      const { accessManagerTypes, organizations } = this;
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: accessManagerTypes.map(item => ({
          ...item,
          organizationname: getOrganizationName(item.organizationid),
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.typename &&
              item.typename.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.description &&
              item.description.toLowerCase().indexOf(filterKeyLowerCase) > -1
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
    this.$store.commit('currentPage/setRootPath', 'access-manager-types');
    this.$store.dispatch('accessManagerTypes/getAccessManagerTypes', {});
    this.$store.dispatch('organizations/getOrganizations', {});
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'typename',
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
      this.$router.push(`/app/access-manager-types/${page}`);
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
      this.$store.dispatch('accessManagerTypes/getAccessManagerTypes', {
        refresh: true,
      });
    },
  },
};
</script>
