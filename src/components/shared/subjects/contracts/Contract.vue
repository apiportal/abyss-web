<template>
  <div>
    <div class="abyss-table-content">
      <div class="row">
        <dl class="col">
          <dt>Name:</dt>
          <dd>{{ item.name }}</dd>
          <dt>Description:</dt>
          <dd>{{ item.description }}</dd>
        </dl>
        <dl class="col">
          <dt>Environment:</dt>
          <dd>{{ item.environment }}</dd>
          <dt>Status:</dt>
          <dd>{{ item.status }}</dd>
          <dt>State:</dt>
          <dd>{{ state }}</dd>
        </dl>
        <dl class="col">
          <dt>Created:</dt>
          <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
          <dt>Updated:</dt>
          <dd>{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
          <dt v-if="item.deleted">Deleted:</dt>
          <dd v-if="item.deleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
          <dt>subjectpermissionid:</dt>
          <dd>{{ item.subjectpermissionid }}</dd>
        </dl>
      </div>

      <div class="row abyss-table-buttons">
        <b-button
          @click="handleToggleApisTable"
          size="md"
          variant="link"
          :class="{'active': isApisTableVisible}"
        >
          <span>Contracted API</span>
        </b-button>
        <b-button
          @click="handleToggleTokensTable"
          size="md"
          variant="link"
          :class="{'active': isTokensTableVisible}"
        >
          <span>Access Tokens</span>
          <b-badge
            :variant="`${computedExpiredTokens ? 'warning' : 'secondary'}`"
            pill>{{ accessTokens.length }}</b-badge>
        </b-button>
      </div>
      <div v-if="isTokensTableVisible">
        <AccessTokens
          :rows="accessTokens"
          :routePath="routePath"
          :onUpdate="getAccessTokens"
        ></AccessTokens>
      </div>
      <div v-if="isApisTableVisible">
        <Proxies
          :rows="computedContractApis"
          :routePath="routePath"
        ></Proxies>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import Icon from '@/components/shared/Icon';
import AccessTokens from '@/components/shared/subjects/subscriptions/AccessTokens';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
    state: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  components: {
    Icon,
    AccessTokens,
    Proxies: () => import('@/components/shared/subjects/proxies/Proxies'),
  },
  computed: {
    ...mapState({
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
    }),
    computedContractApis() {
      const { contractApis, apiStates, apiVisibilityTypes } = this;
      const getApiStateName = (apistateid) => {
        const apiState = apiStates.find(item => item.uuid === apistateid);
        return apiState ? apiState.name : apistateid;
      };
      const getApiVisibilityName = (apivisibilityid) => {
        const apiVisibility = apiVisibilityTypes.find(item => item.uuid === apivisibilityid);
        return apiVisibility ? apiVisibility.name : apivisibilityid;
      };

      return contractApis.map(contractApiItem => ({
        ...contractApiItem,
        apistatename: getApiStateName(contractApiItem.apistateid),
        apivisibilityname: getApiVisibilityName(contractApiItem.apivisibilityid),
      }));
    },
    computedExpiredTokens() {
      const hasNoActiveToken = this.accessTokens.find(item => !item.isexpired);
      return Boolean(!hasNoActiveToken);
    },
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      isApisTableVisible: false,
      isTokensTableVisible: false,
      accessTokens: [],
      contractApis: [],
    };
  },
  methods: {
    handleToggleTokensTable() {
      this.isTokensTableVisible = !this.isTokensTableVisible;
      if (this.isTokensTableVisible) {
        this.isApisTableVisible = false;
      }
    },
    handleToggleApisTable() {
      this.isApisTableVisible = !this.isApisTableVisible;
      if (this.isApisTableVisible) {
        this.isTokensTableVisible = false;
      }
    },
    getAccessTokens() {
      api.getAccessTokens(this.item.subjectpermissionid).then((response) => {
        this.accessTokens = response.data.map(item => ({
          ...item,
          isexpired: this.$moment(item.expiredate).isBefore(this.$moment.utc()),
        }));
      })
      .catch((error) => {
        if (error.status === 404) {
          this.accessTokens = [];
        }
      });
    },
  },
  watch: {
    computedContractApis(newVal, oldVal) {
      // console.log(newVal, oldVal);
      const contractApis = newVal;
      if (newVal.length !== oldVal.length) {
        for (let i = 0; i < contractApis.length; i += 1) {
          api.getApiContracts(contractApis[i].uuid).then((res) => {
            if (res && res.data) {
              contractApis[i].contracts = res.data;
            }
          })
          .catch((error) => {
            if (error.status === 404) {
              contractApis[i].contracts = [];
            }
          });
          // api.getAccessTokens(this.item.subjectpermissionid).then((res) => {
          //   if (res && res.data) {
          //     contractApis[i].accessTokens = res.data;
          //   }
          // })
          // .catch((error) => {
          //   if (error.status === 404) {
          //     contractApis[i].accessTokens = [];
          //   }
          // });
          // this.getAccessTokens(contractApis[i]);
        }
      }
    },
  },
  created() {
    // get tokens
    this.getAccessTokens();
    // get contract api
    api
    .getApi(this.item.apiid)
    .then((response) => {
      this.contractApis = response.data;
    })
    .catch((error) => {
      if (error.status === 404) {
        this.contractApis = [];
      }
    });
  },
};
</script>