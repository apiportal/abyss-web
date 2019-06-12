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

const state = {
  requestsCount: 0,
  responsesCount: 0,
  isLoading: false,

  baseUrl: null,
  gatewayUrl: null,
  oapiUrl: null,
  pictureUrl: null,
  searchAllUrl: null,
  httpBinUrl: null,

  navigationFrom: null,
  navigationTo: null,
  menuGroup: null,
};

const getters = {};

const actions = {
  getNavigation: ({ commit }, navigation) => {
    commit('setNavigation', navigation);
  },
};

const mutations = {
  setNavigation: (state, navigation) => {
    console.log('from: ', navigation.from);
    console.log('to: ', navigation.to);
    window.localStorage.setItem('abyssNavigationTo', navigation.to.path);
    state.navigationTo = navigation.to.path;
    if (navigation.from.path === '/' && !window.localStorage.getItem('abyssNavigationFrom')) {
      state.navigationFrom = '/app/explore/';
      window.localStorage.setItem('abyssNavigationFrom', '/app/explore/');
    } else if (navigation.from.path === '/' && window.localStorage.getItem('abyssNavigationFrom')) {
      state.navigationFrom = window.localStorage.getItem('abyssNavigationFrom');
    } else {
      window.localStorage.setItem('abyssNavigationFrom', navigation.from.path);
      state.navigationFrom = navigation.from.path;
    }
    const nearestWithTitle = navigation.to.matched.slice().reverse().find(r => r.meta && r.meta.title);
    const nearestWithMenu = navigation.to.matched.slice().reverse().find(r => r.meta && r.meta.menu);
    if (nearestWithTitle) {
      document.title = `${nearestWithTitle.meta.title} | abyss`;
    }
    if (nearestWithMenu) {
      state.menuGroup = nearestWithMenu.meta.menu;
    }
  },
  setGlobalConfig: (state, globalUrls) => {
    if (hostProtocol === 'https') {
      state.baseUrl = `${hostProtocol}://${host}`;
    } else {
      state.baseUrl = `${hostProtocol}://${host}:${abyssPort}`;
    }
    state.gatewayUrl = `${state.baseUrl}/${gatewayContext}`;
    state.oapiUrl = `${state.baseUrl}/abyss/oapi`;
    state.pictureUrl = `${state.baseUrl}/abyss/oapi`;
    state.searchAllUrl = searchAllUrl;
    state.httpBinUrl = httpBinUrl;
  },
  increaseRequests: (state) => {
    state.requestsCount += 1;
    state.isLoading = (state.requestsCount !== state.responsesCount);
  },
  increaseResponses: (state) => {
    state.responsesCount += 1;
    state.isLoading = (state.requestsCount !== state.responsesCount);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
