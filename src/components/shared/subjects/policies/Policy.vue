<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand>{{ item.name}}</b-navbar-brand>

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
            <b-dropdown-item :to="`${routePath}/logs/${item.uuid}/policy/1`">All</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="cog" />
              <em>Operations</em>
            </template>
            <b-dropdown-item :to="`${routePath}/edit-policy/${item.uuid}`"><Icon icon="edit" /> Edit Policy</b-dropdown-item>
            <b-dropdown-item :to="`${routePath}/delete-policy/${item.uuid}`"><Icon icon="trash-alt" /> Delete License</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;" class="row">
      <div class="col">
      <dt>Name:</dt>
      <dd>{{ item.name }}</dd>
      <dt>Id:</dt>
      <dd><code>{{ item.uuid }}</code></dd>
      <dt>Organization:</dt>
      <dd>{{ getOrganizationName(item.organizationid) }}</dd>
      <dt>Description:</dt>
      <dd>{{ item.description }}</dd>
      </div>
      <div class="col">
        <dt>Type:</dt>
        <dd>{{ item.policyinstance.info.type }}</dd>
        <dt>Subtype:</dt>
        <dd>{{ item.policyinstance.info.subType }}</dd>
        <dt>Title:</dt>
        <dd>{{ item.policyinstance.info.title }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.policyinstance.info.description }}</dd>
      </div>
      <div class="col">
          <dt>Business Request</dt>
        <dd>
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onBusinessRequest ? 'business-true' : ''" />
        </dd>
          <dt>Business Response</dt>
        <dd>
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onBusinessResponse ? 'business-true' : ''" />
        </dd>
          <dt>Proxy Request</dt>
        <dd>
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onProxyRequest ? 'proxy-true' : ''" />
        </dd>
          <dt>Proxy Response</dt>
        <dd>
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onProxyResponse ? 'proxy-true' : ''" />
        </dd>
      </div>
      <div class="col">
        <dt>Created:</dt>
        <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Updated:</dt>
        <dd>{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="item.isdeleted">Deleted:</dt>
        <dd v-if="item.isdeleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';

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
    organizations: {
      type: Array,
      required: false,
    },
  },
  components: {
    Icon,
  },
  // computed: {
  //   ...mapState({
  //     organizations: state => state.organizations.items,
  //   }),
  // },
  methods: {
    getOrganizationName(organizationId) {
      const { organizations } = this;
      const organization = organizations.find(i => i.uuid === organizationId) || {};
      return organization.name || organizationId;
    },
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
    };
  },
};
</script>
<style lang="scss" scoped>
.flex-container {
  display: flex;
  justify-content: space-between;
  border: 1px;
}
.business-true {
  color: cyan;
}
.proxy-true {
  color: purple;
}
</style>