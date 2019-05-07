<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-4">
        <dt>Permission Name:</dt>
        <dd>{{ permission.permission }}</dd>
        <dt>Description:</dt>
        <dd>{{ permission.description }}</dd>
        <dt>Organization:</dt>
        <dd>{{ permission.organizationname }}</dd>
        <dt>Access Manager:</dt>
        <dd>{{ permission.accessmanagername }}</dd>
      </dl>
      <dl class="col">
        <dt>Subject Type:</dt>
        <dd>{{ subjectType.typename }}</dd>
        <dt>Subject:</dt>
        <dd>{{ subject.displayname }}</dd>
      </dl>
      <dl class="col">
        <dt>Resource Type:</dt>
        <dd>{{ permission.resourcetypename }}</dd>
        <dt>Resource:</dt>
        <dd>{{ permission.resourcename }}</dd>
        <dt>Resource Action:</dt>
        <dd>{{ permission.resourceactionname }}</dd>
      </dl>
      <dl class="col">
        <dt>Effective Start Date:</dt>
        <dd>{{ permission.effectivestartdate | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Effective End Date:</dt>
        <dd>{{ permission.effectiveenddate | moment("DD.MM.YYYY HH:mm") }}</dd>
      </dl>
      <dl class="col">
        <dt>Created:</dt>
        <dd>{{ permission.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="!permission.isdeleted">Updated:</dt>
        <dd v-if="!permission.isdeleted">{{ permission.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="permission.isdeleted">Deleted:</dt>
        <dd v-if="permission.isdeleted">{{ permission.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      subjectTypes: state => state.subjectTypes.items,
    }),
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
      })
      .catch((error) => {
        if (error.status === 404) {
          this.subject = {};
          this.subjectType = {};
        }
      });
    },
  },
  mounted() {
    this.getSubject();
  },
};
</script>
