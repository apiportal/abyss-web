<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Api Name"
              sortByKey="openapidocument.info.title"
              sortByKeyType="string"
              data-qa="tableHeadName"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Environment"
              sortByKey="islive"
              sortByKeyType="boolean"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Version"
              sortByKey="version"
              sortByKeyType="string"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="State"
              sortByKey="apistatename"
              sortByKeyType="string"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Visibility"
              sortByKey="apivisibilityname"
              sortByKeyType="string"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Proxies"
              sortByKey="numberofproxies"
              sortByKeyType="number"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Updated"
              sortByKey="updated"
              sortByKeyType="string"
            />
          </th>
          <th></th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="8"
      />
      <TbodyCollapsible
        v-for="(item, index) in paginatedRows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`" :data-qa="`tableRow-${index}`">
          <td @click="() => handleCollapseTableRows(item.uuid)" :data-qa="`tableRowName-${index}`">
            {{ item.openapidocument.info.title }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ environment(item) }}
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
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ item.updated | moment("DD.MM.YYYY HH:mm") }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item data-qa="btnEdit" :to="`${routePath}/edit-api/${item.uuid}`"><Icon icon="edit" /> Edit Business API</b-dropdown-item>

              <b-dropdown-item data-qa="btnDelete" :to="`${routePath}/create-proxy/${item.uuid}`"><Icon icon="file-powerpoint" /> Create Proxy API</b-dropdown-item>

              <b-dropdown-item data-qa="btnEditLifeCycle" :to="`${routePath}/edit-api-lifecycle/${item.uuid}`"><Icon icon="bezier-curve" /> Change API Lifecycle</b-dropdown-item>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item data-qa="btnLogsAll" :to="`${routePath}/logs/${item.uuid}/api/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1" data-qa="tableFooter">
          <td colspan="8">
            <div class="collapsible-content">
              <Api
                :item="item"
                :routePath="routePath"
              ></Api>
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Api from '@/components/shared/subjects/apis/Api';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import Helpers from '@/helpers';

export default {
  name: 'Apis',
  props: {
    rows: {
      type: Array,
      required: false,
      default() { return []; },
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
    page: {
      Type: Number,
      required: false,
      default() { return 1; },
    },
    itemsPerPage: {
      Type: Number,
      required: false,
      default() { return 2000; },
    },
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      proxies: state => state.proxies.items,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection, rows,
      apiStates, apiVisibilityTypes, proxies } = this;
      const { sortArrayOfObjects } = Helpers;
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
      // const businessApisIds = businessApis.map(item => item.uuid);
      return sortArrayOfObjects({
        array: rows
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
      const { tableRows, itemsPerPage, page } = this;
      const { paginateArray } = Helpers;
      return paginateArray({
        array: tableRows,
        itemsPerPage,
        page,
      });
    },
  },
  components: {
    Api,
    TbodyCollapsible,
    TBodyLoading,
    Icon,
    SortBy,
  },
  data() {
    return {
      collapsedRows: [],
      sortByKey: 'updated',
      sortByKeyType: 'string',
      sortDirection: 'asc',
    };
  },
  methods: {
    environment(item) {
      return item.islive ? 'Live' : 'Sandbox';
    },
    handleSortByClick({ sortByKey, sortByKeyType, sortDirection }) {
      this.sortByKey = sortByKey;
      this.sortByKeyType = sortByKeyType;
      this.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>