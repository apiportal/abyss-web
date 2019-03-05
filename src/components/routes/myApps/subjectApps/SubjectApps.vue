<template>
  <div class="subject-apps-container">
    <div class="subject-apps-header">
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
            :to="`/app/my-apps/my-apps/${page}/add-new`"
            variant="primary"
            block
          >
            Add
          </b-button>
        </div>
      </div>
    </div>
    <div class="subject-apps-content">
      <Apps
        :rows="paginatedRows"
        :routePath="`/app/my-apps/my-apps/${page}`"
      />
      <router-view></router-view>
    </div>
    <div class="subject-apps-footer" v-if="tableRows.length > itemsPerPage">
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

<style lang="scss">
.subject-apps-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .subject-apps-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .subject-apps-content {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }

  .subject-apps-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }
}
</style>