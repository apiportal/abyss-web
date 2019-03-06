<template>
  <div class="organizations-container">
    <div class="organizations-header silver-bg">
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
          </tr>
        </thead>
        <TBodyLoading
          v-if="isLoading && tableRows.length === 0"
          :cols="3"
        />
        <TbodyCollapsible
          v-for="(item, index) in paginatedRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
          v-if="item.organizationid === rootOrganization"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.name }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.suborganizations }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationusers }}
            </td>
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="3">
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
    <div class="organizations-footer" v-if="tableRows.length > itemsPerPage">
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
import TBodyLoading from '@/components/shared/TBodyLoading';
import Helpers from '@/helpers';

export default {
  components: {
    Organization,
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
      organizations: state => state.organizations.items,
      users: state => state.users.items,
      subjectOrganizations: state => state.organizations.users,
    }),
    tableRows() {
      const { organizations, subjectOrganizations } = this;
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
        const organizationSubjects = subjectOrganizations.filter(item =>
            // !item.isdeleted &&
            item.organizationrefid === organizationId);
        return organizationSubjects;
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
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('organizations/getSubjectOrganizations', {});
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
    computedMemberships() {
      const { subjectOrganizations, organizations, users } = this;
      return subjectOrganizations.map((item) => {
        const subjectuser = users.find(user => user.uuid === item.subjectid);
        const subjectorg = organizations.find(org => org.uuid === item.organizationrefid);
        return {
          org: subjectorg.name,
          org1: item.organizationrefid,
          org2: subjectorg.uuid,
          user1: item.subjectid,
          user2: subjectuser.uuid,
          user: subjectuser.displayname,
        };
      });
    },
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
    refreshData() {
      this.$store.dispatch('organizations/getOrganizations', {
        refresh: true,
      });
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
