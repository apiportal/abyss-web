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
    </div>
    <div class="row abyss-table-buttons" v-if="routePath === `/app/my-apis/businesses/${page}`">
      <b-button
        @click="handleToggleApiProxiesTable"
        size="md"
        variant="link"
        :class="{'active': isApiProxiesTableVisible}"
        :id="`apiProxyListButton_${item.uuid}`"
      >
        <span class="btn-text">Proxy APIs</span>
        <b-badge pill>{{ apiProxies.length }}</b-badge>
      </b-button>
    </div>
    <div v-if="isApiProxiesTableVisible">
      <Proxies
        :rows="apiProxies"
        :routePath="routePath"
      ></Proxies>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';

export default {
  name: 'Api',
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
  components: {
    Icon,
    Proxies: () => import('@/components/shared/subjects/proxies/Proxies'),
  },
  computed: {
    ...mapState({
      currentPage: state => state.currentPage,
      proxies: state => state.proxies.items,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      organizations: state => state.organizations.items,
    }),
    apiProxies() {
      const { proxies, organizations } = this;
      const getOrganizationName = (organizationid) => {
        const organization = organizations.find(item => item.uuid === organizationid);
        return organization ? organization.name : organizationid;
      };
      return proxies
      .filter(proxy => proxy.businessapiid === this.item.uuid)
      .map(item => ({
        ...item,
        organizationame: getOrganizationName(item.organizationid),
        subscriptions: this.subscriptions[item.uuid] || [],
        subscriptionsUpdated: this.subscriptions.lastUpdated,
      }));
    },
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      isApiProxiesTableVisible: false,
      collapsedRows: [],
      subscriptions: {
        lastUpdated: 0,
      },
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
    handleToggleApiProxiesTable() {
      this.isApiProxiesTableVisible = !this.isApiProxiesTableVisible;
    },
  },
};
</script>