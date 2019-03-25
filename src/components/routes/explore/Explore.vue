<template>
  <div
    style="margin: 1rem;"
  >
    <div class="row">
      <div
        class="col-md-3"
        v-for="(cardItem, index) in cardItems"
        v-bind:key="index"
      >
        <div>
          <b-card
            :img-src="cardItem.image"
            :img-alt="cardItem.openapidocument.info.title"
            img-top
            img-height="40%"
            class="mb-2"
            style="height: 20rem;"
            @click="handleModalOpen(cardItem.uuid)"
          >
            <div class="row">
              <h6 class="col-md">{{ cardItem.openapidocument.info.title }}</h6>
              <div class="col-">
                <small>{{ cardItem.apistatename }}</small>
                <Icon icon="circle" :class="`state${cardItem.apistatename}`"/>
              </div>
            </div>
            <div>
              <small>{{ cardItem.openapidocument.info.version }}</small>
            </div>
            <p>{{ cardItem.ownername }}</p>
            <b-card-text>
              {{ subStr(cardItem.openapidocument.info.description) }}
            </b-card-text>
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
      proxies: state => state.proxies.items,
      apiStates: state => state.apiStates.items,
      users: state => state.users.items,
    }),
    cardItems() {
      const { proxies, apiStates, users } = this;
      const getApiStateName = (apistateid) => {
        const apiState = apiStates.find(item => item.uuid === apistateid) || {};
        return apiState.name || apistateid;
      };
      const getOwnerName = (subjectId) => {
        const user = users.find(item => item.uuid === subjectId) || {};
        return user.displayname || subjectId;
      };
      return proxies
        .filter((item) => {
          if (item.apivisibilityid === 'e63c2874-aa12-433c-9dcf-65c1e8738a14') {
            return item;
          }
          return '';
        })
        .map(item => ({
          ...item,
          apistatename: getApiStateName(item.apistateid),
          ownername: getOwnerName(item.subjectid),
        }));
    },
  },
  // filters: {
  //   subStr(i) {
  //     return `${i.substring(0, 15)} ...`;
  //   },
  // },
  mounted() {
    this.$store.dispatch('proxies/getProxies', { uuid: this.currentUser.uuid });
    this.$store.dispatch('apiStates/getApiStates', {});
    this.$store.dispatch('users/getUsers', {});
  },
  methods: {
    subStr(i) {
      if (i && i.length > 70) {
        return `${i.substr(0, 70)} [...]`;
      } else if (i.length <= 70) {
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

<style lang="scss" scoped>
// .card-text {
  // width: 100%;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
// }
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
