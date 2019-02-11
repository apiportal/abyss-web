<template>
  <div>
    <p><strong>Title:</strong> {{ item.openapidocument.info.title }}</p>
    <p><strong>Version:</strong> {{ item.openapidocument.info.version }}</p>
    <p><strong>Description:</strong> {{ item.openapidocument.info.description }}</p>
    <p v-if="apiProxies.length > 0"><strong>Proxy APIs:</strong></p>
    <div style="border: 1px solid #e7eaf3; border-radius: .3rem; padding: 1rem;" v-if="apiProxies.length > 0">
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Proxy from '@/components/routes/myApis/businesses/Proxy';

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
        this.subcriptions[uuid] = response.data;
        this.subcriptions.lastUpdated = (new Date()).getTime();
      });
    },
  },
  mounted() {
    this.proxies
      .filter(proxy => proxy.businessapiid === this.item.uuid)
      .map(item => this.getApiLicenses(item.uuid));
  },
};
</script>