<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col">
        <dt>Role Name:</dt>
        <dd>{{ item.subjectname }}</dd>
        <dt>Display Name:</dt>
        <dd>{{ item.displayname }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.description }}</dd>
      </dl>
      <dl class="col">
        <dt>Organization:</dt>
        <dd>{{ item.organizationname }}</dd>
        <dt>Directory:</dt>
        <dd>{{ item.directoryname }}</dd>
        <dt>Active:</dt>
        <dd>{{ item.isactivated | booleanToText }}</dd>
      </dl>
      <dl class="col">
        <dt>Effective Start Date:</dt>
        <dd>{{ item.effectivestartdate | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Effective End Date:</dt>
        <dd>{{ item.effectiveenddate | moment("DD.MM.YYYY HH:mm") }}</dd>
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
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Users from '@/components/shared/subjects/users/Users';
import Permissions from '@/components/shared/subjects/permissions/Permissions';
import Groups from '@/components/shared/subjects/groups/Groups';

export default {
  components: {
    Icon,
    SortBy,
    TbodyCollapsible,
    Users,
    Permissions,
    Groups,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    users: {
      Type: Array,
      required: false,
      default() { return []; },
    },
    page: {
      Type: Number,
      required: false,
      default() { return 1; },
    },
    permissions: {
      Type: Array,
      required: false,
      default() { return []; },
    },
    groups: {
      Type: Array,
      required: false,
      default() { return []; },
    },
  },
  data() {
    return {
      isShowRoleUsers: false,
    };
  },
  mounted() {},
  methods: {
    listRoleUsers() {
      this.isShowRoleUsers = !this.isShowRoleUsers;
    },
  },
};
</script>
