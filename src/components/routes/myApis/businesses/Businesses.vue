<template>
  <div class="businesses-container">
    <div class="businesses-header">
      <div class="row">
        <div class="col-md-10">
          <InputWithIcon
            :prepend="{ icon: 'filter' }"
            placeholder="Type to filter"
            :onKeyup="handleFilterKeyup"
          />
        </div>
        <div class="col-md-2">
          <b-button
            :to="`/app/identity-managers/${page}/add-new`"
            variant="primary"
            block
          >
            Add
          </b-button>
        </div>
      </div>
    </div>
    <div class="businesses-content">
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>Api Name</th>
            <th>Version</th>
            <th>State</th>
            <th>Visibility</th>
            <th># of Proxies</th>
            <th>Status</th>
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(item, index) in tableRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.openapidocument.info.title }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.version }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.apistatename }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.apivisibilityname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.numberofproxies }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              <Icon :icon="item.islive ? 'check-circle' : 'times-circle'" :class="item.islive ? 'text-success' : 'text-danger'" />
            </td>
          </tr>
          <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
            <td colspan="6">
              <div class="collapsible-content">
                <BusinessApi
                  :item="item"
                />
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
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
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import BusinessApi from '@/components/routes/myApis/businesses/BusinessApi';
import Helpers from '@/helpers';

export default {
  components: {
    TbodyCollapsible,
    InputWithIcon,
    Icon,
    BusinessApi,
  },
  computed: {
    ...mapState({
      businessApis: state => state.businessApis.items,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      businesses: state => state.businesses.items,
      proxies: state => state.proxies.items,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      const { businessApis, apiStates, apiVisibilityTypes, proxies } = this;
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
      return sortArrayOfObjects({
        array: businessApis
          .filter(item => item.isproxyapi === false)
          .map(item => ({
            ...item,
            apistatename: getApiStateName(item.apistateid),
            apivisibilityname: getApiVisibilityName(item.apivisibilityid),
            numberofproxies: getNumberOfProxies(item.uuid),
          })),
        sortByKey,
        sortByKeyType,
        sortDirection,
      });
    },
    paginatedRows() {
      const { totalRows, itemsPerPage, page } = this;
      const { paginateArray } = Helpers;
      return paginateArray({
        array: totalRows,
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
    handleFilterKeyup() {
      console.log('filter');
    },
    handlePageChange(page) {
      this.$router.push(`/app/my-apis/businesses/${page}`);
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
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
    overflow-y: auto;
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