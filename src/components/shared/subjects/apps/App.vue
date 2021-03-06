<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-auto pb-3">
        <Pictures :uuid="item.uuid" :altText="item.displayname" type="subjects" shape="square" width="200px" :lastUpdatedAt="itemsLastUpdatedAt"></Pictures>
      </dl>
      <dl class="col">
        <dt>App Name:</dt>
        <dd>{{ item.displayname }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.description }}</dd>
        <dt>Organization:</dt>
        <dd>{{ getOrganizationName(item.organizationid) }}</dd>
      </dl>
      <dl class="col">
        <dt>Url:</dt>
        <dd>{{ item.url }}</dd>
        <dt>Directory:</dt>
        <dd>{{ getSubjectDirectoryName(item.subjectdirectoryid) }}</dd>
      </dl>
      <dl class="col">
        <dt>Effective Start Date:</dt>
        <dd>{{ item.effectivestartdate | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Effective End Date:</dt>
        <dd>{{ item.effectiveenddate | moment("DD.MM.YYYY HH:mm") }}</dd>
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
    <div class="row abyss-table-buttons">
      <b-button
        @click="handleToggleContractsTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="APP Contracts"
        :class="{'active': isContractsTableVisible}"
      >
        <span>Contracts</span>
        <b-badge pill>{{ item.contracts.length }}</b-badge>
      </b-button>
    </div>
    <div v-if="isContractsTableVisible && item.contracts.length">
      <Contracts
        :rows="item.contracts"
        :routePath="routePath"
        :isMineApi="false"
        :onNeedsRefreshData="refreshData"
      ></Contracts>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';
import Images from '@/components/shared/Images';
import Pictures from '@/components/shared/Pictures';

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
    childComponent: {
      type: String,
      required: false,
      default() { return 'Contracts'; },
    },
  },
  components: {
    Icon,
    Images,
    Pictures,
    Contracts: () => import('@/components/shared/subjects/contracts/Contracts'),
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      contractStates: state => state.contractStates.items,
      organizations: state => state.organizations.items,
      subjectDirectories: state => state.subjectDirectories.items,
      itemsLastUpdatedAt: state => state.userApps.lastUpdatedAt,
    }),
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      isContractsTableVisible: false,
    };
  },
  methods: {
    handleToggleContractsTable() {
      this.isContractsTableVisible = !this.isContractsTableVisible;
    },
    getOrganizationName(organizationId) {
      const { organizations } = this;
      const organization = organizations.find(i => i.uuid === organizationId) || {};
      return organization.name || organizationId;
    },
    getSubjectDirectoryName(subjectDirectoryId) {
      const { subjectDirectories } = this;
      const directory = subjectDirectories.find(item => item.uuid === subjectDirectoryId) || {};
      return directory.directoryname || subjectDirectoryId;
    },
    refreshData() {
      this.$store.dispatch('userApps/getApps', {
        uuid: this.currentUser.uuid,
        refresh: true,
      });
    },
  },
};
</script>
