<template>
  <div>
    <p><strong>Title:</strong> {{ item.openapidocument.info.title }}</p>
    <p><strong>Version:</strong> {{ item.openapidocument.info.version }}</p>
    <p><strong>Description:</strong> {{ item.openapidocument.info.description }}</p>
    <p><strong>Organization:</strong> {{ item.organizationame }}</p>
    <p>
      <strong>Licenses:</strong>
      <span v-if="item.subcriptions.length === 0">{{ item.subcriptions.length }}</span>
      <b-link @click="handleToggleLicensesTable" v-else>
        <span>{{ item.subcriptions.length }}</span>
        <Icon :icon="`${isLicensesTableVisible ? 'arrow-down' : 'arrow-right'}`" />
      </b-link>
    </p>

    <div v-if="isLicensesTableVisible" style="margin-bottom: 1rem;">
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>License Name</th>
            <th># of Policies</th>
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(licenseItem, licenseIndex) in item.subcriptions" v-bind:key="licenseIndex"
          :isCollapsed="collapsedRows.indexOf(licenseItem.uuid) > -1"
          :level="2"
        >
          <tr slot="main" :class="`${licenseIndex % 2 === 0 ? 'odd' : 'even'}`">
            <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
              {{ licenseItem.name }}
            </td>
            <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
              {{ licenseItem.licensedocument.termsOfService.policyKey.length }}
            </td>
          </tr>
          <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(licenseItem.uuid) > -1">
            <td colspan="2">
              <div class="collapsible-content">
                <License
                  :item="licenseItem"
                />
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
    </div>

    <div>
      <b-dropdown variant="secondary" size="sm">
        <template slot="button-content">
          <Icon icon="list-ol" />
          <span>Proxy Logs</span>
        </template>
        <b-dropdown-item :to="`/app/my-apis/businesses/${page}/logs/${item.uuid}/all/1`">All</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import License from '@/components/routes/myApis/businesses/License';
import Icon from '@/components/shared/Icon';

export default {
  computed: {
    ...mapState({
    }),
    tableRows() {
      return this.licenses;
    },
  },
  components: {
    TbodyCollapsible,
    License,
    Icon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      collapsedRows: [],
      isLicensesTableVisible: false,
    };
  },
  methods: {
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    handleToggleLicensesTable() {
      this.isLicensesTableVisible = !this.isLicensesTableVisible;
    },
  },
};
</script>