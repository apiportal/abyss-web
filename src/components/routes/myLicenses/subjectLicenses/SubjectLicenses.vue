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
            data-qa="btnRefresh"
          >
            <Icon icon="redo" />
          </b-button>
        </div>
        <div class="col-auto">
          <b-button
            :to="`/app/my-licenses/my-licenses/${page}/add-new`"
            variant="primary"
            v-b-tooltip.hover
            title="Add New License"
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
      <Licenses
        :rows="tableRows"
        :routePath="`/app/my-licenses/my-licenses/${page}`"
        :itemsPerPage="itemsPerPage"
        :page="page"
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
        data-qa="footerPagination"
      >
      </b-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Licenses from '@/components/shared/subjects/licenses/Licenses';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import Helpers from '@/helpers';

export default {
  components: {
    Licenses,
    InputWithIcon,
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
    refreshData() {
      this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid, refresh: true });
    },
  },
  created() {
    this.$store.commit('currentPage/setFirstChildPath', 'my-licenses');
  },
};
</script>
