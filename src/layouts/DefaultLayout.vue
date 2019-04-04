<template>
  <div id="app" class="app-flex">
    <div class="app-header-flex" v-if="user.signedIn">
      <AppHeader />
    </div>
    <div class="app-body-flex" v-if="user.signedIn">
      <div class="app-sidenav-flex">
        <AppSidenav />
      </div>
      <div class="app-content-flex" v-if="user.uuid">
        <router-view></router-view>
      </div>
    </div>
    <LoadingModal v-if="isLoading" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppHeader from '@/components/shared/AppHeader';
import AppSidenav from '@/components/shared/AppSidenav';
import LoadingModal from '@/components/shared/modals/LoadingModal';
import SetCookieModal from '@/components/shared/modals/SetCookieModal';

export default {
  name: 'default-layout',
  components: {
    AppHeader,
    AppSidenav,
    LoadingModal,
    SetCookieModal,
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
      user: state => state.user,
    }),
  },
};
</script>
