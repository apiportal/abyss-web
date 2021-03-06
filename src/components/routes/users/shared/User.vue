<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-auto pb-3">
        <Pictures :uuid="user.uuid" :altText="user.displayname" type="subjects" shape="square" width="200px" :lastUpdatedAt="itemsLastUpdatedAt"></Pictures>
      </dl>

      <dl class="col">
        <dt>User Name:</dt>
        <dd>{{ user.subjectname }}</dd>
        <dt>First Name:</dt>
        <dd>{{ user.firstname }}</dd>
        <dt>Last Name:</dt>
        <dd>{{ user.lastname }}</dd>
        <dt>Display Name:</dt>
        <dd>{{ user.displayname }}</dd>
        <dt>Main Organization:</dt>
        <dd>{{ user.organizationname }}</dd>
      </dl>

      <dl class="col">
        <dt>Description:</dt>
        <dd>{{ user.description }}</dd>
        <dt>Directory:</dt>
        <dd>{{ user.directoryname }}</dd>
        <dt>Url:</dt>
        <dd>{{ user.url }}</dd>
        <dt>Email:</dt>
        <dd>{{ user.email }}</dd>
        <dt>Secondary Email:</dt>
        <dd>{{ secondaryEmail }}</dd>
      </dl>

      <dl class="col">
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
    <div class="row abyss-table-buttons">
      <b-button
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="User Organizations"
        @click="listUserOrganizations"
        :class="{'active': isShowUserOrganizations}"
      >
      <Icon icon="home" /> User Organizations
      <b-badge pill>{{ computedUserOrganizations.length }}</b-badge>
      </b-button>

      <b-button
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="User Groups"
        @click="listUserGroups"
        :class="{'active': isShowUserGroups}"
      >
      <Icon icon="users" /> User Groups
      <b-badge pill>{{ userGroups.length }}</b-badge>
      </b-button>

      <b-button
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="User Roles"
        @click="listUserRoles"
        :class="{'active': isShowUserRoles}"
      >
      <Icon icon="id-card" /> User Roles
      <b-badge pill>{{ userRoles.length }}</b-badge>
      </b-button>

    </div>
    <div v-if="isShowUserOrganizations">
      <Organizations
        :rows="computedUserOrganizations"
        :routePath="`/app/users/users/${page}`"
      ></Organizations>
    </div>
    <div v-if="isShowUserGroups">
      <Groups
        :rows="userGroups"
        :routePath="`/app/users/users/${page}`"
      ></Groups>
    </div>
    <div v-if="isShowUserRoles">
      <Roles
        :rows="userRoles"
        :routePath="`/app/users/users/${page}`"
      ></Roles>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import Icon from '@/components/shared/Icon';
import Pictures from '@/components/shared/Pictures';

export default {
  name: 'User',
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
  },
  components: {
    Icon,
    Pictures,
    Organizations: () => import('@/components/shared/subjects/organizations/Organizations'),
    Groups: () => import('@/components/shared/subjects/groups/Groups'),
    Roles: () => import('@/components/shared/subjects/roles/Roles'),
  },
  computed: {
    ...mapState({
      organizations: state => state.organizations.items,
      users: state => state.users.items,
      groups: state => state.groups.items,
      roles: state => state.roles.items,
      itemsLastUpdatedAt: state => state.users.lastUpdatedAt,
    }),
    secondaryEmail() {
      const { email, secondaryemail } = this.user;
      if (secondaryemail === email) {
        return '';
      }
      return secondaryemail;
    },
    userGroups() {
      const userGroups = this.groups.filter(item =>
        this.memberships.some(f =>
          f.subjectgroupid === item.uuid && f.subjectid === this.user.uuid,
        ),
      );
      return userGroups;
    },
    userRoles() {
      const userRoles = this.roles.filter(item =>
        this.memberships.some(r =>
          r.subjectgroupid === item.uuid && r.subjectid === this.user.uuid,
        ),
      );
      return userRoles;
    },
    computedUserOrganizations() {
      const userOrganizations = this.organizations.filter(item => this.userOrganizations.some(f =>
          f.organizationrefid === item.uuid && f.subjectid === this.user.uuid,
        ),
      );
      return userOrganizations;
    },
    /* computedMemberships() {
      const { memberships, groups } = this;
      return memberships.map((item) => {
        const subjectgroup = groups.find(group => group.uuid === item.subjectgroupid);
        return {
          subjectgroup,
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
    }, */
  },
  mounted() {
    this.getSubjectMemberships();
    this.getOrganizationsOfUser();
  },
  methods: {
    getSubjectMemberships() {
      api.getSubjectMemberships(this.user.uuid).then((response) => {
        if (response && response.data) {
          this.memberships = response.data.filter(item => !item.isdeleted);
        }
        this.isMembershipsLoaded = true;
      }).catch((error) => {
        if (error.status === 404) {
          this.memberships = [];
          this.isMembershipsLoaded = true;
        }
      });
    },
    getOrganizationsOfUser() {
      api.getOrganizationsOfUser(this.user.uuid).then((response) => {
        if (response && response.data) {
          this.userOrganizations = response.data.filter(item => !item.isdeleted);
        }
      }).catch((error) => {
        if (error.status === 404) {
          this.userOrganizations = [];
        }
      });
    },
    listUserGroups() {
      this.isShowUserGroups = !this.isShowUserGroups;
      if (this.isShowUserGroups) {
        this.isShowUserOrganizations = false;
        this.isShowUserRoles = false;
      }
    },
    listUserOrganizations() {
      this.isShowUserOrganizations = !this.isShowUserOrganizations;
      if (this.isShowUserOrganizations) {
        this.isShowUserGroups = false;
        this.isShowUserRoles = false;
      }
    },
    listUserRoles() {
      this.isShowUserRoles = !this.isShowUserRoles;
      if (this.isShowUserRoles) {
        this.isShowUserGroups = false;
        this.isShowUserOrganizations = false;
      }
    },
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      memberships: [],
      subjectgroup: [],
      userOrganizations: [],
      isShowUserGroups: false,
      isShowUserOrganizations: false,
      isShowUserRoles: false,
    };
  },
  created() {
    this.$store.dispatch('roles/getRoles', {});
  },
};
</script>
