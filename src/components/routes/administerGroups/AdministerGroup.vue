<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-auto">
        <dt class="bg-cover mb-2 bg-secondary rounded-circle embed-responsive embed-responsive-1by1" style="width: 150px;" :style="{ 'background-image': 'url(' + group.picture + ')' }"></dt>
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
        <dt>Active:</dt>
        <dd>{{ group.isactivated | booleanToText }}</dd>
        <dt>Directory:</dt>
        <dd>{{ group.directoryname }}</dd>
        <dt>url:</dt>
        <dd>{{ group.url }}</dd>
        <dt>Locked:</dt>
        <dd>{{ group.islocked | booleanToText }}</dd>
      </dl>
      <dl class="col">
        <dt>Effective End Date:</dt>
        <dd>{{ group.effectiveenddate | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Effective Start Date:</dt>
        <dd>{{ group.effectivestartdate | moment("DD.MM.YYYY HH:mm") }}</dd>
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
        title="Users"
        @click="listGroupUsers"
        :class="{'active': isShowGroupUsers}"
        v-if="group.users.length"
      >
        <Icon icon="users" /> Users
        <b-badge pill>{{ group.users.length }}</b-badge>
      </b-button>
    </div>
    <div class="abyss-table-content" v-if="isShowGroupUsers && group.users.length">
      <Users
        :rows="group.users"
        :routePath="`/app/administer-groups/${page}`"
      />
    </div>
  </div>
</template>

<script>
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Users from '@/components/shared/subjects/users/Users';

export default {
  components: {
    Icon,
    SortBy,
    TbodyCollapsible,
    Users,
  },
  props: {
    group: {
      Type: Object,
      required: false,
      default() { return {}; },
    },
    page: {
      Type: Number,
      required: false,
      default() { return 1; },
    },
    users: {
      Type: Array,
      required: false,
      default() { return []; },
    },
    memberships: {
      Type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {},
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
