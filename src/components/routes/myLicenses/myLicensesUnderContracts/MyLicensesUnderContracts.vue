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
            :to="`/app/my-licenses/my-licenses/${page}/add-new`"
            variant="primary"
            block
          >
            Add
          </b-button>
        </div>
      </div>
    </div>
    <div class="subject-licenses-content">
      <Licenses
        :rows="paginatedRows"
        :routePath="`/app/my-licenses/my-licenses/${page}`"
        childComponent="contracts"
      />
      <router-view></router-view>
    </div>
    <div class="subject-licenses-footer" v-if="tableRows.length > itemsPerPage">
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
      subjectLicenses: state => state.licenses.items,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      const {
        subjectLicenses,
        currentUser,
        } = this;
      return sortArrayOfObjects({
        array: subjectLicenses
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
            }
            return '';
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
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    refreshData() {
      this.$store.dispatch('licenses/getLicenses', { refresh: true });
    },
  },
  created() {
    this.$store.commit('currentPage/setFirstChildPath', 'under-contracts');
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