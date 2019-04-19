/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getBusinessApis: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getBusinessApis(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setBusinessApis', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setBusinessApis', []);
      }
    });
  },
  putBusinessApis: ({ commit }, businessApi) => {
    return api.putBusinessApi(businessApi).then((response) => {
      commit('updateBusinessApis', response.data);
      return response;
    });
  },
  postBusinessApis: ({ commit }, businessApi) => {
    return api.postBusinessApi(businessApi).then((response) => {
      // commit('addNewBusinessApis', response.data);
      return response;
    });
  },
};

const mutations = {
  setBusinessApis: (state, businessApis) => {
    state.items = businessApis;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateBusinessApis: (state, businessApis) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = businessApis
        .find(businessApi => businessApi.uuid === item.uuid);
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
