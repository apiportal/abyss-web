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
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Licenses"
              sortByKey="licensescount"
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
          <th v-if="currentPage.firstChildPath === 'shared-with-me'">
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Owner"
              sortByKey="owner.name"
              sortByKeyType="string"
            />
          </th>
          <th></th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="10"
      />
      <TbodyCollapsible
        v-for="(proxyItem, proxyIndex) in paginatedRows" v-bind:key="proxyIndex"
        :isCollapsed="collapsedRows.indexOf(proxyItem.uuid) > -1"
        :level="1"
      >
        <tr slot="main" :class="`${proxyIndex % 2 === 0 ? 'odd' : 'even'} ${proxyItem.isdeleted ? 'is-deleted' : ''}`" :data-qa="`tableRow-${proxyIndex}`">
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)" :data-qa="`tableRowName-${proxyIndex}`">
            {{ proxyItem.openapidocument.info.title }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.version }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.apistatename }} - {{ environment(proxyItem) }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.apivisibilityname }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)" class="number">
            {{ proxyItem.contractscount }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)" class="number">
            {{ proxyItem.licensescount }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.updated | moment("DD.MM.YYYY HH:mm") }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)" v-if="currentPage.firstChildPath === 'shared-with-me'">
            {{ proxyItem.owner.name }}
          </td>
          <td class="actions" v-if="routePath !== '/app/explore/'">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!proxyItem.isdeleted" data-qa="dropDownActions">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item data-qa="IdBtnEditApi" :to="`${routePath}/edit-api/${proxyItem.uuid}`"><Icon icon="edit" /> Edit API</b-dropdown-item>

              <b-dropdown-item data-qa="IdBtnEditApiLicenses" :to="`${routePath}/edit-api-licenses/${proxyItem.uuid}`"><Icon icon="certificate" /> Add/Edit API Licenses</b-dropdown-item>

              <b-dropdown-item data-qa="IdBtnEditLifeCycle" :to="`${routePath}/edit-api-lifecycle/${proxyItem.uuid}`"><Icon icon="bezier-curve" /> Edit API Life Cycle</b-dropdown-item>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item :to="`${routePath}/logs/${proxyItem.uuid}/api/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ proxyItem.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
          <td class="actions" v-else></td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(proxyItem.uuid) > -1">
          <td colspan="10">
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
      currentUser: state => state.user,
      currentPage: state => state.currentPage,
      users: state => state.users.items,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      licenses: state => state.subjectLicenses.items,
      contracts: state => state.userContracts.items,
      apiLicenses: state => state.apiLicenses.items,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection, rows, users,
        apiStates, apiVisibilityTypes } = this;
      const { sortArrayOfObjects } = Helpers;
      const getApiOwner = (apiItem) => {
        const apiOwner = users.find(item => item.uuid === apiItem.subjectid);
        // return apiOwner || {};
        return {
          name: apiOwner.displayname,
          uuid: apiOwner.uuid,
        };
      };
      const getApiStateName = (apistateid) => {
        const apiState = apiStates.find(item => item.uuid === apistateid);
        return apiState ? apiState.name : apistateid;
      };
      const getApiVisibilityName = (apivisibilityid) => {
        const apiVisibility = apiVisibilityTypes.find(item => item.uuid === apivisibilityid);
        return apiVisibility ? apiVisibility.name : apivisibilityid;
      };
      const getApiLicenses = (id) => {
        const apiLicensesApis = this.apiLicenses
        .filter(item => item.apiid === id && !item.isdeleted);
        const apiLicenses = this.licenses.filter(el =>
          apiLicensesApis.some(f =>
            f.licenseid === el.uuid,
          ),
        );
        return apiLicenses;
      };
      const getProxyContracts = (id) => {
        const proxyContracts = this.contracts
        .filter(item => item.apiid === id && !item.isdeleted);
        return proxyContracts;
      };
      return sortArrayOfObjects({
        array: rows
          .map(item => ({
            ...item,
            apistatename: getApiStateName(item.apistateid),
            apivisibilityname: getApiVisibilityName(item.apivisibilityid),
            owner: getApiOwner(item),
            licenses: getApiLicenses(item.uuid),
            licensescount: getApiLicenses(item.uuid).length,
            contracts: getProxyContracts(item.uuid),
            contractscount: getProxyContracts(item.uuid).length,
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
      sortByKey: 'updated',
      sortByKeyType: 'string',
      sortDirection: 'asc',
    };
  },
  mounted() {
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
    this.$store.dispatch('userContracts/getUserContracts', { uuid: this.currentUser.uuid });
    this.$store.dispatch('apiLicenses/getApiLicensesRefs', {});
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
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>