<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-auto pb-3">
        <Pictures :uuid="group.uuid" :altText="group.displayname" type="subjects" shape="square" width="200px" :lastUpdatedAt="itemsLastUpdatedAt"></Pictures>
      </dl>
      <dl class="col">
        <dt>Group Name:</dt>
        <dd>{{ group.subjectname }}</dd>
        <dt>Group Display Name:</dt>
        <dd>{{ group.displayname }}</dd>
        <dt>Description:</dt>
        <dd>{{ group.description }}</dd>
        <dt>Organization:</dt>
        <dd>{{ group.organizationname }}</dd>
      </dl>
      <dl class="col">
        <dt>Directory:</dt>
        <dd>{{ group.directoryname }}</dd>
        <dt>url:</dt>
        <dd>{{ group.url }}</dd>
        <dt>Active:</dt>
        <dd>{{ group.isactivated | booleanToText }}</dd>
        <dt>Locked:</dt>
        <dd>{{ group.islocked | booleanToText }}</dd>
      </dl>
      <dl class="col">
        <dt>Effective Start Date:</dt>
        <dd>{{ group.effectivestartdate | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Effective End Date:</dt>
        <dd>{{ group.effectiveenddate | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Created:</dt>
        <dd>{{ group.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="!group.isdeleted">Updated:</dt>
        <dd v-if="!group.isdeleted">{{ group.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="group.isdeleted">Deleted:</dt>
        <dd v-if="group.isdeleted">{{ group.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
      </dl>
    </div>
    <div class="row abyss-table-buttons">
      <b-button
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Group Users"
        @click="listGroupUsers"
        :class="{'active': isShowGroupUsers}"
        v-if="group.users.length"
      >
        <Icon icon="users" /> Users
        <b-badge pill>{{ group.users.length }}</b-badge>
      </b-button>
    </div>
    <div v-if="isShowGroupUsers && group.users.length">
      <Users
        :rows="group.users"
        :routePath="routePath"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';
import Pictures from '@/components/shared/Pictures';

export default {
  name: 'Group',
  components: {
    Icon,
    Pictures,
    Users: () => import('@/components/routes/users/shared/Users'),
  },
  props: {
    group: {
      Type: Object,
      required: false,
      default() { return {}; },
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      navigationFrom: state => state.traffic.navigationFrom,
      navigationTo: state => state.traffic.navigationTo,
      itemsLastUpdatedAt: state => state.groups.lastUpdatedAt,
    }),
  },
  data() {
    return {
      isShowGroupUsers: false,
    };
  },
  mounted() {},
  methods: {
    listGroupUsers() {
      this.isShowGroupUsers = !this.isShowGroupUsers;
    },
  },
};
</script>
