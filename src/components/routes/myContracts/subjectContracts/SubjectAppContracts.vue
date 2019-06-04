<template>
  <div class="page-container my-contracts">
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
      </div>
    </div>
    <div class="page-content">
      <Contracts
        :rows="tableRows"
        :routePath="`/app/my-contracts/app-contracts/${page}`"
        :isMineApi="false"
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
      >
      </b-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import Contracts from '@/components/shared/subjects/contracts/Contracts';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Icon,
    Contracts,
  },
  computed: {
    ...mapState({
      userAppContracts: state => state.userContracts.userAppContracts,
      currentUser: state => state.user,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      const { userAppContracts } = this;

      return sortArrayOfObjects({
        array: userAppContracts
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
              item.typename &&
              item.typename.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.policyinstance.info.subType &&
              item.policyinstance.info.subType.toLowerCase().indexOf(filterKeyLowerCase) > -1
            )
          );
        })
        .map(item => ({
          ...item,
          // typename: getTypeName(item.typeid),
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
    };
  },
  methods: {
    handleFilterKeyup({ value }) {
      this.filterKey = value;
    },
    handlePageChange(page) {
      this.$router.push(`/app/my-contracts/app-contracts/${page}`);
    },
    refreshData() {
      this.$store.dispatch('userContracts/getUserAppContracts', {
        uuid: this.currentUser.uuid,
        refresh: true,
      });
    },
  },
  created() {
    this.$store.commit('currentPage/setFirstChildPath', 'app-contracts');
  },
};
</script>