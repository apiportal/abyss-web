<template>
  <div>
    <p><strong>Title:</strong> {{ item.openapidocument.info.title }}</p>
    <p><strong>Version:</strong> {{ item.openapidocument.info.version }}</p>
    <p><strong>Description:</strong> {{ item.openapidocument.info.description }}</p>
    <p><strong>Proxy APIs:</strong></p>
    <div style="border: 1px solid #e7eaf3; border-radius: .3rem; padding: 1rem;">
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>Proxy Api Name</th>
            <th>Version</th>
            <th>State</th>
            <th>Visibility</th>
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(item, index) in apiProxies" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.openapidocument.info.title }}
            </td>
            <td>
              {{ item.version }}
            </td>
            <td>
              {{ item.apistatename }}
            </td>
            <td>
              {{ item.apivisibilityname }}
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    TbodyCollapsible,
  },
  computed: {
    ...mapState({
      proxies: state => state.proxies.items,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
    }),
    apiProxies() {
      const { proxies, apiStates, apiVisibilityTypes } = this;
      const getApiStateName = (apistateid) => {
        const apiState = apiStates.find(item => item.uuid === apistateid);
        return apiState ? apiState.name : apistateid;
      };
      const getApiVisibilityName = (apivisibilityid) => {
        const apiVisibility = apiVisibilityTypes.find(item => item.uuid === apivisibilityid);
        return apiVisibility ? apiVisibility.name : apivisibilityid;
      };
      return proxies
      .filter(proxy => proxy.businessapiid === this.item.uuid)
      .map(item => ({
        ...item,
        apistatename: getApiStateName(item.apistateid),
        apivisibilityname: getApiVisibilityName(item.apivisibilityid),
      }));
    },
  },
  data() {
    return {
      collapsedRows: [],
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
  },
};
</script>