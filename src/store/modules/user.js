/* eslint-disable */
const state = {
  hasValidToken: true,
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {};

const mutations = {
  setTokenStatus: (state, tokenStatus) => {
    state.hasValidToken = tokenStatus;
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
