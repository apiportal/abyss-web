<template>
  <div class="organizations-container">
    <div class="organizations-header silver-bg">
      <div class="row">
        <div class="col-md-10">
          <InputWithIcon
            :prepend="{ icon: 'filter' }"
            placeholder="Type to filter"
            :onKeyup="handleFilterKeyup"
          />
        </div>
        <div class="col-md-2">
          <b-button
            :to="`/app/organizations/${page}/add-new`"
            variant="primary"
            block
          >
            <span>Add</span>
          </b-button>
        </div>
      </div>
    </div>
    <div class="organizations-content">
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>
              Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="name"
                sortByKeyType="string"
              />
            </th>
            <th>
              Parent Organization
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="organizationname"
                sortByKeyType="string"
              />
            </th>
            <th>
              Sub Organizations
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="suborganizations"
                sortByKeyType="number"
              />
            </th>
            <th>
              Users
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="organizationusers"
                sortByKeyType="number"
              />
            </th>
            <th>
              Url
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="url"
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
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(item, index) in paginatedRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.name }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.suborganizations }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationusers }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.url }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.description }}
            </td>
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="6">
              <div class="collapsible-content">
                <Organization
                  :organizations="tableRows"
                  :organization="item"
                  :rootorganization="rootOrganization"
                  :page="page"
                />
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
        <router-view></router-view>
      </table>
    </div>
    <div class="organizations-footer">
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
import Organization from '@/components/routes/organizations/Organization';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Helpers from '@/helpers';

export default {
  components: {
    Organization,
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
  },
  computed: {
    ...mapState({
      organizations: state => state.organizations.items,
      users: state => state.users.items,
    }),
    tableRows() {
      const { organizations, users } = this;
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const getSubOrganizations = (organizationId) => {
        const subOrganizations = organizations.filter(
          item => item.organizationid === organizationId);
        return subOrganizations;
      };
      const getOrganizationUsers = (organizationId) => {
        const organizationUsers = users.filter(item => item.organizationid === organizationId);
        return organizationUsers;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: organizations.map(item => ({
          ...item,
          organizationname: getOrganizationName(item.organizationid),
          suborganizations: getSubOrganizations(item.uuid).length,
          organizationusers: getOrganizationUsers(item.uuid).length,
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.name &&
              item.name.toLowerCase().indexOf(filterKeyLowerCase) > -1
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
    this.$store.commit('currentPage/setRootPath', 'organizations');
    this.$store.dispatch('organizations/getOrganizations');
    this.$store.dispatch('users/getUsers');
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'name',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      filterKey: '',
      rootOrganization: '3c65fafc-8f3a-4243-9c4e-2821aa32d293',
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
      this.$router.push(`/app/organizations/${page}`);
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.organizations-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .organizations-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .organizations-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }

  .organizations-content {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }
}
</style>
