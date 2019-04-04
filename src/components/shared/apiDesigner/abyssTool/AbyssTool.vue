<template>
  <div class="abyss-tool-container">
    <div class="abyss-tool-header-container">
      <b-nav class="page-tabs" tabs>
        <b-nav-item
          style="margin-left: .5rem;"
          :active="activeTab === 'paths'"
          @click="() => setActiveTab('paths')"
        >
          Paths
        </b-nav-item>
        <b-nav-item
          :active="activeTab === 'componentsTags'"
          @click="() => setActiveTab('componentsTags')"
        >
          Components &amp; Tags
        </b-nav-item>
        <b-nav-item
          :active="activeTab === 'information'"
          @click="() => setActiveTab('information')"
        >
          Information
        </b-nav-item>
        <b-nav-item
          :active="activeTab === 'servers'"
          @click="() => setActiveTab('servers')"
        >
          Servers
        </b-nav-item>
      </b-nav>
    </div>
    <div class="abyss-tool-content-container">
      <Paths
        v-if="activeTab === 'paths'"
        :paths="api.openapidocument.paths"
        :onChange="onChange"
      />
      <ComponentsTags
        v-if="activeTab === 'componentsTags'"
        :openapidocument="api.openapidocument"
        :onChange="onChange"
      />
      <Information
        v-if="activeTab === 'information'"
        :openapidocument="api.openapidocument"
        :onChange="onChange"
      />
      <Servers
        v-if="activeTab === 'servers'"
        :openapidocument="api.openapidocument"
        :onChange="onChange"
      />
    </div>
  </div>
</template>

<script>
import Paths from '@/components/shared/apiDesigner/abyssTool/paths/Paths';
import ComponentsTags from '@/components/shared/apiDesigner/abyssTool/ComponentsTags';
import Information from '@/components/shared/apiDesigner/abyssTool/Information';
import Servers from '@/components/shared/apiDesigner/abyssTool/Servers';

export default {
  props: {
    api: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    onChange: {
      type: Function,
      required: true,
    },
  },
  components: {
    Paths,
    ComponentsTags,
    Information,
    Servers,
  },
  data() {
    return {
      activeTab: 'paths',
    };
  },
  methods: {
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
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
