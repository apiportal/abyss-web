<template>
  <div class="app-header">
    <b-navbar toggleable="md" style="padding: 0;">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand to="/app/dashboard"><img src="/static/abyss_dark.png" class="logo" /></b-navbar-brand>

      <b-collapse is-nav id="nav_collapse" v-if="user.uuid">

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <span>{{ user.props.displayname }}</span>
            </template>
            <b-dropdown-item >Dummy Link</b-dropdown-item>
            <b-dropdown-item >Dummy Link</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'app-header',
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  },
};
</script>

<style lang="scss" scoped>
// .app-header {
//   .logo {
//     height: 40px;
//     margin-left: 1rem;
//   }
//   .navbar-brand {
//     background: #400E40;
//     width: 250px;
//   }
// }
</style>