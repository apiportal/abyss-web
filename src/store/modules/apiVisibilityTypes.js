/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApiVisibilityTypes: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getApiVisibilityTypes()
    .then((response) => {
      if (response && response.data) {
        commit('setApiVisibilityTypes', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setApiVisibilityTypes', []);
      }
    });
  },
};

const mutations = {
  setApiVisibilityTypes: (state, apiVisibilityTypes) => {
    state.items = apiVisibilityTypes;
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
