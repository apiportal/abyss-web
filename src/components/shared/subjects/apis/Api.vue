<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-auto">
        <dt style="width: 260px;" class="pb-2">
          <Pictures :uuid="item.uuid" :altText="item.openapidocument.info.title" :color="item.color" type="apis" shape="rectangle" width="200px"></Pictures>
        </dt>
      </dl>
      <dl class="col">
        <dt>Business Api Name:</dt>
        <dd>{{ item.openapidocument.info.title }}</dd>
        <dt>Version:</dt>
        <dd>{{ item.openapidocument.info.version }}</dd>
        <dt>State:</dt>
        <dd>{{ item.apistatename }}</dd>
      </dl>
      <dl class="col">
        <dt>Description:</dt>
        <dd>{{ item.openapidocument.info.description }}</dd>
      </dl>
      <dl class="col">
        <dt>Created:</dt>
        <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Updated:</dt>
        <dd>{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="item.isdeleted">Deleted:</dt>
        <dd v-if="item.isdeleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
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
import Pictures from '@/components/shared/Pictures';

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
    Pictures,
    Proxies: () => import('@/components/shared/subjects/proxies/Proxies'),
  },
  computed: {
    ...mapState({
      currentPage: state => state.currentPage,
      proxies: state => state.proxies.items,
    }),
    apiProxies() {
      const { proxies } = this;
      return proxies.filter(proxy => proxy.businessapiid === this.item.uuid);
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
