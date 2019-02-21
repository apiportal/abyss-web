<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand>{{ item.name }}</b-navbar-brand>

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
            <b-dropdown-item :to="`${routePath}/logs/${item.uuid}/license/1`">All</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="cog" />
              <em>Operations</em>
            </template>
            <b-dropdown-item :to="`${routePath}/edit-license/${item.uuid}`"><Icon icon="edit" /> Edit License</b-dropdown-item>
            <b-dropdown-item :to="`/app/my-licenses/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete License</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;">
      <div class="flex-container">
        <div>
          <p>License Name: {{ item.name }}</p>
          <p>Id: {{ item.uuid }}</p>
          <p>Organization: {{ getOrganizationName(item.organizationid) }}</p>
          <p>Description: {{ item.licensedocument.sla.description }}</p>
          </div>
          <div>
          <p>Performance: {{ item.licensedocument.sla.performance }}</p>
          <p>Availability: {{ item.licensedocument.sla.availability }}</p>
          <p>Support Hours: {{ item.licensedocument.sla.supportHours }}</p>
          <p>BlackOutHours PerYear: {{ item.licensedocument.sla.blackOutHoursPerYear }}</p>
          <p>Link: {{ item.licensedocument.legal.link }}</p>
          <b-link
            :to="`/app/my-licenses/${page}/legal/${item.uuid}`"
            class="fas fa-search"
          >
            Show Legal Agreement 🔍
          </b-link>
          </div>
          <div>
          <p>Created at: {{ formatTimeStamp(item.created) }}</p>
          <p>Updated at: {{ formatTimeStamp(item.updated) }}</p>
          <p>Deleted at: {{ formatTimeStamp(item.deleted) }}</p>
          <p>Effective Start Date:</p>
          <p>Effective End Date:</p>
        </div>
      </div>
      <p>
        <strong>Policies:</strong>
        <span v-if="tableRows.length === 0">{{ tableRows.length }}</span>
        <b-link @click="handleTogglePoliciesTable" v-else>
          <span>{{ tableRows.length }}</span>
          <Icon :icon="`${isPoliciesTableVisible ? 'arrow-down' : 'arrow-right'}`" />
        </b-link>
      </p>
      <div v-if="isPoliciesTableVisible" style="margin-bottom: 1rem;">
        <Policies
          :rows="tableRows"
          :routePath="routePath"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';
import Policies from '@/components/shared/subjects/policies/Policies';

export default {
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
  },
  computed: {
    ...mapState({
      policies: state => state.policies.items,
      policyTypes: state => state.policyTypes.items,
      organizations: state => state.organizations.items,
    }),
    tableRows() {
      const { item, policies, policyTypes } = this;
      const licensePolicyIds = item.licensedocument.termsOfService.policyKey;
      const getTypeName = (typeId) => {
        const type = policyTypes.find(policyType => policyType.uuid === typeId);
        return type ? type.name : typeId;
      };
      return policies
      .filter(policy => licensePolicyIds.indexOf(policy.uuid) > -1)
      .map(policy => ({
        ...policy,
        typename: getTypeName(policy.typeid),
      }));
    },
  },
  components: {
    TbodyCollapsible,
    Icon,
    Policies,
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      collapsedRows: [],
      isPoliciesTableVisible: false,
    };
  },
  methods: {
    getOrganizationName(organizationId) {
      const { organizations } = this;
      const organization = organizations.find(i => i.uuid === organizationId) || {};
      return organization.name || 'nope';
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    handleTogglePoliciesTable() {
      this.isPoliciesTableVisible = !this.isPoliciesTableVisible;
    },
    formatTimeStamp(timeStamp) {
      function fix(num, length = 2) {
        return num.toString().padStart(length, '0');
      }
      const d = new Date(timeStamp);
      const dateStr = `${fix(d.getDate())}.${fix(d.getMonth() + 1)}.${d.getFullYear()} ${fix(d.getHours())}:${fix(d.getMinutes())}`;
      return dateStr;
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  justify-content: space-between;
  border: 1px;
}
</style>