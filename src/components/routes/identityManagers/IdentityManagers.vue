<template>
  <div class="identity-managers-container">
    <div class="identity-managers-header silver-bg">
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
            :to="`/app/identity-managers/${page}/add-new`"
            variant="primary"
            block
          >
            Add
          </b-button>
        </div>
      </div>
    </div>
    <div class="identity-managers-content">
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>
              Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="directoryname"
                sortByKeyType="string"
              />
            </th>
            <th>
              Priority Order
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="directorypriorityorder"
                sortByKeyType="number"
              />
            </th>
            <th>
              Directory Type
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="directorytypename"
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
            <th>
              Status
            </th>
          </tr>
        </thead>
        <TBodyLoading
          v-if="isLoading && tableRows.length === 0"
          :cols="5"
        />
        <TbodyCollapsible
          v-for="(item, index) in paginatedRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.directoryname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.directorypriorityorder }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.directorytypename }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              <Icon :icon="item.isactive ? 'check-circle' : 'times-circle'" :class="item.isactive ? 'text-success' : 'text-danger'" />
            </td>
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="5">
              <div class="collapsible-content">
                <b-navbar toggleable="lg" type="dark" variant="secondary">
                  <b-navbar-brand>{{ item.directoryname }}</b-navbar-brand>

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
                        <b-dropdown-item :to="`/app/identity-managers/${page}/logs/${item.uuid}/subjectdirectory/1`">All</b-dropdown-item>
                      </b-nav-item-dropdown>

                      <b-nav-item-dropdown right>
                        <!-- Using button-content slot -->
                        <template slot="button-content">
                          <Icon icon="cog" />
                          <em>Operations</em>
                        </template>
                        <b-dropdown-item :to="`/app/identity-managers/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
                        <b-dropdown-item :to="`/app/identity-managers/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>
                      </b-nav-item-dropdown>
                      
                    </b-navbar-nav>
                  </b-collapse>
                </b-navbar>
                <div style="margin: 2rem">
                  <div class="row">
                    <dl class="col">
                      <dt>Name:</dt>
                      <dd>{{ item.directoryname }}</dd>
                      <dt>Description:</dt>
                      <dd>{{ item.description }}</dd>
                      <dt>Organization:</dt>
                      <dd>{{ item.organizationname }}</dd>
                    </dl>
                    <dl class="col">
                      <dt>Priority Order:</dt>
                      <dd>{{ item.directorypriorityorder }}</dd>
                      <dt>Directory Type:</dt>
                      <dd>{{ item.directorytypename }}</dd>
                    </dl>
                    <dl class="col">
                      <dt>Active:</dt>
                      <dd>{{ item.isactive }}</dd>
                      <dt>Template:</dt>
                      <dd>{{ item.istemplate }}</dd>
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
    <div class="identity-managers-footer" v-if="tableRows.length > itemsPerPage">
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
        this.collapsedRows.push(itemId);
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

<style lang="scss" scoped>
.identity-managers-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .identity-managers-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .identity-managers-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }

  .identity-managers-content {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }
}
</style>