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
    </div>
  </div>
</template>

<script>
// import api from '@/api';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
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
  },
  computed: {
    // computedMemberships() {
    //   const { memberships, users } = this;
    //   return memberships.map((item) => {
    //     const subjectgroup = users.find(group => group.uuid === item.subjectgroupid);
    //     return {
    //       subjectgroupid: item.subjectgroupid,
    //       subjectgroupname: subjectgroup ? subjectgroup.displayname : item.subjectgroupid,
    //     };
    //   });
    // },
  },
  data() {
    return {
      memberships: [],
    };
  },
  mounted() {
    // this.getSubjectMemberships();
  },
  methods: {
    // getSubjectMemberships() {
    //   api.getSubjectMemberships(this.user.uuid).then((response) => {
    //     if (response && response.data) {
    //       this.memberships = response.data;
    //     }
    //     this.isMembershipsLoaded = true;
    //   });
    // },
  },
};
</script>
