/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getOrganizations: ({ commit }, { refresh = false}) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getOrganizations()
    .then((response) => {
      if (response && response.data) {
        commit('setOrganizations', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setOrganizations', []);
      }
    });
  },
  putOrganizations: ({ commit }, organization) => {
    return api.putOrganizations(organization).then((response) => {
      commit('updateOrganizations', response.data);
      return response;
    });
  },
  deleteOrganizations: ({ commit }, organization) => {
    return api.deleteOrganizations(organization.uuid).then((response) => {
      commit('setOrganizationDeleted', organization.uuid);
      return response;
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
  setOrganizationDeleted: (state, organizationUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === organizationUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
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
