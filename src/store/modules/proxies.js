/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getProxies: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getProxies(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setProxies', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setProxies', []);
      }
    });
  },
  getApiContracts: ({ commit }, { apiIdsArray }) => {
    for (let i = 0; i < apiIdsArray.length; i += 1) {
      api.getApiContracts(apiIdsArray[i]).then((response) => {
        if (response && response.data) {
          commit('setApiContracts', { apiId: apiIdsArray[i], contracts: response.data});
        } else {
          commit('setApiContracts', { apiId: apiIdsArray[i], contracts: []});
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          commit('setApiContracts', { appId: apiIdsArray[i], contracts: [] });
        }
      });
    }
  },
};

const mutations = {
  setProxies: (state, proxies) => {
    state.items = proxies;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setApiContracts: (state, { apiId, contracts }) => {
    state.items = state.items.map(item => {
      if (item.uuid === apiId) {
        return {
          ...item,
          contracts,
        };
      } else {
        return item;
      }
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
