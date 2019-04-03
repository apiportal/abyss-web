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
              text="Organization Name"
              sortByKey="name"
              sortByKeyType="string"
              data-qa="tableHeadName"
            />
          </th>
          <th class="text-nowrap">
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Sub Organizations"
              sortByKey="suborganizations"
              sortByKeyType="number"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Users"
              sortByKey="organizationusers"
              sortByKeyType="number"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Owner"
              sortByKey="organizationowner"
              sortByKeyType="string"
            />
          </th>
          <th></th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && organizations.length === 0"
        :cols="5"
      />
      <TbodyCollapsible
        v-for="(item, index) in organizations" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        :level="0"
        :data-qa="`tableRow-${index}`"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
          <td @click="() => handleCollapseTableRows(item.uuid)" :data-qa="`tableRowName-${index}`">
            {{ item.name }}
          </td>
          <td class="number" @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.suborganizations ? item.suborganizations.length : 0 }}
          </td>
          <td class="number" @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.organizationusers ? item.organizationusers.length : 0 }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.organizationowner }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item data-qa="btnEdit" :to="`${routePath}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
              <b-dropdown-item data-qa="btnDelete" :to="`${routePath}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item data-qa="btnLogsAll" :to="`${routePath}/logs/${item.uuid}/organization/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer">
          <td colspan="5">
            <div class="collapsible-content">
              <Organization
                :organization="item"
                :routePath="routePath"
              />
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
      <router-view></router-view>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';

export default {
  props: {
    organizations: {
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
  },
  components: {
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
    Organization: () => import('@/components/shared/subjects/organizations/Organization'),
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
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    handleSortByClick({ sortByKey, sortByKeyType, sortDirection }) {
      this.sortByKey = sortByKey;
      this.sortByKeyType = sortByKeyType;
      this.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    },
  },
};
</script>