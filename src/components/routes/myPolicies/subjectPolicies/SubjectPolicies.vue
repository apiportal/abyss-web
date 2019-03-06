<template>
  <div class="subject-licenses-container">
    <div class="subject-licenses-header">
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
            :to="`/app/my-policies/my-policies/${page}/add-new`"
            variant="primary"
            block
          >
            <Icon icon="plus" /> Add
          </b-button>
        </div>
      </div>
    </div>
    <div class="subject-licenses-content">
      <Policies
        :rows="paginatedRows"
        :routePath="`/app/my-policies/my-policies/${page}`"
      />
      <router-view></router-view>
    </div>
    <div class="subject-licenses-footer" v-if="tableRows.length > itemsPerPage">
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
/* eslint-disable */
import { mapState } from 'vuex';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Policies from '@/components/shared/subjects/policies/Policies';
import Icon from '@/components/shared/Icon';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Policies,
    Icon,
  },
  computed: {
    ...mapState({
      policies: state => state.policies.items,
      policyTypes: state => state.policyTypes.items,
      currentUser: state => state.user,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      const { policies, policyTypes, currentUser } = this;
      const getTypeName = (typeId) => {
        const type = policyTypes.find(policyType => policyType.uuid === typeId);
        return type ? type.name : typeId;
      };
      return sortArrayOfObjects({
        array: policies
        .filter((item) => {
          const { filterKey } = this;
          if (item.subjectid === currentUser.uuid && !item.isdeleted) {
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
          }
          return '';
        },
          )
          .map(item => ({
            ...item,
            typename: getTypeName(item.typeid),
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
      this.$router.push(`/app/my-policies/my-policies/${page}`);
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    refreshData() {
      this.$store.dispatch('policies/getPolicies', {
        refresh: true,
      });
    },
  },
};
</script>

<style lang="scss">
.subject-licenses-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .subject-licenses-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .subject-licenses-content {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }

  .subject-licenses-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }
}
</style>