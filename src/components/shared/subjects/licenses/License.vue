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
            <b-dropdown-item @keyup.delete="handleDeleteModal" :to="`/app/my-licenses/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete License</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;">
      <div class="flex-container">
        <div>
          <p><strong>Name:</strong> {{ item.name }}</p>
          <p><strong>Id:</strong> {{ item.uuid }}</p>
          <p><strong>Organization:</strong> {{ getOrganizationName(item.organizationid) }}</p>
          <p><strong>Description:</strong> {{ item.licensedocument.sla.description }}</p>
          </div>
          <div>
          <p><strong>Performance:</strong> {{ item.licensedocument.sla.performance }}</p>
          <p><strong>Availability:</strong> {{ item.licensedocument.sla.availability }}</p>
          <p><strong>Support Hours:</strong> {{ item.licensedocument.sla.supportHours }}</p>
          <p><strong>BlackOutHours PerYear:</strong> {{ item.licensedocument.sla.blackOutHoursPerYear }}</p>
          <p><strong>Link:</strong> {{ item.licensedocument.legal.link }}</p>
          <b-link
            @click="toggleInformModal"  
            class="fas fa-search"
          >
            Show Legal Agreement 🔍
          </b-link>
          <InformModal
            v-if="isInformModalVisible"  
            title="Legal Agreement"
            :text="`${item.licensedocument.legal.documentText}`"
            :onClose="toggleInformModal"
            :onConfirm="toggleInformModal"
          >
          </InformModal>
          </div>
          <div>
          <p><strong>Created at:</strong> {{ item.created | moment("DD.MM.YYYY HH:mm") }}</p>
          <p><strong>Updated at:</strong> {{ item.updated | moment("DD.MM.YYYY HH:mm") }}</p>
          <p v-if="item.isdeleted"><strong>Deleted at:</strong> {{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</p>
          <p><strong>Effective Start Date:</strong></p>
          <p><strong>Effective End Date:</strong></p>
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
import InformModal from '@/components/shared/modals/InformModal';

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
    InformModal,
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      collapsedRows: [],
      isPoliciesTableVisible: false,
      isInformModalVisible: false,
    };
  },
  methods: {
    toggleInformModal() {
      this.isInformModalVisible = !this.isInformModalVisible;
    },
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
    handleDeleteModal() {
      const { item, page } = this;
      this.$router.push(`/app/my-licenses/${page}/delete/${item.uuid}`);
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