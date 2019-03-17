<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col">
        <dt>Title:</dt>
        <dd>{{ item.openapidocument.info.title }}</dd>
      </dl>
      <dl class="col">
        <dt>Version:</dt>
        <dd>{{ item.openapidocument.info.version }}</dd>
      </dl>
      <dl class="col">
        <dt>Description:</dt>
        <dd>{{ item.openapidocument.info.description }}</dd>
      </dl>
      <dl class="col">
        <dt>Organization:</dt>
        <dd>{{ item.organizationame }}</dd>
      </dl>
    </div>
    <div class="row abyss-table-buttons">
      <b-button
        @click="handleToggleLicensesTable"
        size="md"
        variant="link"
        :class="{'active': isLicensesTableVisible}"
      >
        <span>Licenses</span>
        <b-badge pill>{{ item.subscriptions ? item.subscriptions.length : 0 }}</b-badge>
      </b-button>
    </div>
    <div v-if="isLicensesTableVisible">
      <Licenses
        :rows="item.subscriptions"
        :routePath="routePath"
      ></Licenses>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
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
    Licenses: () => import('@/components/shared/subjects/licenses/Licenses'),
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
    childComponent: {
      type: String,
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
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
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