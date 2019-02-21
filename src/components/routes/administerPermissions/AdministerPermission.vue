<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand>{{ permission.permission }}</b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="cog" />
              <em>Operations</em>
            </template>
            <b-dropdown-item :to="`/app/administer-permissions/${page}/edit/${permission.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
            <b-dropdown-item :to="`/app/administer-permissions/${page}/delete/${permission.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>
          </b-nav-item-dropdown>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;">
      <p>Permission Name: {{ permission.permission }}</p>
      <p>Description: {{ permission.description }}</p>
      <p>Resource: {{ permission.resourcename}}</p>
      <p>Resource Type: {{ permission.resourcetypename }}</p>
      <p>Subject: {{ subject.displayname }}</p>
      <p>Subject Type: {{ subjectType.typename }}</p>
      <p>Resource Action: {{ permission.resourceactionname }}</p>
      <p>Access Manager: {{ permission.accessmanagername }}</p>
      <p>Organization: {{ permission.organizationname }}</p>
      <p>Effective Start Date: {{ permission.effectivestartdate }}</p>
      <p>Effective End Date: {{permission.effectiveenddate}}</p>
      <p>Created: {{ permission.created }}</p>
      <p>Updated: {{ permission.updated }}</p>
      <p v-if="permission.isdeleted">Deleted: {{ permission.deleted }}</p>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
  },
  props: {
    permission: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    subjectTypes: {
      type: Array,
      required: false,
      default() { return []; },
    },
    page: {
      type: Number,
      required: false,
      default() { return 1; },
    },
  },
  data() {
    return {
      subject: {},
      subjectType: {},
    };
  },
  methods: {
    getSubject() {
      const { subjectid } = this.permission;
      api.getSubject(subjectid).then((response) => {
        this.subject = response.data[0];
        this.subjectType = this.subjectTypes.find(item =>
          item.uuid === this.subject.subjecttypeid) || {};
      });
    },
  },
  mounted() {
    this.getSubject();
  },
};
</script>
