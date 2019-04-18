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
              sortByKey="isactivated"
              sortByKeyType="boolean"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="App Name"
              sortByKey="displayname"
              sortByKeyType="string"
              data-qa="tableHeadName"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Contracts"
              sortByKey="contractsCount"
              sortByKeyType="number"
            />
          </th>
          <th></th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="4"
      />
      <TbodyCollapsible
        v-for="(item, index) in sortedRows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`" :data-qa="`tableRow-${index}`">
          <td class="status" @click="() => handleCollapseTableRows(item.uuid)">
            <Icon :icon="item.isactivated ? 'check-circle' : 'times-circle'" :class="item.isactivated ? 'text-success' : 'text-danger'" />
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" :data-qa="`tableRowName-${index}`">
            {{ item.displayname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            <!-- {{ item.contracts ? item.contracts.length : '' }} -->
            {{ item.contractsCount }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item :to="`${routePath}/edit-app/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
              <b-dropdown-item :to="`${routePath}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item :to="`${routePath}/logs/${item.uuid}/subject/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

              <b-dropdown-header v-if="item.subjectapp">
                <small class="d-block">subjectapp</small>
                <code>{{ item.subjectapp.uuid }}</code>
              </b-dropdown-header>
              <b-dropdown-header v-if="item.resource">
                <small class="d-block">resource</small>
                <code>{{ item.resource.uuid }}</code>
              </b-dropdown-header>
              <b-dropdown-header v-if="item.resource && item.resource.permission">
                <small class="d-block">permission</small>
                <code>{{ item.resource.permission.uuid }}</code>
              </b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1" data-qa="tableFooter">
          <td colspan="4">
            <div class="collapsible-content">
              <App
                :item="item"
                :routePath="routePath"
              ></App>
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import App from '@/components/shared/subjects/apps/App';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Icon from '@/components/shared/Icon';
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
    App,
    TbodyCollapsible,
    TBodyLoading,
    SortBy,
    Icon,
  },
  data() {
    return {
      collapsedRows: [],
      sortByKey: 'displayname',
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
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>