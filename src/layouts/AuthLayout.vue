<template>
  <div class="auth-container">
    <AuthHeader />
    <main>
      <div class="d-flex align-items-center position-relative height-lg-100vh">
        <div class="col-lg-5 col-xl-4 d-none d-lg-flex align-items-center gradient-half-primary-v1 height-lg-100vh px-0">
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
#no-scroll::-webkit-scrollbar-thumb {
    display: none
}
.auth-container{
  .scrollbar {
    display: none
  }
  .d-flex {
    display: flex !important
  }
  .d-none {
    display: none !important
  }
  .align-items-center {
    align-items: center !important
  }
  .position-relative {
    position: relative !important
  }
  @media (min-width:992px) {
    .space-lg-0,
    .space-top-lg-0 {
      padding-top: 0 !important
    }

    .space-bottom-lg-0,
    .space-lg-0 {
      padding-bottom: 0 !important
    }

    .height-lg-100vh {
      height: 100vh
    }

    .min-height-lg-auto {
      min-height: auto
    }

    .min-height-lg-100vh {
      min-height: 100vh
    }
  }
  .col,
  .col-1,
  .col-2,
  .col-3,
  .col-4,
  .col-5,
  .col-6,
  .col-7,
  .col-8,
  .col-9,
  .col-10,
  .col-11,
  .col-12,
  .col-auto,
  .col-lg,
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12,
  .col-lg-auto,
  .col-md,
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12,
  .col-md-auto,
  .col-sm,
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12,
  .col-sm-auto,
  .col-xl,
  .col-xl-1,
  .col-xl-2,
  .col-xl-3,
  .col-xl-4,
  .col-xl-5,
  .col-xl-6,
  .col-xl-7,
  .col-xl-8,
  .col-xl-9,
  .col-xl-10,
  .col-xl-11,
  .col-xl-12,
  .col-xl-auto {
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
    .d-lg-none {
      display: none !important
    }

    .d-lg-inline {
      display: inline !important
    }

    .d-lg-inline-block {
      display: inline-block !important
    }

    .d-lg-block {
      display: block !important
    }

    .d-lg-table {
      display: table !important
    }

    .d-lg-table-row {
      display: table-row !important
    }

    .d-lg-table-cell {
      display: table-cell !important
    }

    .d-lg-flex {
      display: flex !important
    }

    .d-lg-inline-flex {
      display: inline-flex !important
    }
  }
  .gradient-half-primary-v1 {
    background-image: linear-gradient(150deg, #2d1582, #19a0ff);
    background-repeat: repeat-x
  }
  .pl-0,
  .px-0 {
    padding-left: 0 !important
  }
  .pr-0,
  .px-0 {
    padding-right: 0 !important
  }
  .pt-0,
  .px-0 {
    padding-top: 0 !important
  }
  .pb-0,
  .px-0 {
    padding-bottom: 0 !important
  }
  .w-100 {
    width: 100% !important
  }
  .p-5 {
    padding: 3rem !important
  }
  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px
  }
  .no-gutters {
    margin-right: 0;
    margin-left: 0
  }
  .space-3,
  .space-top-3 {
    padding-top: 8rem !important
  }

  .space-3,
  .space-bottom-3 {
    padding-bottom: 8rem !important
  }
}
</style>