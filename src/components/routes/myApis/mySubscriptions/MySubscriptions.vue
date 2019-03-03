<template>
  <div class="businesses-container">
    <div class="businesses-header">
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
            v-b-tooltip.hover 
            title="Add"
            variant="primary"
            block
          >
            <Icon icon="plus" /> Add
          </b-button>
        </div>
      </div>
    </div>
    <div class="businesses-content">
      <Subscriptions
        :rows="paginatedRows"
        :routePath="`/app/my-apis/my-subscriptions/${page}`"
      />
      <router-view></router-view>
    </div>
    <div class="businesses-footer">
      <b-pagination 
        size="md"
        :total-rows="tableRows.length"
        v-model="page" 
        :per-page="20"
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
import Subscriptions from '@/components/shared/subjects/subscriptions/Subscriptions';
import Icon from '@/components/shared/Icon';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Subscriptions,
    Icon,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      apiSubscriptions: state => state.apiSubscriptions.items,
      resourceActions: state => state.resourceActions.items,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      const { apiSubscriptions, resourceActions } = this;
      const getResourceActionName = (resourceActionId) => {
        const resourceAction = resourceActions.find(item => item.uuid === resourceActionId);
        return resourceAction ? resourceAction.actionname : resourceActionId;
      };
      return sortArrayOfObjects({
        array: apiSubscriptions
          .map(item => ({
            ...item,
            resourceactionname: getResourceActionName(item.resourceactionid),
          }))
          .filter((item) => {
            const { filterKey } = this;
            if (filterKey === '') {
              return true;
            }
            const filterKeyLowerCase = filterKey.toLowerCase();
            return (
              (
                item.openapidocument.info.title &&
                item.openapidocument.info.title.toLowerCase().indexOf(filterKeyLowerCase) > -1
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
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'created',
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
      this.$router.push(`/app/my-apis/my-subscriptions/${page}`);
    },
    refreshData() {
      this.$store.dispatch('apiSubscriptions/getApiSubscriptions', {
        uuid: this.currentUser.uuid,
        refresh: true,
      });
    },
  },
  created() {
    this.$store.commit('currentPage/setFirstChildPath', 'my-subscriptions');
  },
};
</script>

<style lang="scss">
.businesses-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .businesses-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .businesses-content {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }

  .businesses-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }
}
</style>