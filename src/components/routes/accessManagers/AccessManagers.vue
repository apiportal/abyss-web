<template>
  <div class="access-managers-container">
    <div class="access-managers-header silver-bg">
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
            :to="`/app/access-managers/${page}/add-new`"
            variant="primary"
            block
          >
            <span>Add</span>
          </b-button>
        </div>
      </div>
    </div>
    <div class="access-managers-content">
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
              Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="accessmanagername"
                sortByKeyType="string"
              />
            </th>
            <th>
              Access Manager Type
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="accessmanagertypename"
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
          v-for="(item, index) in tableRows" v-bind:key="index"
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
              {{ item.accessmanagername }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.accessmanagertypename }}
            </td>
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="3">
              <div class="collapsible-content">
                <b-navbar toggleable="lg" type="dark" variant="secondary">
                  <b-navbar-brand>{{ item.accessmanagername }}</b-navbar-brand>

                  <b-navbar-toggle target="nav_collapse" />

                  <b-collapse is-nav id="nav_collapse">
                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">

                      <b-nav-item-dropdown right>
                        <!-- Using button-content slot -->
                        <template slot="button-content">
                          <Icon icon="list-ol" />
                          <em>Logs</em>
                        </template>
                        <b-dropdown-item :to="`/app/access-managers/${page}/logs/${item.uuid}/accessmanager/1`">All</b-dropdown-item>
                      </b-nav-item-dropdown>

                      <b-nav-item-dropdown right>
                        <!-- Using button-content slot -->
                        <template slot="button-content">
                          <Icon icon="cog" />
                          <em>Operations</em>
                        </template>
                        <b-dropdown-item :to="`/app/access-managers/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
                        <b-dropdown-item :to="`/app/access-managers/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>
                      </b-nav-item-dropdown>

                    </b-navbar-nav>
                  </b-collapse>
                </b-navbar>
                <div style="margin: 2rem">
                  <div class="row">
                    <dl class="col">
                      <dt>Name:</dt>
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
    <div class="access-managers-footer" v-if="tableRows.length > itemsPerPage">
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
      accessManagers: state => state.accessManagers.items,
      accessManagerTypes: state => state.accessManagerTypes.items,
      organizations: state => state.organizations.items,
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
        this.collapsedRows.push(itemId);
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

<style lang="scss" scoped>
.access-managers-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .access-managers-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .access-managers-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }

  .access-managers-content {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }
}
</style>
