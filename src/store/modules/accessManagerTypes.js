/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getAccessManagerTypes: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getAccessManagerTypes().then((response) => {
      if (response && response.data) {
        commit('setAccessManagerTypes', response.data);
      }
    });
  },
  putAccessManagerTypes: ({ commit }, accessManagerType) => {
    return api.putAccessManagerTypes(accessManagerType).then((response) => {
      commit('updateAccessManagerTypes', response.data);
      return response;
    });
  },
  deleteAccessManagerTypes: ({ commit }, accessManagerType) => {
    return api.deleteAccessManagerTypes(accessManagerType.uuid).then((response) => {
      commit('setAccessManagerTypeDeleted', accessManagerType.uuid);
      return response;
    });
  },
  postAccessManagerTypes: ({ commit }, accessManagerType) => {
    return api.postAccessManagerTypes(accessManagerType).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addAccessManagerTypes', status.response);
        }
      });
      if (error) {
        return false;
      }
      return response;
    });
  },
};

const mutations = {
  setAccessManagerTypes: (state, accessManagerTypes) => {
    state.items = accessManagerTypes;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateAccessManagerTypes: (state, accessManagerTypes) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = accessManagerTypes
        .find(accessManagerType => accessManagerType.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setAccessManagerTypeDeleted: (state, accessManagerTypeUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === accessManagerTypeUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addAccessManagerTypes: (state, newAccessManagerType) => {
    state.items = [
      ...state.items,
      newAccessManagerType,
    ];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
