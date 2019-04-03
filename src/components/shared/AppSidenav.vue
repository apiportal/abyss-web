<template>
  <div>
    <b-form inline class="switch-organization">
      <b-form-select
        v-model="currentOrganization"
        :options="organizationOptions" 
        style="width: 100%;"
        data-qa="sideMenuSwitchOrganization"
      ></b-form-select>
    </b-form>
    <ul class="sidenav-links">
      <li>
        <b-link to="/app/dashboard" :class="`${currentPage.rootPath === 'dashboard' ? 'selected' : ''}`" data-qa="sideMenuHome" disabled>
          <span><span class="route-icon"><Icon icon="home" /></span> Home<span class="soon"> - Soon</span></span>
        </b-link>

        <b-link to="/app/explore" :class="`${currentPage.rootPath === 'explore' ? 'selected' : ''}`" data-qa="sideMenuMarketplace">
          <span class="route-icon"><Icon icon="globe" /></span> Marketplace
        </b-link>

        <b-link to="/app/analytics" :class="`${currentPage.rootPath === 'analytics' ? 'selected' : ''}`" data-qa="sideMenuAnalytics" disabled> 
          <span class="route-icon"><Icon icon="chart-bar" /></span> Analytics<span class="soon"> - Soon</span>
        </b-link>

        <!-- <b-link to="/app/contracts" :class="`${currentPage.rootPath === 'explore' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="globe" /></span> My Contracts
        </b-link> -->

        <p>MANAGE</p>

        <b-link to="/app/my-apis/businesses/1" :class="`${currentPage.rootPath === 'my-apis' ? 'selected' : ''}`" data-qa="sideMenuMyApis">
          <span class="route-icon"><Icon icon="cube" /></span>  My APIs
        </b-link>

        <b-link to="/app/my-apps/my-apps/1" :class="`${currentPage.rootPath === 'my-apps' ? 'selected' : ''}`" data-qa="sideMenuMyApps">
          <span class="route-icon"><Icon icon="cubes" /></span> My Apps
        </b-link>

        <b-link to="/app/my-licenses/my-licenses/1" :class="`${currentPage.rootPath === 'my-licenses' ? 'selected' : ''}`" data-qa="sideMenuMyLicenses">
          <span class="route-icon"><Icon icon="certificate" /></span> My Licenses
        </b-link> 

        <b-link to="/app/my-policies/my-policies/1" class="pl--4" :class="`${currentPage.rootPath === 'my-policies' ? 'selected' : ''}`" data-qa="sideMenuPolicies">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My Policies
        </b-link> 

        <!-- <b-link to="/app/my-slas/1" class="pl--4" :class="`${currentPage.rootPath === 'my-slas' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My SLAs
        </b-link> 
        
        <b-link to="/app/my-policies/my-aggreements/1" class="pl--4" :class="`${currentPage.rootPath === 'my-aggreements' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My Legal Agreements
        </b-link>  -->

        <p>ADMIN</p>


        <b-link to="/app/administer-users/1" :class="`${currentPage.rootPath === 'administer-users' ? 'selected' : ''}`" data-qa="sideMenuUsers">
          <span class="route-icon"><Icon icon="user" /></span> Users
        </b-link> 

        <b-link to="/app/administer-groups/1" :class="`${currentPage.rootPath === 'administer-groups' ? 'selected' : ''}`" data-qa="sideMenuGroups">
          <span class="route-icon"><Icon icon="users" /></span> Groups
        </b-link> 
        
        <b-link to="/app/organizations/1" :class="`${currentPage.rootPath === 'organizations' ? 'selected' : ''}`" data-qa="sideMenuOrganizations">
          <span class="route-icon"><Icon icon="sitemap" /></span> Organizations
        </b-link>
        <b-link to="/app/administer-permissions/1" :class="`${currentPage.rootPath === 'administer-permissions' ? 'selected' : ''}`" data-qa="sideMenuPermissions">
          <span class="route-icon"><Icon icon="user-cog" /></span> Permissions
        </b-link> 

        <b-link to="/app/identity-managers/1" :class="`${currentPage.rootPath === 'identity-managers' ? 'selected' : ''}`" data-qa="sideMenuIdentityManagers">
          <span class="route-icon"><Icon icon="users" /></span> Identity Management
        </b-link> 

        <!-- <b-link to="/app/identity-manager-types/1" :class="`${currentPage.rootPath === 'identity-manager-types' ? 'selected' : ''}`">
          <span class="route-icon" style="visibility: hidden"><Icon icon="id-card" /></span> Identity Manager Types
        </b-link>  -->

        <b-link to="/app/access-managers/1" :class="`${currentPage.rootPath === 'access-managers' ? 'selected' : ''}`" data-qa="sideMenuAccessManagers">
          <span class="route-icon"><Icon icon="user-tie" /></span> Access Management
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
      isOrganizationsLoaded: (state => state.organizations.lastUpdatedAt > 0),
      rootOrganization: state => state.organizations.rootOrganization,
    }),
  },
  data() {
    return {
      currentOrganization: this.rootOrganization,
      organizationOptions: [],
    };
  },
  mounted() {
    this.getOrganizationOptions();
  },
  methods: {
    getOrganizationOptions() {
      const { isOrganizationsLoaded } = this;
      if (!isOrganizationsLoaded) {
        setTimeout(function() { this.getOrganizationOptions(); }.bind(this), 500); // eslint-disable-line
        return false;
      }
      const { uuid } = this.currentUser;
      const { organizations } = this;
      api.getSubjectOrganizationsByUuid(uuid).then((response) => {
        const subjectOrganizations = response.data.map(item => item.organizationid);
        this.organizationOptions = organizations
          .filter(item => subjectOrganizations.indexOf(item.uuid) > -1)
          .map(item => ({ text: item.name, value: item.uuid }));
      });
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.soon {
  font-size: 0.8em;
  font-style: italic;
  color:lightcoral;
}
</style>
