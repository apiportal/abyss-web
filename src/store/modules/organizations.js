/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getOrganizations: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getOrganizations().then((response) => {
      if (response && response.data) {
        commit('setOrganizations', response.data);
      }
    });
  },
  putOrganizations: ({ commit }, organization) => {
    api.putOrganizations(organization).then((response) => {
      commit('updateOrganizations', response.data);
    });
  },
  postOrganizations: ({ commit }, organization) => {
    return api.postOrganizations(organization).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addOrganizations', status.response);
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
  setOrganizations: (state, organizations) => {
    state.items = organizations;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateOrganizations: (state, organizations) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = organizations
        .find(organization => organization.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  addOrganizations: (state, newOrganization) => {
    state.items = [
      ...state.items,
      newOrganization,
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
