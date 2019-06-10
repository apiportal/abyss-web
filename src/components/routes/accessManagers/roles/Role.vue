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
    <div class="row abyss-table-buttons">
      <b-button
        @click="listRolePermissions"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Role Permissions"
        :class="{'active': isShowRolePermissions}"
        data-qa="btnRolePermissions"
      >
        <Icon icon="user-cog" /> Permissions
        <b-badge pill>{{ item.permissions.length }}</b-badge>
      </b-button>

      <b-button
        @click="listRoleUsers"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Role Users"
        :class="{'active': isShowRoleUsers}"
        data-qa="btnRoleUsers"
      >
        <Icon icon="users" /> Users
        <b-badge pill>{{ item.users.length }}</b-badge>
      </b-button>

      <b-button
        @click="listRoleGroups"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Role Groups"
        :class="{'active': isShowRoleGroups}"
        data-qa="btnRoleGroups"
      >
        <Icon icon="user-friends" /> Groups
        <b-badge pill>{{ item.groups.length }}</b-badge>
      </b-button>
    </div>
    <div v-if="isShowRolePermissions">
      <Permissions
        :rows="item.permissions"
        :routePath="`/app/roles/${page}`"
      />
    </div>
    <div v-if="isShowRoleUsers">
      <Users
        :rows="item.users"
        :routePath="`/app/roles/${page}`"
      />
    </div>
    <div v-if="isShowRoleGroups">
      <Groups
        :rows="item.groups"
        :routePath="`/app/roles/${page}`"
      />
    </div>
  </div>
</template>

<script>
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';

export default {
  components: {
    Icon,
    SortBy,
    TbodyCollapsible,
    Users: () => import('@/components/shared/subjects/users/Users'),
    Groups: () => import('@/components/shared/subjects/groups/Groups'),
    Permissions: () => import('@/components/shared/subjects/permissions/Permissions'),
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
      isShowRolePermissions: false,
      isShowRoleGroups: false,
    };
  },
  mounted() {
    // get role users
  },
  methods: {
    listRoleUsers() {
      this.isShowRolePermissions = false;
      this.isShowRoleGroups = false;
      this.isShowRoleUsers = !this.isShowRoleUsers;
    },
    listRolePermissions() {
      this.isShowRoleUsers = false;
      this.isShowRoleGroups = false;
      this.isShowRolePermissions = !this.isShowRolePermissions;
    },
    listRoleGroups() {
      this.isShowRoleUsers = false;
      this.isShowRolePermissions = false;
      this.isShowRoleGroups = !this.isShowRoleGroups;
    },
  },
};
</script>
