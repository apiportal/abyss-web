<template>
  <div class="app-header">
    <b-navbar toggleable="md" style="padding: 0;">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand><img src="/static/abyss_dark.png" class="logo" /></b-navbar-brand>
      <b-collapse is-nav id="nav_collapse" v-if="user.uuid">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right class="navbar-user">
            <!-- Using button-content slot -->
            <template slot="button-content">
              <div class="d-flex align-items-center" data-qa="navbarUser">
                <span v-if="user.props">{{ user.props.displayname }}</span>
                <Pictures :uuid="user.uuid" :altText="user.props.displayname" type="subjects" shape="circle ml-2" width="44px" height="44px" :lastUpdatedAt="itemsLastUpdatedAt"></Pictures>
              </div>
            </template>
            <b-dropdown-item to="/app/my-profile/" data-qa="navbarMyProfile">
              <Icon icon="user" />
              My Profile
            </b-dropdown-item>
            <b-dropdown-item to="/app/my-settings/" data-qa="navbarSettings">
              <Icon icon="cog" />
              Settings
            </b-dropdown-item>
            <b-dropdown-item @click="handleSignOut" data-qa="navbarSignOut">
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
import Pictures from '@/components/shared/Pictures';

export default {
  name: 'app-header',
  components: {
    Icon,
    Pictures,
  },
  computed: {
    ...mapState({
      user: state => state.user,
      itemsLastUpdatedAt: state => state.user.lastUpdatedAt,
    }),
  },
  methods: {
    handleSignOut(evt) {
      evt.preventDefault();
      const { sessionid } = this.user;
      api.deleteSession(sessionid).then(() => {
        this.$store.dispatch('user/resetUser');
        setTimeout(function() { location.reload(); }, 10); // eslint-disable-line
      });
    },
  },
  data() {
    return {};
  },
};
</script>
