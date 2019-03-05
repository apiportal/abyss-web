<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand>{{ item.name }}</b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="list-ol" />
              <em>Logs</em>
            </template>
            <b-dropdown-item :to="`${routePath}/logs/${item.uuid}/contract/1`">All</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="cog" />
              <em>Operations</em>
            </template>
            <!-- <b-dropdown-item :to="`${routePath}/edit-license/${item.uuid}`"><Icon icon="edit" /> Edit License</b-dropdown-item> -->
            <!-- <b-dropdown-item :to="`/app/my-licenses/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete License</b-dropdown-item> -->
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;">

      <p>Description: {{ item.description }}</p>

      <label>API ACCESS TOKENS</label>
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Expire Date</th>
            <th>isActive</th>
            <th>Deleted</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(accessToken, index) in accessTokens" v-bind:key="index" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
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
              {{ accessToken.expiredate }}
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

      <label style="margin-top: 2rem;">APIs</label>
      <Apis
        :rows="computedContractApis"
        :routePath="`/app/my-apps/my-apps/${page}`"
      ></Apis>
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
      isContractsTableVisible: false,
      accessTokens: [],
      contractApis: [],
    };
  },
  methods: {
    handleToggleContractsTable() {
      this.isContractsTableVisible = !this.isContractsTableVisible;
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