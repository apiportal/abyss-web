/* eslint-disable */
import api from '@/api';

const state = {
  uuid: null,
  hasValidToken: true,
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
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
