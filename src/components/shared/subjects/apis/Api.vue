<template>
  <div>
    <p><strong>Title:</strong> {{ item.openapidocument.info.title }}</p>
    <p><strong>Version:</strong> {{ item.openapidocument.info.version }}</p>
    <p><strong>Description:</strong> {{ item.openapidocument.info.description }}</p>
    <p>
      <strong>Proxy APIs:</strong>
      <span v-if="apiProxies.length === 0">{{ apiProxies.length }}</span>
      <b-link @click="handleToggleApiProxiesTable" v-else>
        <span>{{ apiProxies.length }}</span>
        <Icon :icon="`${isApiProxiesTableVisible ? 'arrow-down' : 'arrow-right'}`" />
      </b-link>
    </p>
    <div v-if="isApiProxiesTableVisible" style="margin-bottom: 1rem;">
      <Proxies
        :rows="apiProxies"
      />
    </div>
    <div>
      <b-dropdown variant="secondary" size="sm">
        <template slot="button-content">
          <Icon icon="list-ol" />
          <span>API Logs</span>
        </template>
        <b-dropdown-item :to="`/app/my-apis/businesses/${page}/logs/${item.uuid}/all/1`">All</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';
import Proxies from '@/components/shared/subjects/proxies/Proxies';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    TbodyCollapsible,
    Icon,
    Proxies,
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