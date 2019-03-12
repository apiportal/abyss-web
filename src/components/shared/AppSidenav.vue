<template>
  <div>
    <ul class="sidenav-links">
      <li>
        <b-link to="/app/dashboard" :class="`${currentPage.rootPath === 'dashboard' ? 'selected' : ''}`">
          <span><span class="route-icon"><Icon icon="tachometer-alt" /></span> Dashboard</span>
        </b-link>

        <b-link to="/app/my-apis/businesses/1" :class="`${currentPage.rootPath === 'my-apis' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="cube" /></span>  My APIs
        </b-link>

        <b-link to="/app/my-apps/my-apps/1" :class="`${currentPage.rootPath === 'my-apps' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="cubes" /></span> My Apps
        </b-link>

        <b-link to="/app/my-licenses/my-licenses/1" :class="`${currentPage.rootPath === 'my-licenses' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="certificate" /></span> My Licenses
        </b-link> 

        <b-link to="/app/my-policies/my-policies/1" :class="`${currentPage.rootPath === 'my-policies' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="file-powerpoint" /></span> My Policies
        </b-link> 

        <b-link to="/app/explore" :class="`${currentPage.rootPath === 'explore' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="globe" /></span> Explore
        </b-link>

        <p>ADMIN</p>


        <b-link to="/app/administer-users/1" :class="`${currentPage.rootPath === 'administer-users' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="user" /></span> Users
        </b-link> 

        <b-link to="/app/administer-groups/1" :class="`${currentPage.rootPath === 'administer-groups' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="users" /></span> Groups
        </b-link> 
        
        <b-link to="/app/organizations/1" :class="`${currentPage.rootPath === 'organizations' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="sitemap" /></span> Organizations
        </b-link>
        <b-link to="/app/administer-permissions/1" :class="`${currentPage.rootPath === 'administer-permissions' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="user-cog" /></span> Permissions
        </b-link> 

        <b-link to="/app/identity-managers/1" :class="`${currentPage.rootPath === 'identity-managers' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="users" /></span> Identity Managers
        </b-link> 

        <b-link to="/app/identity-manager-types/1" :class="`${currentPage.rootPath === 'identity-manager-types' ? 'selected' : ''}`">
          <span class="route-icon" style="visibility: hidden"><Icon icon="id-card" /></span> Identity Manager Types
        </b-link> 

        <b-link to="/app/access-managers/1" :class="`${currentPage.rootPath === 'access-managers' ? 'selected' : ''}`">
          <span class="route-icon"><Icon icon="user-tie" /></span> Access Managers
        </b-link> 

        <b-link to="/app/access-manager-types/1" :class="`${currentPage.rootPath === 'access-manager-types' ? 'selected' : ''}`">
          <span class="route-icon" style="visibility: hidden"><Icon icon="id-card" /></span> Access Manager Types
        </b-link> 

      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
  },
  computed: {
    ...mapState({
      currentPage: state => state.currentPage,
    }),
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
// ul.sidenav-links {
//   list-style-type: none;
//   padding: 0;

//   li {
//     a {
//       display: block;
//       position: relative;
//       padding-left: 2.5rem;
//       padding-top: .5rem;
//       padding-bottom: .5rem;
//       color: #C5B7C6;
//       text-decoration: none;

//       &:hover {
//         background-color: #350D36;
//       }

//       &.selected {
//         background-color: #1164A3;
//         color: white;
//       }

//       .route-icon {
//         position: absolute;
//         top: .5em;
//         left: 1rem;
//       }
//     }
//   }
// }
</style>