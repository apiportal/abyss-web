<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards" v-if="isUsersLoaded">
      <thead>
        <tr>
          <th></th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Proxy Api Name"
              sortByKey="apititle"
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
          <th v-if="currentPage.firstChildPath === 'shared-with-me' ||
            currentPage.firstChildPath === 'shared-by-me' ||
            currentPage.rootPath === 'my-contracts' ||
            currentPage.rootPath === 'my-apps'">
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Owner"
              sortByKey="owner.name"
              sortByKeyType="string"
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
        :cols="10"
      />
      <TbodyCollapsible
        v-for="(item, index) in paginatedRows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        :level="1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`" :data-qa="`tableRow-${index}`">
          <td class="picture">
            <Images :uuid="item.uuid" :altText="item.apititle" :color="item.color" type="apis" shape="rectangle" :lastUpdatedAt="itemsLastUpdatedAt"></Images>
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" :data-qa="`tableRowName-${index}`">
            {{ item.apititle }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.version }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            <Icon icon="circle" :class="`state${item.apistatename}`"/>
            {{ item.apistatename }} - {{ item.environment }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.apivisibilityname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" class="number">
            {{ item.contractscount }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" class="number">
            {{ item.licensescount }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" v-if="currentPage.firstChildPath === 'shared-with-me' ||
            currentPage.firstChildPath === 'shared-by-me' ||
            currentPage.rootPath === 'my-contracts' ||
            currentPage.rootPath === 'my-apps'">
            {{ item.apiowner }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.updated | moment("DD.MM.YYYY HH:mm") }}
          </td>
          <td class="actions" v-if="routePath !== '/app/explore/'">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item data-qa="btnEdit" :to="`${routePath}/edit-api/${item.uuid}`"><Icon icon="edit" /> Edit Proxy API</b-dropdown-item>

              <b-dropdown-item data-qa="btnEditApiLicenses" :to="`${routePath}/edit-api-licenses/${item.uuid}`">
                <Icon icon="certificate" /> Add/Edit API Licenses
              </b-dropdown-item>

              <b-dropdown-item data-qa="btnEditLifeCycle" :to="`${routePath}/edit-api-lifecycle/${item.uuid}`">
                <Icon icon="bezier-curve" />Change API Lifecycle
              </b-dropdown-item>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item data-qa="btnLogsAll" :to="`${routePath}/logs/${item.uuid}/api/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
          <td class="actions" v-else></td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="10">
            <div class="collapsible-content">
              <Proxy
                :item="item"
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
import Images from '@/components/shared/Images';

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
      contracts: state => state.userContracts.userApiContracts,
      apiLicenses: state => state.apiLicenses.items,
      isUsersLoaded: state => state.users.lastUpdatedAt,
      itemsLastUpdatedAt: state => state.proxies.lastUpdatedAt,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection, rows, users,
        apiStates, apiVisibilityTypes } = this;
      const { sortArrayOfObjects } = Helpers;
      const getApiOwner = (apiItem) => {
        const apiOwner = users.find(item => item.uuid === apiItem.subjectid);
        return apiOwner.displayname;
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
        .filter(item => item.apiid === id);
        const apiLicenses = this.licenses.filter(el =>
          apiLicensesApis.some(f =>
            f.licenseid === el.uuid,
          ),
        );
        return apiLicenses;
      };
      const getProxyContracts = (id) => {
        const proxyContracts = this.contracts
        .filter(item => item.apiid === id);
        return proxyContracts;
      };
      return sortArrayOfObjects({
        array: rows
          .map(item => ({
            ...item,
            apistatename: getApiStateName(item.apistateid),
            apivisibilityname: getApiVisibilityName(item.apivisibilityid),
            licenses: getApiLicenses(item.uuid),
            licensescount: getApiLicenses(item.uuid).length,
            contracts: getProxyContracts(item.uuid),
            contractscount: getProxyContracts(item.uuid).length,
            apiowner: item.apiowner ? item.apiowner : getApiOwner(item),
            apititle: item.apititle ? item.apititle : item.openapidocument.info.title,
            apiversion: item.apiversion ? item.apiversion : item.openapidocument.info.version,
            apidescription: item.apidescription ? item.apidescription :
              item.openapidocument.info.description,
            environment: item.islive ? 'Live' : 'Sandbox',
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
    Images,
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
  mounted() {
    this.$store.dispatch('apiStates/getApiStates', {});
    this.$store.dispatch('apiVisibilityTypes/getApiVisibilityTypes', {});
    this.$store.dispatch('users/getUsers', {});
    // this.$store.dispatch('businessApis/getBusinessApis', { uuid: this.currentUser.uuid });
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
    this.$store.dispatch('userContracts/getUserApiContracts', { uuid: this.currentUser.uuid });
    this.$store.dispatch('apiLicenses/getApiLicensesRefs', {});
  },
};
</script>

<style lang="scss" scoped>
.favimage {
  max-width: 35px;
  height: auto;
  margin: -7px 10px;
}
.stateInitial{
  color:#8b8e91
}
.stateDraft{
  color:#161c9a
}
.stateStaged{
  color:#6f42c1
}
.statePublished{
  color:#eeee00
}
.statePromoted{
  color:#4cac00
}
.stateDemoted{
  color:#db408d
}
.stateDeprecated{
  color:#ecb100
}
.stateRetired{
  color:#00bbbb
}
.stateArchived{
  color:#177ec1
}
.stateRemoved{
  color:#212121
}
</style>