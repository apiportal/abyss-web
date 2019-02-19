<template>
  <div>
    <p><strong>Title:</strong> {{ item.openapidocument.info.title }}</p>
    <p><strong>Version:</strong> {{ item.openapidocument.info.version }}</p>
    <p><strong>Description:</strong> {{ item.openapidocument.info.description }}</p>
    <p><strong>Organization:</strong> {{ item.organizationame }}</p>
    <p>
      <strong>Licenses:</strong>
      <span v-if="item.subscriptions.length === 0">{{ item.susbcriptions.length }}</span>
      <b-link @click="handleToggleLicensesTable" v-else>
        <span>{{ item.subscriptions.length }}</span>
        <Icon :icon="`${isLicensesTableVisible ? 'arrow-down' : 'arrow-right'}`" />
      </b-link>
    </p>

    <div v-if="isLicensesTableVisible" style="margin-bottom: 1rem;">
      <Licenses
        :rows="item.subscriptions"
      />
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
import Licenses from '@/components/shared/subjects/licenses/Licenses';
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
    Icon,
    Licenses,
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