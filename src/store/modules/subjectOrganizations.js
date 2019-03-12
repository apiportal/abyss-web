/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectOrganizations: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getSubjectOrganizations().then((response) => {
      if (response && response.data) {
        commit('setSubjectOrganizations', response.data);
      }
    });
  },
  putSubjectOrganizations: ({ commit }, subjectorganization) => {
    return api.putSubjectOrganizations(subjectorganization).then((response) => {
      commit('updateSubjectOrganizations', response.data);
      return response;
    });
  },
  deleteSubjectOrganizations: ({ commit }, subjectorganization) => {
    return api.deleteSubjectOrganizations(subjectorganization.uuid).then((response) => {
      commit('setOrganizationDeleted', subjectorganization.uuid);
      return response;
    });
  },
  postSubjectOrganizations: ({ commit }, subjectorganization) => {
    return api.postSubjectOrganizations(subjectorganization).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addSubjectOrganizations', status.response);
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
  setSubjectOrganizations: (state, subjectorganizations) => {
    state.items = subjectorganizations;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateSubjectOrganizations: (state, subjectorganizations) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = subjectorganizations
        .find(subjectorganization => subjectorganization.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setOrganizationDeleted: (state, subjectorganizationUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === subjectorganizationUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addSubjectOrganizations: (state, newSubjectOrganization) => {
    state.items = [
      ...state.items,
      newSubjectOrganization,
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
