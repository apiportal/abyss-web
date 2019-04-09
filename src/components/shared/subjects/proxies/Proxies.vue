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
              text="Proxy Api Name"
              sortByKey="openapidocument.info.title"
              sortByKeyType="string"
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
              text="Contracts"
              sortByKey="contractscount"
              sortByKeyType="number"
            />
          </th>
          <th></th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="7"
      />
      <TbodyCollapsible
        v-for="(proxyItem, proxyIndex) in tableRows" v-bind:key="proxyIndex"
        :isCollapsed="collapsedRows.indexOf(proxyItem.uuid) > -1"
        :level="1"
      >
        <tr id="IdTableRow" slot="main" :class="`${proxyIndex % 2 === 0 ? 'odd' : 'even'} ${proxyItem.isdeleted ? 'is-deleted' : ''}`">
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.openapidocument.info.title }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ environment(proxyItem) }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.version }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.apistatename }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.apivisibilityname }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.contractscount }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!proxyItem.isdeleted">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item :to="`${routePath}/logs/${proxyItem.uuid}/api/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ proxyItem.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(proxyItem.uuid) > -1">
          <td colspan="7">
            <div class="collapsible-content">
              <Proxy
                :item="proxyItem"
                :routePath="routePath"
                childComponent="Licenses"
              ></Proxy>
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Icon from '@/components/shared/Icon';
import Proxy from '@/components/shared/subjects/proxies/Proxy';
import SortBy from '@/components/shared/SortBy';
import Helpers from '@/helpers';

export default {
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
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection, rows } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: rows
          .map(item => ({
            ...item,
          })),
        sortByKey,
        sortByKeyType,
        sortDirection,
      });
    },
  },
  components: {
    TbodyCollapsible,
    TBodyLoading,
    Icon,
    SortBy,
    Proxy,
  },
  data() {
    return {
      collapsedRows: [],
      proxyRows: [],
      sortByKey: 'openapidocument.info.title',
      sortByKeyType: 'string',
      sortDirection: 'desc',
    };
  },
  watch: {
    tableRows(newVal, oldVal) {
      console.log('newVal, oldVal: ',newVal, oldVal); // eslint-disable-line
      const contractApis = newVal;
      if (newVal.length !== oldVal.length) {
        this.getApiContracts(contractApis);
      }
    },
  },
  created() {
    this.getApiContracts(this.tableRows);
  },
  methods: {
    getApiContracts(newVal) {
      console.log('newVal: ', newVal); // eslint-disable-line
      const contractApis = newVal;
      for (let i = 0; i < contractApis.length; i += 1) {
        api.getApiContracts(contractApis[i].uuid).then((res) => {
          if (res && res.data) {
            contractApis[i].contracts = res.data;
            contractApis[i].contractscount = res.data.length;
          }
        })
        .catch((error) => {
          if (error.status === 404) {
            contractApis[i].contracts = [];
            contractApis[i].contractscount = 0;
          }
        });
      }
    },
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
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>