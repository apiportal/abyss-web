<template>
  <div id="app" class="app-flex">
    <div class="app-header-flex">
      <AppHeader />
    </div>
    <div class="app-body-flex">
      <div class="app-sidenav-flex">
        <AppSidenav />
      </div>
      <div class="app-content-flex">
        <router-view></router-view>
      </div>
    </div>
    <LoadingModal v-if="isLoadingModalVisible" />
    <SetCookieModal v-if="isSetCookieModalVisible" />
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
      requestsCount: state => state.traffic.requestsCount,
      responsesCount: state => state.traffic.responsesCount,
      hasValidToken: state => state.user.hasValidToken,
    }),
    isLoadingModalVisible() {
      const { requestsCount, responsesCount } = this;
      return requestsCount !== responsesCount;
    },
    isSetCookieModalVisible() {
      const { hasValidToken } = this;
      return !hasValidToken;
    },
  },
};
</script>

<style lang="scss">
.app-flex {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;

  .app-header-flex {
    flex: 0 0 40px;
  }

  .app-body-flex {
    flex: 1 0 0;
    display: flex;
    flex-direction: row;

    .app-sidenav-flex {
      flex: 0 0 250px;
      overflow-y: auto;
      background-color: #400E40;
    }

    .app-content-flex {
      flex: 1 0 0;
      display: flex;
      flex-direction: column;
      border-top: 1px solid silver;
    }
  }
}

</style>