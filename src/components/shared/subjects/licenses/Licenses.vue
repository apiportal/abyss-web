<template>
  <div class="verapi-table-container">
    <table class="table verapi-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>
            License Name
            <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  sortByKey="name"
                  sortByKeyType="string"
            />
          </th>
          <th>
            Version
            <SortBy
                  :selectedSortByKey="sortByKey"
                  :selectedSortDirection="sortDirection"
                  :onClick="handleSortByClick"
                  sortByKey="version"
                  sortByKeyType="string"
            />
          </th>
          <th>Visibility</th>
          <th>State</th>
          <th>Created Date</th>
          <th># of Policies</th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(licenseItem, licenseIndex) in rows" v-bind:key="licenseIndex"
        :isCollapsed="collapsedRows.indexOf(licenseItem.uuid) > -1"
        :level="2"
      >
        <tr slot="main" :class="`${licenseIndex % 2 === 0 ? 'odd' : 'even'} ${licenseItem.isdeleted ? 'is-deleted' : ''}`">
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            <Icon :icon="licenseItem.isactive ? 'check-circle' : 'times-circle'" :class="licenseItem.isactive ? 'text-success' : 'text-danger'" />
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.name }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.version }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.licensedocument.info.visibility }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)" style="text-transform: capitalize">
            {{ licenseItem.licensedocument.legal.documentState }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.created | moment("DD.MM.YYYY HH:mm") }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.licensedocument.termsOfService.policyKey.length }}
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(licenseItem.uuid) > -1">
          <td colspan="7">
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
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import License from '@/components/shared/subjects/licenses/License';

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
  components: {
    TbodyCollapsible,
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
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>