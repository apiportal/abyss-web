<template>
  <div>
    <ul class="sidenav-links">
      <li v-for="(route, index) in routes" v-bind:key="index">
        <b-link :to="route.to">
          <span class="route-icon"><font-awesome-icon :icon="route.icon" /></span>
          {{ route.name }}
        </b-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        {
          icon: 'tachometer-alt',
          name: 'Dashboard',
          to: '/app/dashboard',
        },
        {
          icon: 'sitemap',
          name: 'My APIs',
          to: '/app/my-apis',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
ul.sidenav-links {
  list-style-type: none;
  padding: 0;
  margin: 1em;

  li {
    a {
      display: block;
      position: relative;
      padding-left: 30px;

      .route-icon {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
}
</style>