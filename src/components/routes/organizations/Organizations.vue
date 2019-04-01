<template>
  <div class="page-container page-organizations">

    <div class="page-header">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="true">
          <span id="IdLinkOrganizations" class="link-text">Organizations</span> <b-badge pill>{{ organizations.length }}</b-badge>
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
            id="IdBtnRefresh"
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
            id="IdBtnAddNew"
          >
            <span class="btn-text">Add New</span>
            <Icon icon="plus" />
          </b-button>
        </div>
      </div>
    </div>

    <div class="page-content">
      <Organizations
        :organizations="paginatedRows"
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
      isLoading: state => state.traffic.isLoading,
      organizations: state => state.organizations.items,
      rootOrganization: state => state.organizations.rootOrganization,
      subjectOrganizations: state => state.subjectOrganizations.items,
      users: state => state.users.items,
    }),
    tableRows() {
      const { organizations, subjectOrganizations } = this;
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const getSubOrganizations = (organizationId) => {
        const subOrganizations = organizations
          .filter(item => item.organizationid === organizationId);
        return subOrganizations.map(item => item.uuid);
      };
      const getOrganizationUsers = (organizationId) => {
        const organizationSubjects = subjectOrganizations
          .filter(item => item.organizationrefid === organizationId);
        return organizationSubjects.map(item => item.subjectid);
      };
      const getOwner = (organizationId) => {
        const { users } = this;
        const ownerSubject = getOrganizationUsers(organizationId).find(item => item.isowner);
        if (ownerSubject) {
          const owner = users.find(item => item.uuid === ownerSubject.subjectid);
          if (owner) {
            return owner.displayname;
          }
        }
        return '-';
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: organizations.map(item => ({
          ...item,
          organizationname: getOrganizationName(item.organizationid),
          suborganizations: getSubOrganizations(item.uuid),
          organizationusers: getOrganizationUsers(item.uuid),
          organizationowner: getOwner(item.uuid),
        }))
        .filter((item) => {
          const { rootOrganization } = this;
          const { organizationid } = item;
          return (organizationid === rootOrganization);
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
    this.$store.dispatch('subjectOrganizations/getSubjectOrganizations', {});
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
