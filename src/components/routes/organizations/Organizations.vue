<template>
  <div class="page-container page-organizations">

    <div class="page-header">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="true">
          <span class="link-text" data-qa="linkOrganizations">Organizations</span> <b-badge pill>{{ tableRows.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="false" to="/app/administer-users/users/1">
          <span class="link-text" data-qa="linkUsers">Users</span> <b-badge pill>{{ users.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="false" to="/app/administer-groups/1">
          <span class="link-text" data-qa="linkGroups">Groups</span> <b-badge pill>{{ groups.length }}</b-badge>
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
            data-qa="btnRefresh"
          >
            <Icon icon="redo" />
          </b-button>
        </div>
        <div class="col-auto">
          <b-button
            :to="`/app/organizations/${page}/add-new`"
            variant="primary"
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
      <Organizations
        :rows="tableRows.filter(item => item.uuid === item.organizationid)"
        :organizations="tableRows"
        :itemsPerPage="itemsPerPage"
        :page="page"
        :routePath="`/app/organizations/${page}`"
      />
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
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import Helpers from '@/helpers';

export default {
  components: {
    Organizations: () => import('@/components/shared/subjects/organizations/Organizations'),
    InputWithIcon,
    Icon,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      isLoading: state => state.traffic.isLoading,
      organizations: state => state.organizations.items,
      subjectOrganizations: state => state.subjectOrganizations.items,
      users: state => state.users.items,
      groups: state => state.groups.items,
    }),
    tableRows() {
      const { organizations, subjectOrganizations } = this;
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const getSubOrganizations = (organizationId) => {
      // const getSubOrganizations = (obj) => {
        const subOrganizations = organizations
          // .filter(item => item.organizationid === obj.uuid
          .filter(item => item.organizationid === organizationId
            && item.organizationid !== item.uuid);
        // return subOrganizations.map(item => item.uuid);
        return subOrganizations;
      };
      const getOrganizationUsers = (organizationId) => {
        const organizationSubjects = subjectOrganizations
          .filter(item => item.organizationrefid === organizationId);
        // return organizationSubjects.map(item => item.subjectid);
        return organizationSubjects;
      };
      const getOwner = (organizationId) => {
        const { users } = this;
        const ownerSubject = getOrganizationUsers(organizationId).find(item => item.isowner);
        if (ownerSubject) {
          const owner = users.find(item => item.uuid === ownerSubject.subjectid);
          if (owner) {
            return owner;
          }
        }
        return false;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: organizations.map(item => ({
          ...item,
          organizationname: getOrganizationName(item.organizationid),
          // suborganizations: getSubOrganizations(item),
          suborganizations: getSubOrganizations(item.uuid),
          suborganizationscount: getSubOrganizations(item.uuid).length,
          organizationusers: getOrganizationUsers(item.uuid),
          organizationowner: getOwner(item.uuid).displayname,
          organizationownerid: getOwner(item.uuid).uuid,
          isorganizationowner: Boolean(getOwner(item.uuid)),
        }))
        // .filter((item) => {
        //   const { currentUser } = this;
        //   const { organizationid } = item;
        //   return (organizationid === currentUser.organizationid);
        // })
        .filter((item) => {
          const { currentUser } = this;
          return item.organizationusers.some(f =>
            f.subjectid === currentUser.uuid,
          );
        })
        .filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.name &&
              item.name.toLowerCase().indexOf(filterKeyLowerCase) > -1
            )
            ||
            (
              item.organizationowner &&
              item.organizationowner.toLowerCase().indexOf(filterKeyLowerCase) > -1
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
        array: tableRows.filter(item => item.uuid === item.organizationid),
        itemsPerPage,
        page,
      });
    },
  },
  created() {
    this.$store.commit('currentPage/setRootPath', 'organizations');
    // this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('subjectOrganizations/getSubjectOrganizations', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('groups/getGroups', {});
  },
  mounted() {
    this.isMounted = true;
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'name',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      filterKey: '',
      collapsedRows: [],
      itemsPerPage: 20,
      isMounted: false,
    };
  },
  methods: {
    handleFilterKeyup({ value }) {
      this.filterKey = value;
    },
    handlePageChange(page) {
      this.$router.push(`/app/organizations/${page}`);
    },
    refreshData() {
      this.$store.dispatch('organizations/getOrganizations', {
        refresh: true,
      });
    },
  },
};
</script>
