<template>
  <div>
    <b-form class="switch-organization">
      <label class="text-uppercase">Organization</label>
      <div class="row">
        <b-form-select
          size="md"
          class="px-3"
          :value="currentUser.organizationid"
          :options="organizationOptions"
          @change="handleOrganizationChange"
          data-qa="sideMenuSwitchOrganization"
          style="width: 100%;"
        ></b-form-select>
      </div>
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

        <b-link to="/app/my-apis/my-proxy-apis/1" :class="`${currentPage.rootPath === 'my-apis' ? 'selected' : ''}`" data-qa="sideMenuMyApis">
          <span class="route-icon"><Icon icon="cube" /></span>  My APIs
        </b-link>

        <b-link to="/app/my-apps/my-apps/1" :class="`${currentPage.rootPath === 'my-apps' ? 'selected' : ''}`" data-qa="sideMenuMyApps">
          <span class="route-icon"><Icon icon="cubes" /></span> My Apps
        </b-link>

        <b-link to="/app/my-licenses/my-licenses/1" :class="`${currentPage.rootPath === 'my-licenses' ? 'selected' : ''}`" data-qa="sideMenuMyLicenses">
          <span class="route-icon"><Icon icon="certificate" /></span> My Licenses
        </b-link> 

        <!-- <b-link to="/app/my-policies/my-policies/1" class="pl--4" :class="`${currentPage.rootPath === 'my-policies' ? 'selected' : ''}`" data-qa="sideMenuPolicies">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My Policies
        </b-link> 

        <b-link to="/app/my-slas/1" class="pl--4" :class="`${currentPage.rootPath === 'my-slas' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My SLAs
        </b-link> 
        
        <b-link to="/app/my-policies/my-aggreements/1" class="pl--4" :class="`${currentPage.rootPath === 'my-aggreements' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My Legal Agreements
        </b-link>  -->

        <p>ADMIN</p>


        <!-- <b-link to="/app/administer-users/users/1" :class="`${currentPage.rootPath === 'administer-users' ? 'selected' : ''}`" data-qa="sideMenuUsers">
          <span class="route-icon"><Icon icon="user" /></span> Users
        </b-link> 

        <b-link to="/app/administer-groups/1" :class="`${currentPage.rootPath === 'administer-groups' ? 'selected' : ''}`" data-qa="sideMenuGroups">
          <span class="route-icon"><Icon icon="users" /></span> Groups
        </b-link>  -->
        
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
    }),
    organizationOptions() {
      const { userOrganizations, organizations } = this;
      return userOrganizations.map((item) => {
        const organization = organizations.find(org => org.uuid === item.organizationrefid);
        return {
          text: organization ? organization.name : item.organizationrefid,
          value: item.organizationrefid,
        };
      });
    },
  },
  data() {
    return {
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
        this.userOrganizations = response.data.filter(item => !item.isdeleted);
      });
    },
    handleOrganizationChange(newOrganizationUuid) {
      const { organizations } = this;
      const organization = organizations.find(org => org.uuid === newOrganizationUuid);
      const { name, uuid } = organization;
      api.putSetCurrentOrganization({
        organizationid: uuid,
        organizationname: name,
      }).then((response) => {
        if (response && response.data) {
          // this.$store.dispatch('user/resetUser');
          const { principalid, sessionid, organizationid, organizationname } = response.data;
          this.$store.dispatch('user/getUser', { principalid, sessionid, organizationid, organizationname, refresh: true });
        }
      });
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
