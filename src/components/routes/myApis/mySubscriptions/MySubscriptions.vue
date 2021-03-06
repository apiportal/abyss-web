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
            :to="`/app/my-apis/my-subscriptions/${page}/add-new-api`"
            v-b-tooltip.hover
            title="Add New Business API"
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
      <Proxies
        :rows="tableRows"
        :routePath="`/app/my-apis/my-subscriptions/${page}`"
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
import InputWithIcon from '@/components/shared/InputWithIcon';
import Proxies from '@/components/shared/subjects/proxies/Proxies';
import Icon from '@/components/shared/Icon';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Proxies,
    Icon,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      contracts: state => state.userContracts.userApiContracts,
      proxies: state => state.proxies.items,
    }),
    contractRows() {
      const contracts = this.contracts.filter(item => !item.isdeleted);
      const contractApis = this.proxies.filter(el =>
        contracts.some(f =>
          f.apiid === el.uuid,
        ),
      );
      return contractApis;
    },
    tableRows() {
      const { contractRows, sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: contractRows
          .map(item => ({
            ...item,
          }))
          .filter((item) => {
            const { filterKey } = this;
            if (filterKey === '') {
              return true;
            }
            const filterKeyLowerCase = filterKey.toLowerCase();
            return (
              item.openapidocument.info.title &&
              item.openapidocument.info.title.toLowerCase().indexOf(filterKeyLowerCase) > -1
            );
          }),
        sortByKey,
        sortByKeyType,
        sortDirection,
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
      this.$store.dispatch('proxies/getProxies', {
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
