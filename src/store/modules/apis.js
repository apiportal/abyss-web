/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApis: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getApis()
    .then((response) => {
      if (response && response.data) {
        commit('setApis', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setApis', []);
      }
    });
  },
  putApis: ({ commit }, apiToPut) => {
    return api.putApis(apiToPut).then((response) => {
      commit('updateApis', response.data);
      return response;
    });
  },
};

const mutations = {
  setApis: (state, apis) => {
    state.items = apis;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateApis: (state, apis) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = apis
        .find(api => api.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
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
