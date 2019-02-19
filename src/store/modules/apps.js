/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApps: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getApps().then((response) => {
      if (response && response.data) {
        commit('setApps', response.data);
      }
    });
  },
  getAppContracts: ({ commit }, appIdsArray) => {
    for (let i = 0; i < appIdsArray.length; i += 1) {
      api.getAppContracts(appIdsArray[i]).then((response) => {
        commit('setAppContracts', { appId: appIdsArray[i], contracts: response.data});
      });
    }
  },
};

const mutations = {
  setApps: (state, apps) => {
    state.items = apps;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setAppContracts: (state, { appId, contracts }) => {
    state.items = state.items.map(item => {
      if (item.uuid === appId) {
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
