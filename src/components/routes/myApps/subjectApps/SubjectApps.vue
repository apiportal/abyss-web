<template>
  <div class="page-container page-my-apps">
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
          >
            <Icon icon="redo" />
          </b-button>
        </div>
        <div class="col-auto">
          <b-button
            :to="`/app/my-apps/my-apps/${page}/add-new`"
            variant="primary"
            class="page-btn-add"
            block
          >
            <span>Add New</span>
            <Icon icon="plus" />
          </b-button>
        </div>
      </div>
    </div>
    <div class="page-content">
      <Apps
        :rows="paginatedRows"
        :routePath="`/app/my-apps/my-apps/${page}`"
      />
      <router-view></router-view>
    </div>
    <div class="page-footer">
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
import Apps from '@/components/shared/subjects/apps/Apps';
import Icon from '@/components/shared/Icon';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Apps,
    Icon,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      apps: state => state.apps.items,
      subjectApps: state => state.subjectApps.items,
      organizations: state => state.organizations.items,
    }),
    userApps() {
      const { apps, subjectApps } = this;
      const subjectAppsIds = subjectApps.map(item => item.appid);
      return apps.filter(item => (subjectAppsIds.indexOf(item.uuid) > -1));
    },
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      const { userApps, organizations } = this;
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      return sortArrayOfObjects({
        array: userApps
          .filter((item) => {
            const { filterKey } = this;
            if (!item.isdeleted) {
              if (filterKey === '') {
                return true;
              }
              const filterKeyLowerCase = filterKey.toLowerCase();
              return (
                (
                  item.displayname &&
                  item.displayname.toLowerCase().indexOf(filterKeyLowerCase) > -1
                )
              );
            }
            return '';
          },
            )
          .map(item => ({
            ...item,
            organizationname: getOrganizationName(item.organizationid),
          })),
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
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'created',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      filterKey: '',
      collapsedRows: [],
      itemsPerPage: 20,
      subscriptions: {
        lastUpdated: 0,
      },
    };
  },
  methods: {
    handleFilterKeyup({ value }) {
      this.filterKey = value;
    },
    handlePageChange(page) {
      this.$router.push(`/app/my-apis/businesses/${page}`);
    },
    refreshData() {
      this.$store.dispatch('subjectApps/getSubjectApps', {
        uuid: this.currentUser.uuid,
        refresh: true,
      });
    },
  },
};
</script>
