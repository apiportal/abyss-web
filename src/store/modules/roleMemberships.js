/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getRoleMemberships: ({ commit }, { uuid, refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getRoleMemberships(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setRoleMemberships', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setRoleMemberships', []);
      }
    });
  },
  getAllRoleMemberships: ({ commit }, { refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getAllRoleMemberships().then((response) => {
      if (response && response.data) {
        commit('setRoleMemberships', response.data);
      }
    });
  },
  deleteRoleMemberships: ({ commit }, membership) => {
    return api.deleteRoleMemberships(membership.uuid).then((response) => {
      commit('setRoleMembershipDeleted', membership.uuid);
      return response;
    });
  },
  postRoleMemberships: ({ commit }, membership) => {
    return api.postRoleMemberships(membership).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
          alert(status.error.usermessage);
        } else {
          commit('addNewRoleMembership', status.response);
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
  setRoleMemberships: (state, roleMemberships) => {
    state.items = roleMemberships;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setRoleMembershipDeleted: (state, membershipUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === membershipUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewRoleMembership: (state, newRoleMembership) => {
    state.items = [
      ...state.items,
      newRoleMembership,
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
