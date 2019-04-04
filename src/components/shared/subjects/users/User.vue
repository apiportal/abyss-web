<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-auto">
        <dt class="bg-cover mb-2 bg-secondary rounded-circle embed-responsive embed-responsive-1by1" style="width: 150px;" :style="{ 'background-image': 'url(' + user.picture + ')' }"></dt>
      </dl>
  
      <dl class="col">
        <dt>First Name:</dt>
        <dd>{{ user.firstname }}</dd>
        <dt>Last Name:</dt>
        <dd>{{ user.lastname }}</dd>
        <dt>User Name:</dt>
        <dd>{{ user.subjectname }}</dd>
        <dt>Display Name:</dt>
        <dd>{{ user.displayname }}</dd>
      </dl>
  
      <dl class="col">
        <dt>Main Organization:</dt>
        <dd>{{ user.organizationname }}</dd>
        <dt>Organizations:</dt>
        <dd>
          <span 
            v-for="(organization, index) in computedUserOrganizations"
            v-bind:key="index"
          >
            {{ organization.subjectorganizationname }}<span v-if="index < computedUserOrganizations.length - 1">,</span>
          </span>
        </dd>
        <dt>Directory:</dt>
        <dd>{{ user.directoryname }}</dd>
        <dt>Url:</dt>
        <dd>{{ user.url }}</dd>
      </dl>
  
      <dl class="col">
        <dt>Email:</dt>
        <dd>{{ user.email }}</dd>
        <dt>Secondary Email:</dt>
        <dd>{{ secondaryEmail }}</dd>
        <dt>Groups:</dt>
        <dd>
          <span 
            v-for="(membership, index) in computedMemberships"
            v-bind:key="index"
          >
            {{ membership.subjectgroupname }}<span v-if="index < computedMemberships.length - 1">,</span>
          </span>
        </dd>
        <dt>Description:</dt>
        <dd>{{ user.description }}</dd>
      </dl>
      
      <dl class="col">
        <dt>Active:</dt>
        <dd>{{ user.isactivated | booleanToText }}</dd>
        <dt>Locked:</dt>
        <dd>{{ user.islocked | booleanToText }}</dd>
        <dt>Created:</dt>
        <dd>{{ user.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="!user.isdeleted">Updated:</dt>
        <dd v-if="!user.isdeleted">{{ user.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="user.isdeleted">Deleted:</dt>
        <dd v-if="user.isdeleted">{{ user.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import api from '@/api';
import Icon from '@/components/shared/Icon';

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
    groups: {
      Type: Array,
      required: false,
      default() { return []; },
    },
    organizations: {
      type: Array,
      required: false,
    },
  },
  components: {
    Icon,
  },
  computed: {
    secondaryEmail() {
      const { email, secondaryemail } = this.user;
      if (secondaryemail === email) {
        return '';
      }
      return secondaryemail;
    },
    computedMemberships() {
      const { memberships, groups } = this;
      return memberships.map((item) => {
        const subjectgroup = groups.find(group => group.uuid === item.subjectgroupid);
        return {
          subjectgroupid: item.subjectgroupid,
          subjectgroupname: subjectgroup ? subjectgroup.displayname : item.subjectgroupid,
        };
      });
    },
    computedUserOrganizations() {
      const { userOrganizations, organizations } = this;
      return userOrganizations.map((item) => {
        const subjectorganization = organizations.find(
          org => org.uuid === item.organizationrefid);
        return {
          organizationrefid: item.organizationrefid,
          subjectorganizationname: subjectorganization ?
          subjectorganization.name : item.organizationrefid,
        };
      });
    },
  },
  mounted() {
    this.getSubjectMemberships();
    this.getOrganizationsOfUser();
  },
  methods: {
    getSubjectMemberships() {
      api.getSubjectMemberships(this.user.uuid).then((response) => {
        if (response && response.data) {
          this.memberships = response.data;
        }
        this.isMembershipsLoaded = true;
      });
    },
    getOrganizationsOfUser() {
      api.getOrganizationsOfUser(this.user.uuid).then((response) => {
        if (response && response.data) {
          this.userOrganizations = response.data;
        }
      });
    },
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      memberships: [],
      userOrganizations: [],
    };
  },
};
</script>
