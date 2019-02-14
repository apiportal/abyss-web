<template>
  <div>
    <div class="row">
      <dl class="px-3">
        <dt class="bg-cover mb-2 bg-secondary rounded-circle embed-responsive embed-responsive-1by1" style="width: 150px;" :style="{ 'background-image': 'url(' + group.picture + ')' }"></dt>
      </dl>
      <dl class="col">
        <dt>Group Name:</dt>
        <dd>{{ group.subjectname }}</dd>
        <dt>Group Display Name:</dt>
        <dd>{{ group.displayname }}</dd>
        <dt>Description:</dt>
        <dd>{{ group.description }}</dd>
      </dl>
      <dl class="col">
        <dt>Organization:</dt>
        <dd>{{ group.organizationname }}</dd>
        <dt>Directory:</dt>
        <dd>{{ group.directoryname }}</dd>
        <dt>url:</dt>
        <dd>{{ group.url }}</dd>
      </dl>
     
      <dl class="col">
        <dt>effectiveenddate:</dt>
        <dd>{{ group.effectiveenddate }}</dd>
        <dt>effectivestartdate:</dt>
        <dd>{{ group.effectivestartdate }}</dd>
        <dt>uuid:</dt>
        <dd><code>{{ group.uuid }}</code></dd>
      </dl>
      
      <dl class="col-1">
        <dt>Active:</dt>
        <dd>{{ group.isactivated }}</dd>
        <dt>Deleted:</dt>
        <dd>{{ group.isdeleted }}</dd>
        <dt>Locked:</dt>
        <dd>{{ group.islocked }}</dd>
      </dl>
      
      <dl class="col">
        <dt>Created:</dt>
        <dd>{{ group.created }}</dd>
        <dt>Updated:</dt>
        <dd>{{ group.updated }}</dd>
        <dt>Deleted:</dt>
        <dd>{{ group.deleted }}</dd>
      </dl>
    </div>
    <div>
      <b-dropdown variant="secondary" size="sm">
        <template slot="button-content">
          <Icon icon="list-ol" />
          <span>Logs</span>
        </template>
        <b-dropdown-item :to="`/app/administer-groups/${page}/logs/${group.uuid}/all/1`">All</b-dropdown-item>
      </b-dropdown>
      <b-button
        :to="`/app/administer-groups/${page}/edit/${group.uuid}`"
        size="sm"
        variant="secondary"
        v-b-tooltip.hover
        title="Edit"
      >
        <Icon icon="edit" />
        <span>Edit</span>
      </b-button>
      <b-button
        :to="`/app/administer-groups/${page}/delete/${group.uuid}`"
        size="sm"
        variant="danger"
        v-b-tooltip.hover
        title="Delete"
      >
        <Icon icon="trash-alt" />
        <span>Delete</span>
      </b-button>
      <b-button
        size="sm"
        variant="info"
        v-b-tooltip.hover
        title="Users"
        @click="listGroupUsers"
      >
        Users <Icon icon="users" />
      </b-button>
    </div>
    <div v-if="isShowGroupUsers && group.users.length">
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
