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
    api.getApps()
    .then((response) => {
      if (response && response.data) {
        commit('setApps', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setApps', []);
      }
    });
  },
  putApps: ({ commit }, app) => {
    return api.putApps(app).then((response) => {
      commit('updateApps', response.data);
    });
  },
  postApps: ({ commit }, app) => {
    return api.postApps(app).then((response) => {
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
  getAppContracts: ({ commit }, { appIdsArray }) => {
    for (let i = 0; i < appIdsArray.length; i += 1) {
      api.getAppContracts(appIdsArray[i]).then((response) => {
        commit('setAppContracts', { appId: appIdsArray[i], contracts: ((response && response.data) ? response.data : []) });
      })
      .catch((error) => {
        if (error.status === 404) {
          commit('setAppContracts', { appId: appIdsArray[i], contracts: [] });
        }
      });
    }
  },
  // getAppResources: ({ commit }, { appIdsArray }) => {
  //   for (let i = 0; i < appIdsArray.length; i += 1) {
  //     api.getResource(appIdsArray[i]).then((response) => {
  //       commit('setAppResources', { appId: appIdsArray[i], resource: response.data});
  //     });
  //   }
  // },
};

const mutations = {
  setApps: (state, apps) => {
    state.items = apps;
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
  // setAppResources: (state, { appId, resources }) => {
  //   state.items = state.items.map(item => {
  //     if (item.uuid === appId) {
  //       return {
  //         ...item,
  //         resources,
  //       };
  //     } else {
  //       return item;
  //     }
  //   });
  //   state.lastUpdatedAt = (new Date()).getTime();
  // },
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
