<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand>{{ item.openapidocument.info.title }}</b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="list-ol" />
              <em>Logs</em>
            </template>
            <b-dropdown-item :to="`${routePath}/logs/${item.uuid}/api/1`">All</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="cog" />
              <em>Operations</em>
            </template>
            <!-- <b-dropdown-item :to="`${routePath}/edit-license/${item.uuid}`"><Icon icon="edit" /> Edit License</b-dropdown-item> -->
            <!-- <b-dropdown-item :to="`/app/my-licenses/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete License</b-dropdown-item> -->
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;">
      <p><strong>Title:</strong> {{ item.openapidocument.info.title }}</p>
      <p><strong>Version:</strong> {{ item.openapidocument.info.version }}</p>
      <p><strong>Description:</strong> {{ item.openapidocument.info.description }}</p>
      <p><strong>Organization:</strong> {{ item.organizationame }}</p>
      <b-button
        @click="handleToggleLicensesTable"
        size="sm"
      >
        <span>Licenses</span>
        <b-badge variant="light">{{ item.subscriptions ? item.subscriptions.length : 0 }}</b-badge>
        <Icon :icon="`${isLicensesTableVisible ? 'arrow-down' : 'arrow-right'}`" />
      </b-button>
      <div v-if="isLicensesTableVisible" style="margin-bottom: 1rem;">
        <Licenses
          :rows="item.subscriptions"
          :routePath="routePath"
        ></Licenses>
      </div>
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