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
        <dt>Active:</dt>
        <dd>{{ group.isactivated | booleanToText }}</dd>
      </dl>
      <dl class="col">
        <dt>Organization:</dt>
        <dd>{{ group.organizationname }}</dd>
        <dt>Directory:</dt>
        <dd>{{ group.directoryname }}</dd>
        <dt>url:</dt>
        <dd>{{ group.url }}</dd>
        <dt>Locked:</dt>
        <dd>{{ group.islocked | booleanToText }}</dd>
      </dl>
      <dl class="col">
        <dt>effectiveenddate:</dt>
        <dd>{{ group.effectiveenddate }}</dd>
        <dt>effectivestartdate:</dt>
        <dd>{{ group.effectivestartdate }}</dd>
        <dt>Created:</dt>
        <dd>{{ group.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="!group.isdeleted">Updated:</dt>
        <dd v-if="!group.isdeleted">{{ group.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="group.isdeleted">Deleted:</dt>
        <dd v-if="group.isdeleted">{{ group.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
      </dl>
    </div>
    <div class="abyss-table-content" v-if="isShowGroupUsers && group.users.length">
      <Users
        :users="group.users"
        path="administer-groups"
        title="Group"
        :page="page"
      />
    </div>
  </div>
</template>

<script>
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Users from '@/components/shared/Users';

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
