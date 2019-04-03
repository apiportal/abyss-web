<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col">
        <dt>Name:</dt>
        <dd>{{ item.name }}</dd>
        <dt>Organization:</dt>
        <dd>{{ getOrganizationName(item.organizationid) }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.description }}</dd>
      </dl>
      <dl class="col" v-if="item.policyinstance && item.policyinstance.info">
        <dt>Type:</dt>
        <dd>{{ item.policyinstance.info.type }}</dd>
        <dt>Subtype:</dt>
        <dd>{{ item.policyinstance.info.subType }}</dd>
        <dt>Title:</dt>
        <dd>{{ item.policyinstance.info.title }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.policyinstance.info.description }}</dd>
      </dl>
      <dl class="col" v-if="item.policyinstance && item.policyinstance.openApiLifeCycle">
        <dt>Business Request</dt>
        <dd class="text-black-50">
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onBusinessRequest ? 'business-true' : ''" />
        </dd>
          <dt>Business Response</dt>
        <dd class="text-black-50">
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onBusinessResponse ? 'business-true' : ''" />
        </dd>
          <dt>Proxy Request</dt>
        <dd class="text-black-50">
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onProxyRequest ? 'proxy-true' : ''" />
        </dd>
          <dt>Proxy Response</dt>
        <dd class="text-black-50">
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onProxyResponse ? 'proxy-true' : ''" />
        </dd>
      </dl>
      <dl class="col">
        <dt>Created:</dt>
        <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="!item.isdeleted">Updated:</dt>
        <dd v-if="!item.isdeleted">{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="item.isdeleted">Deleted:</dt>
        <dd v-if="item.isdeleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
      </dl>
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
.business-true {
  color: cyan;
}
.proxy-true {
  color: purple;
}
</style>