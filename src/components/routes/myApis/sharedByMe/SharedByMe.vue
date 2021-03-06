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
            :to="`/app/my-apis/shared-by-me/${page}/add-new-api`"
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
        :routePath="`/app/my-apis/shared-by-me/${page}`"
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
      apisSharedByUser: state => state.apisSharedByUser.items,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      const { apisSharedByUser } = this;
      return sortArrayOfObjects({
        array: apisSharedByUser
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
      this.$router.push(`/app/my-apis/shared-by-me/${page}`);
    },
    refreshData() {
      this.$store.dispatch('apisSharedByUser/getApisSharedByUser', {
        uuid: this.currentUser.uuid,
        refresh: true,
      });
    },
  },
  created() {
    this.$store.commit('currentPage/setFirstChildPath', 'shared-by-me');
  },
};
</script>
