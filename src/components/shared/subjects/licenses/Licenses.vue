<template>
  <div class="abyss-table-content">
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
              text="License Name"
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
        :cols="5"
      />
      <TbodyCollapsible
        v-for="(licenseItem, licenseIndex) in sortedRows" v-bind:key="licenseIndex"
        :isCollapsed="collapsedRows.indexOf(licenseItem.uuid) > -1"
        :level="2"
      >
        <tr slot="main" :class="`${licenseIndex % 2 === 0 ? 'odd' : 'even'} ${licenseItem.isdeleted ? 'is-deleted' : ''}`" :data-qa="`tableRow-${licenseIndex}`">
          <td class="status" @click="() => handleCollapseTableRows(licenseItem.uuid)">
            <Icon
              :icon="licenseItem.isactive ? 'check-circle' : 'times-circle'"
              :class="licenseItem.isactive ? 'text-success' : 'text-danger'" />
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)" :data-qa="`tableRowName-${licenseIndex}`">
            {{ licenseItem.name }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.version }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.updated | moment("DD.MM.YYYY HH:mm") }}
          </td>
          <!-- <td @click="() => handleCollapseTableRows(licenseItem.uuid)" v-if="childComponent === 'policies'">
            {{ licenseItem.licensedocument.termsOfService.policyKey.length }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)" v-if="childComponent === 'proxies'">
            {{ licenseApis.length }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)" v-if="childComponent === 'contracts'">
            {{ licenseContracts.length }}
          </td> -->
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!licenseItem.isdeleted">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item :to="`${routePath}/edit-license/${licenseItem.uuid}`"><Icon icon="edit" /> Edit License</b-dropdown-item>
              <b-dropdown-item :to="`${routePath}/edit-license-policies/${licenseItem.uuid}`"><Icon icon="edit" /> Add/Edit Policies</b-dropdown-item>
              <b-dropdown-item :to="`${routePath}/delete-license/${licenseItem.uuid}`"><Icon icon="trash-alt" /> Delete License</b-dropdown-item>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item :to="`${routePath}/logs/${licenseItem.uuid}/license/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ licenseItem.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(licenseItem.uuid) > -1" data-qa="tableFooter">
          <td colspan="5">
            <div class="collapsible-content">
              <License
                :item="licenseItem"
                :routePath="routePath"
                :childComponent="childComponent"
              ></License>
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
import SortBy from '@/components/shared/SortBy';
import License from '@/components/shared/subjects/licenses/License';
import Helpers from '@/helpers';

export default {
  name: 'Licenses',
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
    childComponent: {
      type: String,
      required: false,
      default() { return 'policies'; },
    },
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
    }),
    sortedRows() {
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
    License,
  },
  data() {
    return {
      collapsedRows: [],
      sortByKey: 'name',
      sortByKeyType: 'string',
      sortDirection: 'desc',
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
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>