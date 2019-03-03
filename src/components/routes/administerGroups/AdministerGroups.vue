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
            :to="`/app/administer-groups/${page}/add-new`"
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
              Status
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="isactivated"
                sortByKeyType="boolean"
              />
            </th>
            <th>
              Display Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="displayname"
                sortByKeyType="string"
              />
            </th>
            <th>
              Group Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="subjectname"
                sortByKeyType="string"
              />
            </th>
            <th>
              Users
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="userscount"
                sortByKeyType="number"
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
          v-if="isLoading && totalRows.length === 0"
          :cols="5"
        />
        <TbodyCollapsible
          v-for="(item, index) in paginatedRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              <Icon 
                :icon="item.isactivated ? 'check-circle' : 'times-circle'" 
                :class="item.isactivated ? 'text-success' : 'text-danger'"
              />
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.displayname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.subjectname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.userscount }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="7">
              <div class="collapsible-content">
                <!-- <AdministerGroup
                  :group="item"
                  :users="users"
                  :memberships="memberships"
                  :page="page"
                /> -->
                <AdministerGroup
                  :group="item"
                  :page="page"
                />
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
      <router-view></router-view>
    </div>
    <div class="identity-managers-footer" v-if="totalRows.length > itemsPerPage">
      <b-pagination 
        size="md"
        :total-rows="totalRows.length"
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
import AdministerGroup from '@/components/routes/administerGroups/AdministerGroup';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Helpers from '@/helpers';

export default {
  components: {
    AdministerGroup,
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
      groups: state => state.groups.items,
      users: state => state.users.items,
      memberships: state => state.subjectMemberships.items,
    }),
    totalRows() {
      const { subjectDirectories, organizations, groups, users } = this;
      const getDirectoryName = (subjectdirectoryid) => {
        const directory = subjectDirectories.find(item => item.uuid === subjectdirectoryid);
        return directory ? directory.directoryname : subjectdirectoryid;
      };
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const getUsers = (groupId) => {
        const members = this.memberships.filter(item =>
          !item.isdeleted &&
          item.subjectgroupid === groupId);
        // console.log('members.length: ', members.length);
        const groupUsers = users.filter(el =>
          members.some(f =>
            f.subjectid === el.uuid,
          ),
        );
        // console.log('users.length: ', groupUsers.length);
        return groupUsers;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: groups.map(item => ({
          ...item,
          directoryname: getDirectoryName(item.subjectdirectoryid),
          organizationname: getOrganizationName(item.organizationid),
          users: getUsers(item.uuid),
          userscount: getUsers(item.uuid).length,
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.firstname &&
              item.firstname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.lastname &&
              item.lastname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.displayname &&
              item.displayname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.email &&
              item.email.toLowerCase().indexOf(filterKeyLowerCase) > -1
            )
          );
        }),
        sortByKey,
        sortByKeyType,
        sortDirection,
      });
    },
    paginatedRows() {
      const { totalRows, itemsPerPage, page } = this;
      const { paginateArray } = Helpers;
      return paginateArray({
        array: totalRows,
        itemsPerPage,
        page,
      });
    },
  },
  created() {
    this.$store.commit('currentPage/setRootPath', 'administer-groups');
    this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes', {});
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('groups/getGroups', {});
    this.$store.dispatch('subjectMemberships/getSubjectMemberships', {});
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'firstname',
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
      this.$router.push(`/app/administer-groups/${page}`);
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
      this.$store.dispatch('groups/getGroups', {
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