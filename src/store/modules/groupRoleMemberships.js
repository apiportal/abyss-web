/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getGroupRoleMemberships: ({ commit }, { uuid, refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getGroupRoleMemberships(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setGroupRoleMemberships', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setGroupRoleMemberships', []);
      }
    });
  },
  getAllGroupRoleMemberships: ({ commit }, { refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getAllGroupRoleMemberships().then((response) => {
      if (response && response.data) {
        commit('setGroupRoleMemberships', response.data);
      }
    });
  },
};

const mutations = {
  setGroupRoleMemberships: (state, groupRoleMemberships) => {
    state.items = groupRoleMemberships;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  // setRoleMembershipDeleted: (state, membershipUuid) => {
  //   state.items = state.items.map((item) => {
  //     if (item.uuid === membershipUuid) {
  //       return {
  //         ...item,
  //         isdeleted: true,
  //       };
  //     }
  //     return item;
  //   });
  // },
  // addNewRoleMembership: (state, newRoleMembership) => {
  //   state.items = [
  //     ...state.items,
  //     newRoleMembership,
  //   ];
  // },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
