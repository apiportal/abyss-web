/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getGroups: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getGroups().then((response) => {
      if (response && response.data) {
        commit('setGroups', response.data);
      }
    });
  },
  putGroups: ({ commit }, group) => {
    return api.putGroups(group).then((response) => {
      commit('updateGroups', response.data);
      return response;
    });
  },
  deleteGroups: ({ commit }, group) => {
    return api.deleteGroups(group.uuid).then((response) => {
      commit('setGroupDeleted', group.uuid);
      return response;
    });
  },
  postGroups: ({ commit }, group) => {
    return api.postGroups(group).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
          alert(status.error.usermessage);
        } else {
          commit('addNewGroup', status.response);
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
  setGroups: (state, groups) => {
    state.items = groups;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateGroups: (state, groups) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = groups
        .find(group => group.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setGroupDeleted: (state, groupUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === groupUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewGroup: (state, newGroup) => {
    state.items = [
      ...state.items,
      newGroup,
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
