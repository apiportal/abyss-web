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
      <b-button
        @click="handleToggleApiProxiesTable"
        size="sm"
      >
        <span>Proxy APIs</span>
        <b-badge variant="light">{{ apiProxies.length }}</b-badge>
        <Icon :icon="`${isApiProxiesTableVisible ? 'arrow-down' : 'arrow-right'}`" />
      </b-button>
      <div v-if="isApiProxiesTableVisible" style="margin-bottom: 1rem;">
        <Proxies
          :rows="apiProxies"
          :routePath="routePath"
        ></Proxies>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
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
    TbodyCollapsible,
    Icon,
    Proxies: () => import('@/components/shared/subjects/proxies/Proxies'),
  },
  computed: {
    ...mapState({
      proxies: state => state.proxies.items,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      organizations: state => state.organizations.items,
    }),
    apiProxies() {
      const { proxies, apiStates, apiVisibilityTypes, organizations } = this;
      const getApiStateName = (apistateid) => {
        const apiState = apiStates.find(item => item.uuid === apistateid);
        return apiState ? apiState.name : apistateid;
      };
      const getApiVisibilityName = (apivisibilityid) => {
        const apiVisibility = apiVisibilityTypes.find(item => item.uuid === apivisibilityid);
        return apiVisibility ? apiVisibility.name : apivisibilityid;
      };
      const getOrganizationName = (organizationid) => {
        const organization = organizations.find(item => item.uuid === organizationid);
        return organization ? organization.name : organizationid;
      };
      return proxies
      .filter(proxy => proxy.businessapiid === this.item.uuid)
      .map(item => ({
        ...item,
        apistatename: getApiStateName(item.apistateid),
        apivisibilityname: getApiVisibilityName(item.apivisibilityid),
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
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    getApiLicenses(uuid) {
      api.getApiLicenses(uuid).then((response) => {
        if (response && response.data) {
          this.subscriptions[uuid] = response.data;
          this.subscriptions.lastUpdated = (new Date()).getTime();
        }
      });
    },
    handleToggleApiProxiesTable() {
      this.isApiProxiesTableVisible = !this.isApiProxiesTableVisible;
    },
  },
  mounted() {
    this.proxies
      .filter(proxy => proxy.businessapiid === this.item.uuid)
      .map(item => this.getApiLicenses(item.uuid));
  },
};
</script>