<template>
  <header id="header" class="u-header u-header--bg-transparent u-header--abs-top">
    <div class="u-header__section">
      <div id="logoAndNav" class="container-fluid">
        <!-- Nav -->
        <nav class="navbar navbar-expand u-header__navbar">
          <!-- White Logo -->
          <a class="d-none d-lg-flex navbar-brand u-header__navbar-brand u-header__navbar-brand-center u-header__navbar-brand-text-white" to="/auth/" aria-label="Front">
            <!-- <img src="/static/abyss_dark.png" style="max-height: 40px; " /> -->
          </a>
          <!-- End White Logo -->
        </nav>
        <!-- End Nav -->
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isMounted: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="scss" scoped>
  .u-header {
    position: relative;
    right: 0;
    left: 0;
    width: 100%;
    z-index: 101;
  }

  .u-header--abs-top, .u-header--abs-bottom, .u-header--abs-top-2nd-screen {
    position: absolute;
  }

  .u-header--abs-top {
    top: 0;
    bottom: auto;
  }

  .container-fluid {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto
  }
  .navbar {
    position: relative;
    padding: .5rem 1rem
  }

  .navbar,
  .navbar>.container,
  .navbar>.container-fluid {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between
  }
  .navbar-expand {
    flex-flow: row nowrap;
    justify-content: flex-start
  }

  .navbar-expand>.container,
  .navbar-expand>.container-fluid {
    padding-right: 0;
    padding-left: 0
  }

  .navbar-expand .navbar-nav {
    flex-direction: row
  }

  .navbar-expand .navbar-nav .dropdown-menu {
    position: absolute
  }

  .navbar-expand .navbar-nav .nav-link {
    padding-right: .5rem;
    padding-left: .5rem
  }

  .navbar-expand>.container,
  .navbar-expand>.container-fluid {
    flex-wrap: nowrap
  }

  .navbar-expand .navbar-collapse {
    display: flex !important;
    flex-basis: auto
  }

  .navbar-expand .navbar-toggler {
    display: none
  }
  .navbar-brand {
    display: inline-block;
    padding-top: .3125rem;
    padding-bottom: .3125rem;
    margin-right: 1rem;
    font-size: 1.25rem;
    line-height: inherit;
    white-space: nowrap
  }

  .navbar-brand:focus,
  .navbar-brand:hover {
    text-decoration: none
  }
  .d-none {
    display: none !important
  }
  @media (min-width:992px) {
    .d-lg-flex {
      display: flex !important
    }
  }
</style>