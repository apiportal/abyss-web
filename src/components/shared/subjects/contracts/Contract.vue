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
          <dd>{{ item.contractstatename }}</dd>
        </dl>
        <dl class="col">
          <dt>Created:</dt>
          <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
          <dt>Updated:</dt>
          <dd>{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
          <dt v-if="item.deleted">Deleted:</dt>
          <dd v-if="item.deleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
        </dl>
      </div>

      <div class="row abyss-table-buttons">
        <b-button
          @click="handleToggleLicensesTable"
          size="md"
          variant="link"
          :class="{'active': isLicensesTableVisible}"
        >
          <span>Contract License</span>
        </b-button>
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
          :rows="contractApi"
          :routePath="routePath"
        ></Proxies>
      </div>
      <div v-if="isLicensesTableVisible">
        <Licenses
          :rows="contractLicense"
          :routePath="routePath"
        ></Licenses>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import Icon from '@/components/shared/Icon';
import AccessTokens from '@/components/shared/subjects/subscriptions/AccessTokens';
import Licenses from '@/components/shared/subjects/licenses/Licenses';

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
    Licenses,
    Proxies: () => import('@/components/shared/subjects/proxies/Proxies'),
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      currentPage: state => state.currentPage,
    }),
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
      isLicensesTableVisible: false,
      accessTokens: [],
      contractApi: [],
      contractLicense: [],
    };
  },
  methods: {
    handleToggleTokensTable() {
      this.isTokensTableVisible = !this.isTokensTableVisible;
      if (this.isTokensTableVisible) {
        this.isApisTableVisible = false;
        this.isLicensesTableVisible = false;
      }
    },
    handleToggleApisTable() {
      this.isApisTableVisible = !this.isApisTableVisible;
      if (this.isApisTableVisible) {
        this.isTokensTableVisible = false;
        this.isLicensesTableVisible = false;
      }
    },
    handleToggleLicensesTable() {
      this.isLicensesTableVisible = !this.isLicensesTableVisible;
      if (this.isLicensesTableVisible) {
        this.isApisTableVisible = false;
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
    getContractApi() {
      api.getApi(this.item.apiid).then((response) => {
        this.contractApi = response.data;
      })
      .catch((error) => {
        if (error.status === 404) {
          this.contractApi = [];
        }
      });
    },
    getContractLicense() {
      api.getLicense(this.item.licenseid).then((response) => {
        this.contractLicense = response.data;
      })
      .catch((error) => {
        if (error.status === 404) {
          this.contractLicense = [];
        }
      });
    },
  },
  created() {
    if (this.currentPage.rootPath === 'my-apps') {
      this.contractLicense = this.item.licenses;
      this.contractApi = this.item.apis;
      this.accessTokens = this.item.tokens.map(token => ({
        ...token,
        isexpired: this.$moment(token.expiredate).isBefore(this.$moment.utc()),
      }));
    } else {
      this.getContractLicense();
      this.getAccessTokens();
      this.getContractApi();
    }
  },
};
</script>