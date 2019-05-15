<template>
  <div class="page-container page-explore">
    <div class="page-content">
      <div class="row justify-content-center">
        <div
          class="card-container col py-3"
          v-for="(cardItem, index) in cardItems"
          v-bind:key="index"
        >
          <b-card
            @click="handleModalOpen(cardItem.uuid)"
          >
            <div slot="header" class="mb-0">
              <Images :uuid="cardItem.uuid" :itext="cardItem.apititle" :color="cardItem.color" type="apis" shape="rectangle"></Images>
            </div>
            <div class="clearfixx">
              <div class="float-right">
                <small>{{ cardItem.apistatename }}</small>
                <Icon icon="circle" :class="`state${cardItem.apistatename}`"/>
              </div>
              <h6 class="mb-0">{{ cardItem.apititle }}</h6>
              <b-card-text>
                <div>
                  <small>{{ cardItem.apiversion }}</small>
                </div>
                <div class="mt-2">{{ cardItem.apiowner }}</div>
                <div class="card-description">{{ subStr(cardItem.apidescription) }}</div>
              </b-card-text>
            </div>
          </b-card>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';
import Images from '@/components/shared/Images';

export default {
  components: {
    Icon,
    Images,
  },
  created() {
    this.$store.commit('currentPage/setRootPath', 'explore');
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      apis: state => state.exploreApis.items,
      apiStates: state => state.apiStates.items,
      // users: state => state.users.items,
    }),
    cardItems() {
      const { apis, apiStates } = this;
      const getApiStateName = (apistateid) => {
        const apiState = apiStates.find(item => item.uuid === apistateid) || {};
        return apiState.name || apistateid;
      };
      return apis.map(item => ({
        ...item,
        apistatename: getApiStateName(item.apistateid),
      }));
    },
  },
  mounted() {
    this.$store.dispatch('exploreApis/getExploreApis', {});
    this.$store.dispatch('apiStates/getApiStates', {});
    this.$store.dispatch('apiVisibilityTypes/getApiVisibilityTypes', {});
    this.$store.dispatch('userApps/getApps', { uuid: this.currentUser.uuid });
    this.$store.dispatch('contractStates/getContractStates', {});
    this.$store.dispatch('resourceTypes/getResourceTypes', {});
    this.$store.dispatch('resourceActions/getResourceActions', {});
    this.$store.dispatch('subjectMemberships/getUserAppMemberships', {});
    this.$store.dispatch('resources/getResources', {});
  },
  methods: {
    subStr(i) {
      if (i && i.length > 70) {
        return `${i.substr(0, 70)}...`;
      } else if (i && i.length <= 70) {
        return i;
      }
      return '';
    },
    handleModalOpen(apiId) {
      this.$router.push(`/app/explore/apis/${apiId}`);
    },
  },
};
</script>

<style lang="scss">
.app-header {
  .navbar-collapse {
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.075);
    height: 70px;
  }
}
.page-explore {
  .card-container  {
    width: 320px;
    flex: 0 0 320px;
  }
  .card {
    width: 100%;
    border-radius: 0;
    height: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    border-color: transparent;
    h6 {
      font-weight: 700;
    }
  }
  .card-header {
    padding: 0;
    cursor: pointer;
    border: 0 none;
  }
  .card-body {
    padding: 1rem;
  }
  .card-description {
    font-size: .90rem;
    line-height: 1.2;
    margin-top: .5rem;
  }
  // .card-text {
    // width: 100%;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  // }
}
.stateInitial{
  color:#8b8e91
}
.stateDraft{
  color:#212121
}
.stateStaged{
  color:#6f42c1
}
.statePublished{
  color:#4cac00
}
.statePromoted{
  color:#db408d
}
.stateDemoted{
  color:#ec7700
}
.stateDeprecated{
  color:#ecb100
}
.stateRetired{
  color:#00bbbb
}
.stateArchived{
  color:#177ec1
}
.stateRemoved{
  color:#161c9a
}
</style>
