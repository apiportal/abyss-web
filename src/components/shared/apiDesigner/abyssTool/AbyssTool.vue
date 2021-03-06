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
          Servers &amp; Security
        </b-nav-item>
        <b-nav-item
          :active="activeTab === 'status'"
          @click="() => setActiveTab('status')"
        >
          Portal Specific
        </b-nav-item>
      </b-nav>
    </div>
    <div class="abyss-tool-content-container">
      <Paths
        v-if="activeTab === 'paths'"
        :paths="api.openapidocument.paths"
        :pathArray="['openapidocument', 'paths']"
        :onChange="onChange"
        :refs="refs"
        :securitySchemes="securitySchemes"
        :tags="api.openapidocument.tags"
        :showGroupButtons="true"
      />
      <ComponentsTags
        v-if="activeTab === 'componentsTags'"
        :openapidocument="api.openapidocument"
        :onChange="onChange"
        :refs="refs"
        :securitySchemes="securitySchemes"
        :tags="api.openapidocument.tags"
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
      <Status
        v-if="activeTab === 'status'"
        :api="api"
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
import Status from '@/components/shared/apiDesigner/abyssTool/Status';

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
    Status,
  },
  computed: {
    refs() {
      const { components } = this.api.openapidocument;
      if (components) {
        const optionGroups = Object.keys(components);
        return optionGroups.map((optionGroup) => {
          const optionGroupProps = Object.keys(components[optionGroup]);
          const optionGroupOptions = optionGroupProps
          .map(optionGroupProp => `#/components/${optionGroup}/${optionGroupProp}`);
          return {
            name: optionGroup,
            options: optionGroupOptions,
          };
        });
      }
      return [];
    },
    securitySchemes() {
      if (this.api.openapidocument.components) {
        return this.api.openapidocument.components.securitySchemes;
      }
      return {};
    },
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
  overflow: hidden;

  .abyss-tool-header-container {
    flex: 40px 0 0;

    .nav-tabs {
      margin-top: .5rem;
    }

    .page-tabs {
      margin-top: -1px;
      margin-bottom: 0;
    }
  }

   .abyss-tool-content-container {
    background: #f8f8f8;
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1rem;
  }
}
</style>
