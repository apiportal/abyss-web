<template>
  <div class="abyss-tool-container">
    <div class="abyss-tool-header-container">
      <b-nav tabs>
        <b-nav-item :active="true" style="margin-left: .5rem;">
          Paths
        </b-nav-item>
        <b-nav-item>
          Components &amp; Tags
        </b-nav-item>
        <b-nav-item>
          Information
        </b-nav-item>
      </b-nav>
    </div>
    <div class="abyss-tool-content-container">
      <Paths
        :paths="api.openapidocument.paths"
      />
    </div>
  </div>
</template>

<script>
import Paths from '@/components/shared/apiDesigner/abyssTool/Paths';

export default {
  props: {
    api: {
      type: Object,
      required: false,
      default() { return {}; },
    },
  },
  components: {
    Paths,
  },
};
</script>

<style lang="scss">
.abyss-tool-container {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;

  .abyss-tool-header-container {
    flex: 40px 0 0;
    background: #f8f8f8;

    .nav-tabs {
      margin-top: .5rem;
    }
  }

   .abyss-tool-content-container {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }
}
</style>
