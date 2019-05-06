/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApps: ({ commit }, { uuid, refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getUserAppsCascaded(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setUserApps', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setUserApps', []);
      }
    });
  },
  putApps: ({ commit }, app) => {
    // return api.putApps(app).then((response) => {
    return api.putAppsCascaded(app).then((response) => {
      commit('updateApps', response.data);
      return response;
    });
  },
  postApps: ({ commit }, app) => {
    // return api.postApps(app).then((response) => {
    return api.postAppsCascaded(app).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
          console.log(status.error.usermessage);
        } else {
          commit('addNewApp', status.response);
        }
      });
      if (error) {
        return false;
      }
      return response;
    });
  },
  deleteApps: ({ commit }, app) => {
    return api.deleteApps(app.uuid).then((response) => {
      commit('setAppDeleted', app.uuid);
      return response;
    });
  },
};

const mutations = {
  setUserApps: (state, userApps) => {
    state.items = userApps;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateApps: (state, apps) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = apps
        .find(app => app.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  addNewApp: (state, newApp) => {
    state.items = [
      ...state.items,
      newApp,
    ];
  },
  setAppDeleted: (state, appUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === appUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
