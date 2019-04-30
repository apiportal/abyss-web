/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  userApp: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectMemberships: ({ commit }, { uuid, refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getSubjectMemberships(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectMemberships', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setSubjectMemberships', []);
      }
    });
  },
  getUserAppMemberships: ({ commit }, {refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getUserAppMembership()
      .then((res) => {
        if (res && res.data) {
          commit('setUserAppMemberships', res.data);
        }
      });
  },
  getAllSubjectMemberships: ({ commit }, { refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getAllSubjectMemberships().then((response) => {
      if (response && response.data) {
        commit('setSubjectMemberships', response.data);
      }
    });
  },
  deleteSubjectMemberships: ({ commit }, membership) => {
    return api.deleteSubjectMemberships(membership.uuid).then((response) => {
      commit('setSubjectMembershipDeleted', membership.uuid);
      return response;
    });
  },
  postSubjectMemberships: ({ commit }, membership) => {
    return api.postSubjectMemberships(membership).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
          alert(status.error.usermessage);
        } else {
          commit('addNewSubjectMembership', status.response);
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
  setSubjectMemberships: (state, subjectMemberships) => {
    state.items = subjectMemberships;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setUserAppMemberships: (state, userAppMembership) => {
    state.userApp = userAppMembership;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setSubjectMembershipDeleted: (state, membershipUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === membershipUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    }).filter(item => !item.isdeleted);
  },
  addNewSubjectMembership: (state, newSubjectMembership) => {
    state.items = [
      ...state.items,
      newSubjectMembership,
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
