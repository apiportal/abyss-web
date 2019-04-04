/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getPermissions: ({ commit }, { refresh = false}) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getPermissions()
    .then((response) => {
      if (response && response.data) {
        commit('setPermissions', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setPermissions', []);
      }
    });
  },
  putPermissions: ({ commit }, permission) => {
    return api.putPermissions(permission).then((response) => {
      commit('updatePermissions', response.data);
      return response;
    });
  },
  deletePermissions: ({ commit }, permission) => {
    return api.deletePermissions(permission.uuid).then((response) => {
      commit('setPermissionDeleted', permission.uuid);
      return response;
    });
  },
  postPermissions: ({ commit }, permission) => {
    return api.postPermissions(permission).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
          alert(status.error.usermessage);
        } else {
          commit('addNewPermission', status.response);
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
  setPermissions: (state, permissions) => {
    state.items = permissions;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updatePermissions: (state, permissions) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = permissions
        .find(permission => permission.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setPermissionDeleted: (state, permissionUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === permissionUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewPermission: (state, newPermission) => {
    state.items = [
      ...state.items,
      newPermission,
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
