<template>
  <div class="page-container page-policies-types">

    <div class="page-header">
      <b-nav class="page-tabs" tabs>
        <!-- <b-nav-item :active="false" to="/app/my-licenses/my-licenses/1">
          <span class="link-text" data-qa="linkMyAllLicenses">My All Licenses</span> <b-badge pill>{{ subjectLicenses.length }}</b-badge>
        </b-nav-item> -->
        <b-nav-item :active="false" to="/app/my-policies/my-policies/1">
          <span class="link-text" data-qa="linkMyPolicies">My Policies</span> <b-badge pill>{{ subjectPolicies.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="true" to="/app/policy-types/1">
          <span class="link-text" data-qa="linkPolicyTypes">Policy Types</span> <b-badge pill>{{ policyTypes.length }}</b-badge>
        </b-nav-item>
      </b-nav>
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
            :to="`/app/policy-types/${page}/add-new`"
            variant="primary"
            v-b-tooltip.hover
            title="Add New Policy Type"
            class="page-btn-add"
            block
            data-qa="btnAddNew"
          >
            <span class="btn-text">Add New</span>
            <Icon icon="plus" />
          </b-button>
        </div>
      </div>
    </div>

    <div class="page-content">
      <table class="table abyss-table abyss-table-cards">
        <thead>
          <tr>
            <th class="status">
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Status"
                sortByKey="isactive"
                sortByKeyType="boolean"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Policy Type Name"
                sortByKey="name"
                sortByKeyType="string"
                data-qa="tableHeadName"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Type"
                sortByKey="type"
                sortByKeyType="string"
                data-qa="tableHeadType"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Sub Type"
                sortByKey="subtype"
                sortByKeyType="string"
                data-qa="tableHeadSubType"
              />
            </th>
            <th>
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                text="Organization"
                sortByKey="organizationname"
                sortByKeyType="string"
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <TBodyLoading
          v-if="isLoading && tableRows.length === 0"
          :cols="6"
        />
        <TbodyCollapsible
          v-for="(item, index) in paginatedRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
          :data-qa="`tableRow-${index}`"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
            <td class="status" @click="() => handleCollapseTableRows(item.uuid)">
              <Icon
                :icon="item.isactive ? 'check-circle' : 'times-circle'"
                :class="item.isactive ? 'text-success' : 'text-danger'"
              />
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)" :data-qa="`tableRowName-${index}`">
              {{ item.name }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.type }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.subtype }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
            <td class="actions">
              <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
                <template slot="button-content">
                  <Icon icon="ellipsis-h" />
                </template>

                <b-dropdown-item data-qa="btnEdit" :to="`/app/policy-types/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit Policy Type</b-dropdown-item>
                <b-dropdown-item data-qa="btnDelete" :to="`/app/policy-types/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete Policy Type</b-dropdown-item>

                <b-dropdown-header>LOGS</b-dropdown-header>

                <b-dropdown-item data-qa="btnLogsAll" :to="`/app/policy-types/${page}/logs/${item.uuid}/policytype/1`">All</b-dropdown-item>

                <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

              </b-dropdown>
            </td>
          </tr>
          <tr slot="footer" class="footer" data-qa="tableFooter">
            <td colspan="6">
              <div class="collapsible-content">
                <div class="abyss-table-content">
                  <div class="row">
                    <dl class="col">
                      <dt>Policy Type Name:</dt>
                      <dd>{{ item.name }}</dd>
                      <dt>Description:</dt>
                      <dd>{{ item.description }}</dd>
                      <dt>Organization:</dt>
                      <dd>{{ item.organizationname }}</dd>
                    </dl>
                    <dl class="col">
                      <dt>Type:</dt>
                      <dd>{{ item.type }}</dd>
                      <dt>Sub Type:</dt>
                      <dd>{{ item.subtype }}</dd>
                    </dl>
                    <dl class="col">
                      <dt>Created:</dt>
                      <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
                      <dt v-if="!item.isdeleted">Updated:</dt>
                      <dd v-if="!item.isdeleted">{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
                      <dt v-if="item.isdeleted">Deleted:</dt>
                      <dd v-if="item.isdeleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
        <router-view></router-view>
      </table>
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
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      isLoading: state => state.traffic.isLoading,
      policyTypes: state => state.policyTypes.items,
      policies: state => state.subjectPolicies.items,
      organizations: state => state.organizations.items,
      subjectLicenses: state => state.subjectLicenses.items,
      subjectPolicies: state => state.subjectPolicies.items,

    }),
    tableRows() {
      const { policyTypes, organizations } = this;
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: policyTypes.map(item => ({
          ...item,
          organizationname: getOrganizationName(item.organizationid),
        })).filter((item) => {
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
              item.description &&
              item.description.toLowerCase().indexOf(filterKeyLowerCase) > -1
            )
          );
        }),
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
  created() {
    this.$store.commit('currentPage/setRootPath', 'policy-types');
    this.$store.dispatch('policyTypes/getPolicyTypes', {});
    this.$store.dispatch('subjectPolicies/getSubjectPolicies', { uuid: this.currentUser.uuid });
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
    this.$store.dispatch('organizations/getOrganizations', {});
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'name',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      filterKey: '',
      collapsedRows: [],
      itemsPerPage: 20,
    };
  },
  methods: {
    handleSortByClick({ sortByKey, sortByKeyType, sortDirection }) {
      this.sortByKey = sortByKey;
      this.sortByKeyType = sortByKeyType;
      this.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    },
    handleFilterKeyup({ value }) {
      this.filterKey = value;
    },
    handlePageChange(page) {
      this.$router.push(`/app/policy-types/${page}`);
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    refreshData() {
      this.$store.dispatch('policyTypes/getPolicyTypes', {
        refresh: true,
      });
    },
  },
};
</script>
