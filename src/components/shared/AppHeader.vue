<template>
  <div class="app-header">
    <b-navbar toggleable="md" style="padding: 0;">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/app/dashboard"><img src="/static/abyss_dark.png" class="logo" /></b-navbar-brand>
      <b-collapse is-nav id="nav_collapse" v-if="user.uuid">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right class="navbar-user">
            <!-- Using button-content slot -->
            <template slot="button-content">
              <div id="IdNavbarUser" class="d-flex align-items-center">
                <span>{{ user.props.displayname }}</span>
                <span class="bg-cover bg-secondary rounded-circle avatar"></span>
              </div>
            </template>
            <b-dropdown-item to="/app/my-profile/">
              <Icon icon="user" />
              My Profile
            </b-dropdown-item>
            <b-dropdown-item to="/app/my-settings/">
              <Icon icon="cog" />
              Settings
            </b-dropdown-item>
            <b-dropdown-item @click="handleSignOut">
              <Icon icon="sign-out-alt" />
              Signout
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import Icon from '@/components/shared/Icon';

export default {
  name: 'app-header',
  components: {
    Icon,
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  },
  methods: {
    handleSignOut(evt) {
      evt.preventDefault();
      const { sessionid } = this.user;
      api.deleteSession(sessionid).then(() => {
        this.$store.dispatch('user/resetUser');
        this.$router.push('/auth/login/');
      });
    },
  },
  data() {
    return {};
  },
};
</script>
