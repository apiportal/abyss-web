<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col">
        <dt>Description:</dt>
        <dd>{{ item.description }}</dd>
      </dl>
      <dl class="col">
        <dt>UUID:</dt>
        <dd>{{ item.uuid }}</dd>
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
    <div class="row abyss-table-buttons">
      <b-button
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Users"
        @click="listRoleUsers" 
        :class="{'active': isShowRoleUsers}"
        v-if="item.users.length"
      >
        <Icon icon="users" /> Users
        <b-badge pill>{{ item.users.length }}</b-badge>
      </b-button>
    </div>
    <div class="abyss-table-content" v-if="isShowRoleUsers && item.users.length">
      <Users
        :rows="item.users"
        :routePath="`/app/roles/${page}`"
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
  },
  data() {
    return {
      isShowRoleUsers: false,
    };
  },
  mounted() {
    // get role users
  },
  methods: {
    listRoleUsers() {
      this.isShowRoleUsers = !this.isShowRoleUsers;
    },
  },
};
</script>