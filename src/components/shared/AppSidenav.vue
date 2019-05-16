<template>
  <div class="app-sidenav-container">
    <div class="app-sidenav-content">
      <b-form class="switch-organization">
        <label class="text-uppercase font-weight-bold">Organization</label>
        <div class="row">
          <b-form-select
            :value="currentUser.organizationid"
            v-b-tooltip.hover 
            title="Change Organization"
            :options="organizationOptions"
            @change="handleOrganizationChange"
            data-qa="sideMenuSwitchOrganization"
            style="width: 100%;"
          ></b-form-select>
        </div>
      </b-form>
      <ul class="sidenav-links">
        <li>
          <!-- <b-link to="/app/dashboard" :class="`${currentPage.rootPath === 'dashboard' ? 'selected' : ''}`" data-qa="sideMenuHome" disabled>
            <span><span class="route-icon"><Icon icon="home" /></span> Home<span class="soon"> - Soon</span></span>
          </b-link> -->

          <b-link to="/app/explore" :class="`${currentPage.rootPath === 'explore' ? 'selected' : ''}`" data-qa="sideMenuMarketplace">
            <span class="route-icon"><Icon icon="globe" /></span> Marketplace
          </b-link>

          <!-- <b-link to="/app/analytics" :class="`${currentPage.rootPath === 'analytics' ? 'selected' : ''}`" data-qa="sideMenuAnalytics" disabled> 
            <span class="route-icon"><Icon icon="chart-bar" /></span> Analytics<span class="soon"> - Soon</span>
          </b-link> -->

          <p>MANAGE</p>

          <b-link to="/app/my-apis/my-proxy-apis/1" :class="`${currentPage.rootPath === 'my-apis' ? 'selected' : ''}`" data-qa="sideMenuMyApis">
            <span class="route-icon"><Icon icon="cube" /></span>  My APIs
          </b-link>

          <b-link to="/app/my-apps/my-apps/1" :class="`${currentPage.rootPath === 'my-apps' ? 'selected' : ''}`" data-qa="sideMenuMyApps">
            <span class="route-icon"><Icon icon="cubes" /></span> My Apps
          </b-link>

          <b-link
            to="/app/my-contracts/my-contracts/1"
            :class="`${currentPage.rootPath === 'my-contracts' ? 'selected' : ''}`" data-qa="sideMenuMyContracts">
            <span class="route-icon"><Icon icon="file-signature" /></span> My Contracts
          </b-link> 

          <b-link
            to="/app/my-licenses/my-licenses/1"
            :class="`${currentPage.rootPath === 'my-licenses' ? 'selected' : ''}`" data-qa="sideMenuMyLicenses">
            <span class="route-icon"><Icon icon="certificate" /></span> My Licenses
          </b-link> 
          
          <b-link
            to="/app/my-policies/my-policies/1"
            :class="`${currentPage.rootPath === 'my-policies' ? 'selected' : ''}`" data-qa="sideMenuMyLicenses">
            <span class="route-icon"><Icon icon="atlas" /></span> My Policies
          </b-link> 

          <p>ADMIN</p>
          
          <b-link
            to="/app/organizations/1"
            :class="`${(currentPage.rootPath === 'organizations' || currentPage.rootPath === 'administer-users'|| currentPage.rootPath === 'administer-groups') ? 'selected' : ''}`"
            data-qa="sideMenuOrganizations"
          >
            <span class="route-icon"><Icon icon="sitemap" /></span> Organizations
          </b-link>
          <b-link to="/app/administer-permissions/1" :class="`${currentPage.rootPath === 'administer-permissions' ? 'selected' : ''}`" data-qa="sideMenuPermissions">
            <span class="route-icon"><Icon icon="user-cog" /></span> Permissions
          </b-link> 

          <b-link
            to="/app/identity-managers/1"
            :class="`${(currentPage.rootPath === 'identity-managers' || currentPage.rootPath === 'identity-manager-types') ? 'selected' : ''}`"
            data-qa="sideMenuIdentityManagers"
          >
            <span class="route-icon"><Icon icon="users" /></span> Identity Management
          </b-link> 

          <b-link
            to="/app/access-managers/1"
            :class="`${(currentPage.rootPath === 'access-managers' || currentPage.rootPath === 'access-manager-types' || currentPage.rootPath === 'roles') ? 'selected' : ''}`"
            data-qa="sideMenuAccessManagers"
          >
            <span class="route-icon"><Icon icon="user-tie" /></span> Access Management
          </b-link> 

        </li>
      </ul>
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
        this.userOrganizations = response.data;
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
.app-sidenav-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .app-sidenav-content {
    flex: 1 0 0;
    overflow-y: auto;
  }
}
.soon {
  font-size: 0.8em;
  font-style: italic;
  color:lightcoral;
}
</style>
