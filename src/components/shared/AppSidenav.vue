<template>
  <div>
    <b-form inline class="switch-organization">
      <b-form-select
        :value="currentUser.organizationid"
        :options="organizationOptions"
        @change="handleOrganizationChange"
        id="IdMenuSwitchOrganization"
        style="width: 100%;"
      ></b-form-select>
    </b-form>
    <ul class="sidenav-links">
      <li>
        <b-link to="/app/dashboard" :class="`${currentPage.rootPath === 'dashboard' ? 'selected' : ''}`" id="IdMenuHome">
          <span><span class="route-icon"><Icon icon="home" /></span> Home</span>
        </b-link>

        <b-link to="/app/explore" :class="`${currentPage.rootPath === 'explore' ? 'selected' : ''}`" id="IdMenuMarketplace">
          <span class="route-icon"><Icon icon="globe" /></span> Marketplace
        </b-link>

        <b-link to="/app/analytics" :class="`${currentPage.rootPath === 'analytics' ? 'selected' : ''}`" id="IdMenuAnalytics">
          <span class="route-icon"><Icon icon="chart-bar" /></span> Analytics
        </b-link>

        <!-- <b-link to="/app/contracts" :class="`${currentPage.rootPath === 'explore' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="globe" /></span> My Contracts
        </b-link> -->

        <p>MANAGE</p>

        <b-link to="/app/my-apis/businesses/1" :class="`${currentPage.rootPath === 'my-apis' ? 'selected' : ''}`" id="IdMenuMyApis">
          <span class="route-icon"><Icon icon="cube" /></span>  My APIs
        </b-link>

        <b-link to="/app/my-apps/my-apps/1" :class="`${currentPage.rootPath === 'my-apps' ? 'selected' : ''}`" id="IdMenuMyApps">
          <span class="route-icon"><Icon icon="cubes" /></span> My Apps
        </b-link>

        <b-link to="/app/my-licenses/my-licenses/1" :class="`${currentPage.rootPath === 'my-licenses' ? 'selected' : ''}`" id="IdMenuMyLicenses">
          <span class="route-icon"><Icon icon="certificate" /></span> My Licenses
        </b-link> 

        <b-link to="/app/my-policies/my-policies/1" class="pl--4" :class="`${currentPage.rootPath === 'my-policies' ? 'selected' : ''}`" id="IdMenuPolicies">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My Policies
        </b-link> 

        <!-- <b-link to="/app/my-slas/1" class="pl--4" :class="`${currentPage.rootPath === 'my-slas' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My SLAs
        </b-link> 
        
        <b-link to="/app/my-policies/my-aggreements/1" class="pl--4" :class="`${currentPage.rootPath === 'my-aggreements' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My Legal Agreements
        </b-link>  -->

        <p>ADMIN</p>


        <b-link to="/app/administer-users/1" :class="`${currentPage.rootPath === 'administer-users' ? 'selected' : ''}`" id="IdMenuUsers">
          <span class="route-icon"><Icon icon="user" /></span> Users
        </b-link> 

        <b-link to="/app/administer-groups/1" :class="`${currentPage.rootPath === 'administer-groups' ? 'selected' : ''}`" id="IdMenuGroups">
          <span class="route-icon"><Icon icon="users" /></span> Groups
        </b-link> 
        
        <b-link to="/app/organizations/1" :class="`${currentPage.rootPath === 'organizations' ? 'selected' : ''}`" id="IdMenuOrganizations">
          <span class="route-icon"><Icon icon="sitemap" /></span> Organizations
        </b-link>
        <b-link to="/app/administer-permissions/1" :class="`${currentPage.rootPath === 'administer-permissions' ? 'selected' : ''}`" id="IdMenuPermissions">
          <span class="route-icon"><Icon icon="user-cog" /></span> Permissions
        </b-link> 

        <b-link to="/app/identity-managers/1" :class="`${currentPage.rootPath === 'identity-managers' ? 'selected' : ''}`" id="IdMenuIdentityManagers">
          <span class="route-icon"><Icon icon="users" /></span> Identity Managers
        </b-link> 

        <!-- <b-link to="/app/identity-manager-types/1" :class="`${currentPage.rootPath === 'identity-manager-types' ? 'selected' : ''}`">
          <span class="route-icon" style="visibility: hidden"><Icon icon="id-card" /></span> Identity Manager Types
        </b-link>  -->

        <b-link to="/app/access-managers/1" :class="`${currentPage.rootPath === 'access-managers' ? 'selected' : ''}`" id="IdMenuAccessManagers">
          <span class="route-icon"><Icon icon="user-tie" /></span> Access Managers
        </b-link> 

        <!-- <b-link to="/app/access-manager-types/1" :class="`${currentPage.rootPath === 'access-manager-types' ? 'selected' : ''}`">
          <span class="route-icon" style="visibility: hidden"><Icon icon="id-card" /></span> Access Manager Types
        </b-link>  -->

      </li>
    </ul>
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
  computed: {
    ...mapState({
      currentUser: state => state.user,
      currentPage: state => state.currentPage,
      organizations: state => state.organizations.items,
      rootOrganization: state => state.organizations.rootOrganization,
    }),
    organizationOptions() {
      const { userOrganizations } = this;
      return userOrganizations.map(item => ({
        text: item.organizationid,
        value: item.organizationid,
      }));
    },
  },
  data() {
    return {
      currentOrganization: this.rootOrganization,
      userOrganizations: [],
    };
  },
  created() {
    this.$store.dispatch('organizations/getOrganizations', {});
  },
  mounted() {
    this.getOrganizationOptions();
  },
  methods: {
    getOrganizationOptions() {
      const { uuid } = this.currentUser;
      api.getSubjectOrganizationsByUuid(uuid).then((response) => {
        this.userOrganizations = response.data;
      });
    },
    handleOrganizationChange(newOrganizationUuid) {
      console.log(newOrganizationUuid); // eslint-disable-line
    },
  },
};
</script>
