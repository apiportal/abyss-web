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
        </dl>
      </div>

      <div class="row abyss-table-buttons">
        <b-button
          @click="handleToggleTokensTable"
          size="md"
          variant="link"
          :class="{'active': isTokensTableVisible}"
        >
          <span>API Access Tokens</span>
          <b-badge pill>{{ accessTokens.length }}</b-badge>
        </b-button>
        <b-button
          @click="handleToggleApisTable"
          size="md"
          variant="link"
          :class="{'active': isApisTableVisible}"
        >
          <span>APIs</span>
          <b-badge pill>{{ computedContractApis.length }}</b-badge>
        </b-button>
      </div>
      <div class="abyss-table-content" v-if="isTokensTableVisible">
        <table class="table abyss-table abyss-table-cards">
          <thead>
            <tr>
              <th>Token</th>
              <th>Expire Date</th>
              <th>isActive</th>
              <th>Deleted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(accessToken, index) in accessTokens" v-bind:key="index" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${accessToken.isdeleted ? 'is-deleted' : ''}`">
              <td>
                <b-form-textarea
                  id="textarea1"
                  v-model="accessToken.token"
                  placeholder="Enter something"
                  rows="4"
                  max-rows="6"
                  :disabled="true"
                />
              </td>
              <td>
                {{ accessToken.expiredate | moment("DD.MM.YYYY HH:mm") }}
              </td>
              <td>
                {{ accessToken.isactive }}
              </td>
              <td>
                {{ accessToken.isdeleted }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="isApisTableVisible">
        <Apis
          :rows="computedContractApis"
          :routePath="`/app/my-apps/my-apps/${page}`"
        ></Apis>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import Icon from '@/components/shared/Icon';

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
    Apis: () => import('@/components/shared/subjects/apis/Apis'),
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
  },
  mounted() {
    // get tokens
    api
    .getResourceAccessTokens(this.item.subjectpermissionid)
    .then((response) => {
      this.accessTokens = response.data;
    });
    // get contract api
    api
    .getApi(this.item.apiid)
    .then((response) => {
      this.contractApis = response.data;
    });
  },
};
</script>