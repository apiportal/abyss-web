<template>
  <div class="page-container page-my-licenses">
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
            :to="`/app/my-licenses/my-licenses/${page}/add-new`"
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
      <Licenses
        :rows="paginatedRows"
        :routePath="`/app/my-licenses/my-licenses/${page}`"
        childComponent="proxies"
      ></Licenses>
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
import Licenses from '@/components/shared/subjects/licenses/Licenses';
import Icon from '@/components/shared/Icon';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Licenses,
    Icon,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      subjectLicenses: state => state.subjectLicenses.items,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection, subjectLicenses } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: subjectLicenses
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
              ) ||
              (
                item.version &&
                item.version.toLowerCase().indexOf(filterKeyLowerCase) > -1
              ) ||
              (
                item.licensedocument.info.visibility &&
                item.licensedocument.info.visibility
                .toLowerCase().indexOf(filterKeyLowerCase) > -1
              ) ||
              (
                item.licensedocument.legal.documentState &&
                item.licensedocument.legal.documentState
                .toLowerCase().indexOf(filterKeyLowerCase) > -1
              ) ||
              (
                item.created &&
                item.created.toLowerCase().indexOf(filterKeyLowerCase) > -1
              )
            );
          },
            )
          .map(item => ({
            ...item,
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
      this.$router.push(`/app/my-licenses/my-licenses/${page}`);
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    refreshData() {
      this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid, refresh: true });
    },
  },
  created() {
    this.$store.commit('currentPage/setFirstChildPath', 'attached-to-apis');
  },
};
</script>
