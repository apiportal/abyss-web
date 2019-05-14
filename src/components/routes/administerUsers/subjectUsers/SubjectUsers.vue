<template>
  <div class="page-container page-users">
    <div class="page-header">
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
            :to="`/app/administer-users/users/${page}/add-new`"
            variant="primary"
            v-b-tooltip.hover 
            title="Add New User"
            class="page-btn-add"
            block
            data-qa="btnAddNew"
          >
            <span class="btn-text">Add New</span>
            <Icon icon="plus" />
          </b-button>
        </div>
      </div>
    </div>
    <div class="page-content">
      <Users
        :rows="tableRows"
        :routePath="`/app/administer-users/users/${page}`"
        :itemsPerPage="itemsPerPage"
        :page="page"
      />
      <router-view></router-view>
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
import Users from '@/components/shared/subjects/users/Users';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import Helpers from '@/helpers';

export default {
  components: {
    Users,
    InputWithIcon,
    Icon,
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
      users: state => state.users.items,
      groups: state => state.groups.items,
    }),
    tableRows() {
      const { users } = this;
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: users.map(item => ({
          ...item,
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
  },
  created() {
    this.$store.commit('currentPage/setFirstChildPath', 'users');
    this.$store.commit('currentPage/setRootPath', 'administer-users');
    // this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    // this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes', {});
    // this.$store.dispatch('organizations/getOrganizations', {});
    // this.$store.dispatch('users/getUsers', {});
    // this.$store.dispatch('groups/getGroups', {});
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'displayname',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      filterKey: '',
      collapsedRows: [],
      itemsPerPage: 20,
    };
  },
  methods: {
    handleFilterKeyup({ value }) {
      this.filterKey = value;
    },
    handlePageChange(page) {
      this.$router.push(`/app/administer-users/users/${page}`);
    },
    refreshData() {
      this.$store.dispatch('users/getUsers', {
        refresh: true,
      });
    },
  },
};
</script>
