<template>
  <div class="identity-managers-container">
    <div class="identity-managers-header silver-bg">
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
            :to="`/app/administer-users/${page}/add-new`"
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
              First Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="firstname"
                sortByKeyType="string"
              />
            </th>
            <th>
              Last Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="lastname"
                sortByKeyType="string"
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
              User Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="subjectname"
                sortByKeyType="string"
              />
            </th>
            <th>
              E-mail
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="email"
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
        <TbodyCollapsible
          v-for="(item, index) in paginatedRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              <Icon 
                :icon="item.isactivated ? 'check-circle' : 'times-circle'" 
                :class="item.isactivated ? 'text-success' : 'text-danger'"
              />
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.firstname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.lastname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.displayname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.subjectname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.email }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
          </tr>
          <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
            <td colspan="7">
              <div class="collapsible-content">
                <AdministerUser
                  :user="item"
                  :groups="groups"
                  :page="page"
                />
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
      <router-view></router-view>
    </div>
    <div class="identity-managers-footer" v-if="totalRows.length > 0">
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
import AdministerUser from '@/components/routes/administerUsers/AdministerUser';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Helpers from '@/helpers';

export default {
  components: {
    AdministerUser,
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
  },
  computed: {
    ...mapState({
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
      users: state => state.users.items,
      groups: state => state.groups.items,
    }),
    totalRows() {
      const { subjectDirectories, organizations, users } = this;
      const getDirectoryName = (subjectdirectoryid) => {
        const directory = subjectDirectories.find(item => item.uuid === subjectdirectoryid);
        return directory ? directory.directoryname : subjectdirectoryid;
      };
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: users.map(item => ({
          ...item,
          directoryname: getDirectoryName(item.subjectdirectoryid),
          organizationname: getOrganizationName(item.organizationid),
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
    this.$store.commit('currentPage/setRootPath', 'administer-users');
    this.$store.dispatch('subjectDirectories/getSubjectDirectories');
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes');
    this.$store.dispatch('organizations/getOrganizations');
    this.$store.dispatch('users/getUsers');
    this.$store.dispatch('groups/getGroups');
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
      this.$router.push(`/app/administer-users/${page}`);
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