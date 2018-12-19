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
};
</script>

<style lang="scss">
html {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 8px;
  height: 8px;
}

:hover::-webkit-scrollbar-thumb {
  background-color: #bdbdbd;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #ddd;
}

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