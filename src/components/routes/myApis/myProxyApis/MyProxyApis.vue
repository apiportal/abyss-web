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
            :to="`/app/my-apis/my-proxy-apis/${page}/add-new-api`"
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
      <Proxies
        :rows="tableRows"
        :routePath="`/app/my-apis/my-proxy-apis/${page}`"
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
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      proxies: state => state.proxies.items,
      apis: state => state.apis.items,
    }),

    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      const { proxies, apiStates, apiVisibilityTypes, apis } = this;
      const getApiStateName = (apistateid) => {
        const apiState = apiStates.find(item => item.uuid === apistateid);
        return apiState ? apiState.name : apistateid;
      };
      const getApiVisibilityName = (apivisibilityid) => {
        const apiVisibility = apiVisibilityTypes.find(item => item.uuid === apivisibilityid);
        return apiVisibility ? apiVisibility.name : apivisibilityid;
      };
      const getNumberOfProxies = apiUuid =>
        proxies.filter(proxy => proxy.businessapiid === apiUuid).length;
      const proxiesIds = proxies.map(item => item.uuid);
      return sortArrayOfObjects({
        array: apis
          .filter(item => proxiesIds.indexOf(item.uuid) > -1)
          .map(item => ({
            ...item,
            apistatename: getApiStateName(item.apistateid),
            apivisibilityname: getApiVisibilityName(item.apivisibilityid),
            numberofproxies: getNumberOfProxies(item.uuid),
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
      this.$router.push(`/app/my-apis/my-proxy-apis/${page}`);
    },
    refreshData() {
      this.$store.dispatch('proxies/getProxies', {
        uuid: this.currentUser.uuid,
        refresh: true,
      });
    },
  },
  created() {
    this.$store.commit('currentPage/setFirstChildPath', 'my-proxy-apis');
  },
};
</script>
