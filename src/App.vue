<template>
  <router-view></router-view>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  created() {
    this.$store.commit('traffic/setGlobalConfig');
    axios.defaults.baseURL = this.baseUrl;
    axios.defaults.withCredentials = true;
    // axios.defaults.baseURL = 'https://dev2.apiportal.com';
    // axios.defaults.headers.common.Accept = 'application/json';
    // axios.defaults.headers.common['Content-Type'] = 'application/json';
    // axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8080';
    // axios.defaults.timeout = 10000;
    // axios.defaults.responseType = 'json';

    // axios global listeners
    axios.interceptors.request.use((config) => {
      this.$store.commit('traffic/increaseRequests');
      return config;
    }, () => {
      // error
      this.$store.commit('traffic/increaseRequests');
    });
    axios.interceptors.response.use((response) => {
      this.$store.commit('traffic/increaseResponses');
      return response;
    }, (error) => {
      // error
      this.$store.commit('traffic/increaseResponses');

      if (error.response.status === 401) {
        this.$router.push('/auth/login');
      }
      return Promise.reject(error.response);
    });

    // check user cookie
    let cookiesObj = {}; // eslint-disable-line
    const cookiesArr = document.cookie.split('; ');
    cookiesArr.map((cookie) => {
      const [key, value] = cookie.split('=');
      if (key === 'abyss.principal.uuid') {
        cookiesObj['principalid'] = value; // eslint-disable-line
      } else if (key === 'abyss.login.organization.uuid') {
        cookiesObj['organizationid'] = value; // eslint-disable-line
      } else if (key === 'abyss.login.organization.name') {
        cookiesObj['organizationname'] = value; // eslint-disable-line
      } else if (key === 'abyss.session') {
        cookiesObj['sessionid'] = value; // eslint-disable-line
      }
      return cookie;
    });
    const { principalid, organizationid, organizationname, sessionid } = cookiesObj;
    if (principalid && organizationid && organizationname && sessionid) {
      if (this.$route.path.indexOf('/auth') === -1) {
        this.$store.dispatch('user/getUser', { principalid, organizationid, organizationname, sessionid });
      }
    } else {
      this.$store.dispatch('user/resetUser');
      this.$router.push('/auth/login');
    }
  },
  computed: {
    ...mapState({
      baseUrl: state => state.traffic.baseUrl,
      user: state => state.user,
    }),
  },
};
</script>