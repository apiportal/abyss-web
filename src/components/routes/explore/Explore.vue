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
              <div class="thumb-image cursor-pointer" v-if="cardItem.image" :style="{ 'background-image': 'url(' + cardItem.image + ')' }"></div>
              <div class="thumb-image cursor-pointer" v-if="!cardItem.image" :style="{ 'background-color': cardItem.color }">{{cardItem.openapidocument.info.title.substring(0, 1)}}</div>
            </div>
            <div class="clearfixx">
              <div class="float-right">
                <small>{{ cardItem.apistatename }}</small>
                <Icon icon="circle" :class="`state${cardItem.apistatename}`"/>
              </div>
              <h6 class="mb-0">{{ cardItem.openapidocument.info.title }}</h6>
              <b-card-text>
                <div>
                  <small>{{ cardItem.openapidocument.info.version }}</small>
                </div>
                <div class="mt-2">{{ cardItem.ownername }}</div>
                <div class="card-description">{{ subStr(cardItem.openapidocument.info.description) }}</div>
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

export default {
  components: {
    Icon,
  },
  created() {
    this.$store.commit('currentPage/setRootPath', 'explore');
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      apis: state => state.apis.items,
      apiStates: state => state.apiStates.items,
      users: state => state.users.items,
    }),
    cardItems() {
      const { apis, apiStates, users } = this;
      const getApiStateName = (apistateid) => {
        const apiState = apiStates.find(item => item.uuid === apistateid) || {};
        return apiState.name || apistateid;
      };
      const getOwnerName = (subjectId) => {
        const user = users.find(item => item.uuid === subjectId) || {};
        return user.displayname || subjectId;
      };
      return apis
        .filter(item => (
          item.isproxyapi &&
          item.apivisibilityid === 'e63c2874-aa12-433c-9dcf-65c1e8738a14' &&
          // item.apistateid === '1425993f-f6be-4ca0-84fe-8a83e983ffd9' && // for promoted state
          !item.isdeleted
        ))
        .map(item => ({
          ...item,
          apistatename: getApiStateName(item.apistateid),
          ownername: getOwnerName(item.subjectid),
        }));
    },
  },
  mounted() {
    this.$store.dispatch('apis/getApis', {});
    this.$store.dispatch('apiStates/getApiStates', {});
    this.$store.dispatch('apiVisibilityTypes/getApiVisibilityTypes', {});
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('licenses/getLicenses', {});
    this.$store.dispatch('apps/getApps', {});
    this.$store.dispatch('contractStates/getContractStates', {});
    this.$store.dispatch('resources/getResources', {});
    this.$store.dispatch('resourceTypes/getResourceTypes', {});
    this.$store.dispatch('resourceActions/getResourceActions', {});
    this.$store.dispatch('subjectApps/getSubjectApps', { uuid: this.currentUser.uuid });
    this.$store.dispatch('subjectMemberships/getUserAppMemberships', {});
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
  .thumb-image {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 4rem;
    background-color: #177ec1;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    position: relative;
    width: 100%;
    padding: 0;
    overflow: hidden;
    &::before {
      display: block;
      content: "";
      padding-top: 56.25%;
    }
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
