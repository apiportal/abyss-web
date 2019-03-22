/* eslint-disable */
import api from '@/api';

const state = {
  uuid: null,
  hasValidToken: false,
  isUnauthorized: false,
  lastUpdatedAt: 0,
  props: {},
};

const getters = {};

const actions = {
  getUser: ({ commit }) => {
    api.getUser(state.uuid).then((response) => {
      if (response && response.data) {
        commit('setUserProps', response.data[0]);
      }
    });
  },
};

const mutations = {
  setTokenStatus: (state, tokenStatus) => {
    state.hasValidToken = tokenStatus;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setUuid: (state, uuid) => {
    state.uuid = uuid;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setUserProps: (state, userProps) => {
    state.props = userProps;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setUserUnauthorized: (state, val) => {
    state.isUnauthorized = val;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setSessionId: (state, sessionId) => {
    state.sessionid = sessionId;
    state.lastUpdatedAt = (new Date()).getTime();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
