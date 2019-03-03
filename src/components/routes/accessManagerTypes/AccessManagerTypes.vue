<template>
  <div class="access-manager-types-container">
    <div class="access-manager-types-header silver-bg">
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
            :to="`/app/access-manager-types/${page}/add-new`"
            variant="primary"
            block
          >
            <span>Add</span>
          </b-button>
        </div>
      </div>
    </div>
    <div class="access-manager-types-content">
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>
              Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="typename"
                sortByKeyType="string"
              />
            </th>
            <th>
              Description
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="description"
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
          :cols="3"
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
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="4">
              <div class="collapsible-content">
                <b-navbar toggleable="lg" type="dark" variant="secondary">
                  <b-navbar-brand>{{ item.typename }}</b-navbar-brand>

                  <b-navbar-toggle target="nav_collapse" />

                  <b-collapse is-nav id="nav_collapse">
                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">

                      <b-nav-item-dropdown right>
                        <!-- Using button-content slot -->
                        <template slot="button-content">
                          <Icon icon="cog" />
                          <em>Operations</em>
                        </template>
                        <b-dropdown-item :to="`/app/access-manager-types/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
                        <b-dropdown-item :to="`/app/access-manager-types/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>
                      </b-nav-item-dropdown>

                    </b-navbar-nav>
                  </b-collapse>
                </b-navbar>
                <div style="margin: 2rem;">
                  <p>Name: {{ item.typename }}</p>
                  <p>Description: {{ item.description }}</p>
                  <p>Organization: {{ item.organizationname }}</p>
                  <p>Created: {{ item.created }}</p>
                  <p>Updated: {{ item.updated }}</p>
                  <p>Deleted: {{ item.deleted }}</p>
                </div>
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
        <router-view></router-view>
      </table>
    </div>
    <div class="access-manager-types-footer" v-if="tableRows.length > itemsPerPage">
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
        this.collapsedRows.push(itemId);
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

<style lang="scss" scoped>
.access-manager-types-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .access-manager-types-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .access-manager-types-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }

  .access-manager-types-content {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }
}
</style>
