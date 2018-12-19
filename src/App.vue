<template>
  <router-view></router-view>
</template>

<script>
import axios from 'axios';

export default {
  created() {
    axios.interceptors.request.use((config) => {
      this.$store.commit('traffic/increaseRequests');
      return config;
    });
    axios.interceptors.response.use((response) => {
      this.$store.commit('traffic/increaseResponses');
      return response;
    });
  },
};
</script>