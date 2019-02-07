/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getBusinessApis: ({ commit }, userUuid) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getBusinessApis(userUuid).then((response) => {
      if (response && response.data) {
        commit('setBusinessApis', response.data);
      }
    });
  },
};

const mutations = {
  setBusinessApis: (state, businessApis) => {
    state.items = businessApis;
    state.lastUpdatedAt = (new Date()).getTime();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
