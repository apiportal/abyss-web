<template>
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
              text="Permission Name"
              sortByKey="permission"
              sortByKeyType="string"
              data-qa="tableHeadName"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Resource Type"
              sortByKey="resourcetypename"
              sortByKeyType="string"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Resource Action"
              sortByKey="resourceactionname"
              sortByKeyType="string"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Access Manager"
              sortByKey="accessmanagername"
              sortByKeyType="string"
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
      :cols="7"
    />
      <TbodyCollapsible
        v-for="(item, index) in rows" v-bind:key="index"
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
            {{ item.permission }}
          </td>
          <td class="type" @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.resourcetypename }}
          </td>
          <td class="type" @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.resourceactionname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.accessmanagername }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.organizationname }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item data-qa="btnEdit" :to="`/app/administer-permissions/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
              <b-dropdown-item data-qa="btnDelete" :to="`/app/administer-permissions/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item data-qa="btnLogsAll" :to="`/app/administer-permissions/${page}/logs/${item.uuid}/subjectpermission/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" data-qa="tableFooter" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="7">
            <div class="collapsible-content">
              <Permission
                :permission="item"
                :subjectTypes="subjectTypes"
                :page="page"
              />
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Permission from '@/components/shared/subjects/permissions/Permission';

export default {
  components: {
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
    TBodyLoading,
    Permission,
  },
  props: {
    rows: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
    }),
  },
  data() {
    return {
      collapsedRows: [],
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
  },
};
</script>
