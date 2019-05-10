/*
 * Copyright 2019 Verapi Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  userApp: [],
  userGroup: [],
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
  getUserGroupMemberships: ({ commit }, {refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getUserGroupMembership()
      .then((res) => {
        if (res && res.data) {
          commit('setUserGroupMemberships', res.data);
        }
      });
  },
  postUserGroupMembership: ({ commit }, membership) => {
    return api.postUserGroupMembership(membership)
      .then((response) => {
        let error = false;
        response.data.map((status) => {
          if (status.error.code !==0) {
            error = true;
            alert(status.error.usermessage);
          } else {
            commit('addNewUserGroupMembership', status.response);
          }
        });
        if (error) {
          return false;
        }
        return response;
      });
  },
  deleteUserGroupMembership: ({ commit }, membership) => {
    return api.deleteUserGroupMembership(membership.uuid).then((response) => {
      commit('setUserGroupMembershipDeleted', membership.uuid);
      return response;
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
  setUserGroupMemberships: (state, userGroupMembership) => {
    state.userGroup = userGroupMembership;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  addNewUserGroupMembership: (state, newUserGroupMembership) => {
    state.userGroup = [
      ...state.userGroup,
      newUserGroupMembership,
    ];
  },
  setUserGroupMembershipDeleted: (state, membershipUuid) => {
    state.userGroup = state.userGroup.map((item) => {
      if (item.uuid === membershipUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    }).filter(item => !item.isdeleted);
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
