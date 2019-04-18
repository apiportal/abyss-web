<template>
  <div class="page-container page-my-apis">
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
            :to="`/app/identity-managers/${page}/add-new`"
            v-b-tooltip.hover 
            title="Add"
            variant="primary"
            class="page-btn-add"
            block
            data-qa="btnAddNew"
          >
            <span>Add New</span>
            <Icon icon="plus" />
          </b-button>
        </div>
      </div>
    </div>
    <div class="page-content">
      <Subscriptions
        :rows="paginatedRows"
        :routePath="`/app/my-apis/my-subscriptions/${page}`"
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
          .filter(item => item.resourceactionid === 'c5639f00-94c9-4cc9-8ad9-df76f9d162a8' && !item.isdeleted)
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
