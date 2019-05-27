<template>
  <div class="auth-container">
    <AuthHeader />
    <main>
      <div class="d-flex align-items-center position-relative height-lg-100vh">
        <div
          class="col-lg-5 col-xl-4 d-none d-lg-flex align-items-center gradient-half-primary-v1 height-lg-100vh px-0"
          style="background-image: url('/static/abyss1.jpg'); background-position: bottom center; background-size: cover">
            <div class="w-100 p-5">
              <AuthSide />
            </div>
        </div>
        <div class="container height-lg-100vh" style="overflow-y: auto;" id="no-scroll">
          <div class="row no-gutters">
            <div class="col-lg-7 col-xl-6 offset-lg-2 offset-xl-3 space-3 space-lg-0">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </main>
    <LoadingModal v-if="isLoading" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AuthSide from '@/components/shared/AuthSide';
import AuthHeader from '@/components/shared/AuthHeader';
import LoadingModal from '@/components/shared/modals/LoadingModal';

export default {
  name: 'auth-layout',
  components: {
    AuthSide,
    AuthHeader,
    LoadingModal,
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
    }),
  },
};
</script>

<style lang="scss">
.auth-container{
  #no-scroll::-webkit-scrollbar-thumb {
      display: none
  }
  @media (min-width:992px) {
    .space-lg-0 {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }

    .height-lg-100vh {
      height: 100vh
    }
  }
  .col-lg-5,
  .col-lg-7,
  .col-xl-4,
  .col-xl-6 {
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px
  }
  @media (min-width:992px) {
    .col-lg-5 {
      flex: 0 0 41.666667%;
      max-width: 41.666667%
    }

    .col-lg-7 {
      flex: 0 0 58.333333%;
      max-width: 58.333333%
    }

    .offset-lg-2 {
      margin-left: 16.666667%
    }
  }
  @media (min-width:1200px) {
    .col-xl-4 {
      flex: 0 0 33.333333%;
      max-width: 33.333333%
    }
    .col-xl-6 {
      flex: 0 0 50%;
      max-width: 50%
    }
    .offset-xl-3 {
      margin-left: 25%
    }
  }
  @media (min-width:992px) {
    .d-lg-flex {
      display: flex !important
    }
  }
  .gradient-half-primary-v1 {
    background-image: linear-gradient(150deg, #2d1582, #19a0ff);
    background-repeat: repeat-x
  }
  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto
  }
  .no-gutters {
    margin-right: 0;
    margin-left: 0
  }
  .space-3 {
    padding-top: 8rem !important;
    padding-bottom: 8rem !important;
  }
}
</style>