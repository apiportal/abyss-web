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
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>Proxy Api Name</th>
            <th>Version</th>
            <th>State</th>
            <th>Visibility</th>
            <th># of Subscriptions</th>
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(proxyItem, proxyIndex) in apiProxies" v-bind:key="proxyIndex"
          :isCollapsed="collapsedRows.indexOf(proxyItem.uuid) > -1"
          :level="1"
        >
          <tr slot="main" :class="`${proxyIndex % 2 === 0 ? 'odd' : 'even'}`">
            <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
              {{ proxyItem.openapidocument.info.title }}
            </td>
            <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
              {{ proxyItem.version }}
            </td>
            <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
              {{ proxyItem.apistatename }}
            </td>
            <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
              {{ proxyItem.apivisibilityname }}
            </td>
            <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
              {{ proxyItem.subcriptions.length }}
            </td>
          </tr>
          <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(proxyItem.uuid) > -1">
            <td colspan="6">
              <div class="collapsible-content">
                <Proxy
                  :item="proxyItem"
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
import Proxy from '@/components/routes/myApis/businesses/Proxy';
import Icon from '@/components/shared/Icon';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    TbodyCollapsible,
    Proxy,
    Icon,
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
        subcriptions: this.subcriptions[item.uuid] || [],
        subcriptionsUpdated: this.subcriptions.lastUpdated,
      }));
    },
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      isApiProxiesTableVisible: false,
      collapsedRows: [],
      subcriptions: {
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
          this.subcriptions[uuid] = response.data;
          this.subcriptions.lastUpdated = (new Date()).getTime();
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