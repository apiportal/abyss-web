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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppHeader from '@/components/shared/AppHeader';
import AppSidenav from '@/components/shared/AppSidenav';
import LoadingModal from '@/components/shared/modals/LoadingModal';

export default {
  name: 'default-layout',
  components: {
    AppHeader,
    AppSidenav,
    LoadingModal,
  },
  computed: {
    ...mapState({
      requestsCount: state => state.traffic.requestsCount,
      responsesCount: state => state.traffic.responsesCount,
    }),
    isLoadingModalVisible() {
      const { requestsCount, responsesCount } = this;
      return requestsCount !== responsesCount;
    },
  },
  mounted() {
    document.cookie = 'abyss.principal.uuid=32c9c734-11cb-44c9-b06f-0b52e076672d; abyss.login.organization.uuid=9287b7dc-058d-4399-aad0-6fa704decb6b; abyss.login.organization.name=FAIKsOrganization; abyss.session=f6b7fee54b11117e49319645827327d3';
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
    flex: 0 0 60px;
    border-bottom: 1px solid silver;
  }

  .app-body-flex {
    flex: 1 0 0;
    display: flex;
    flex-direction: row;

    .app-sidenav-flex {
      flex: 0 0 200px;
      border-right: 1px solid silver;
    }

    .app-content-flex {
      flex: 1 0 0;
      display: flex;
      flex-direction: column;
    }
  }
}

</style>