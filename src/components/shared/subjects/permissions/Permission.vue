<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-4">
        <dt>Name:</dt>
        <dd>{{ permission.permission }}</dd>
        <dt>Description:</dt>
        <dd>{{ permission.description }}</dd>
        <dt>Access Manager:</dt>
        <dd>{{ permission.accessmanagername }}</dd>
      </dl>
      <dl class="col">
        <dt>Subject:</dt>
        <dd>{{ subject.displayname }}</dd>
        <dt>Subject Type:</dt>
        <dd>{{ subjectType.typename }}</dd>
        <dt>Organization:</dt>
        <dd>{{ permission.organizationname }}</dd>
      </dl>
      <dl class="col">
        <dt>Resource:</dt>
        <dd>{{ permission.resourcename }}</dd>
        <dt>Resource Type:</dt>
        <dd>{{ permission.resourcetypename }}</dd>
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
