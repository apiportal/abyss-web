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
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getRoles: ( { commit }, { refresh = false })  => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getRoles()
    .then((response) => {
      if (response && response.data) {
        commit('setRoles', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setRoles', []);
      }
    });
  },
  putRoles: ({ commit }, role) => {
    return api.putRoles(role).then((response) => {
      commit('updateRoles', response.data);
      return response;
    });
  },
  deleteRoles: ({ commit }, role) => {
    return api.deleteRoles(role.uuid).then((response) => {
      commit('setRoleDeleted', role.uuid);
      return response;
    });
  },
  postRoles: ({ commit }, role) => {
    return api.postRoles(role).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
          // alert(status.error.rolemessage);
        } else {
          commit('addNewRole', status.response);
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
  setRoles: (state, roles) => {
    state.items = roles;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateRoles: (state, roles) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = roles
        .find(role => role.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setRoleDeleted: (state, roleUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === roleUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewRole: (state, newRole) => {
    state.items = [
      ...state.items,
      newRole,
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
