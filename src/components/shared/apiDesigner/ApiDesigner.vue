<template>
  <div class="api-designer-container">

    <div class="api-designer-actions-bar">
      <b-button-toolbar>
        <span v-if="title" class="toolbar-title">{{ title }}</span>
        <b-button-group size="sm" class="mr-1">
          <b-button
            @click="setView('abyss')" 
            :class="`${ view === 'abyss' ? 'btn-selected' : '' }`"
            v-b-tooltip.hover
            title="Abyss View"
          ><Icon icon="magic" /></b-button>
          <b-button
            @click="setView('hybrid')"
            :class="`${ view === 'hybrid' ? 'btn-selected' : '' }`"
            v-b-tooltip.hover
            title="Hybrid View"
          ><Icon icon="columns" /></b-button>
          <b-button
            @click="setView('editor')"
            :class="`${ view === 'editor' ? 'btn-selected' : '' }`"
            v-b-tooltip.hover
            title="Editor View"
          ><Icon icon="code" /></b-button>
        </b-button-group>

        <b-button-group size="sm" class="mr-1">
          <b-button v-b-tooltip.hover title="Undo"><Icon icon="undo" /></b-button>
          <b-button v-b-tooltip.hover title="Redo"><Icon icon="redo" /></b-button>
        </b-button-group>
      </b-button-toolbar>
    </div>

    <div class="api-designer-columns-container" :style="`height: ${height}px`">
      <div 
        :class="`api-designer-abyss-container ${ (view === 'abyss' || view === 'hybrid') ? '' : 'd-none'}`"
      >
        <AbyssTool
          :api="apiEditable"
          :onChange="handleChange"
        />
      </div>
      <div
        :class="`api-designer-editor-container ${ (view === 'editor' || view === 'hybrid') ? '' : 'd-none'}`"
      >
        <Editor
          :value="apiEditable.openapidocument"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Helpers from '@/helpers';
import AbyssTool from '@/components/shared/apiDesigner/abyssTool/AbyssTool';
import Editor from '@/components/shared/Editor';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    AbyssTool,
    Editor,
    Icon,
  },
  props: {
    api: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    height: {
      type: Number,
      required: false,
      default() { return 500; },
    },
    title: {
      type: String,
      required: false,
    },
    initialView: {
      type: String,
      required: false,
      default() { return 'hybrid'; },
    },
  },
  data() {
    return {
      view: this.initialView,
      apiEditable: JSON.parse(JSON.stringify(this.api)),
    };
  },
  methods: {
    setView(view) {
      this.view = view;
    },
    handleChange(propAddress, newPropValue) {
      const { apiEditable } = this;
      const { objectDeepUpdate } = Helpers;
      let apiClone = JSON.parse(JSON.stringify(apiEditable)); // eslint-disable-line
      objectDeepUpdate(propAddress, newPropValue, apiClone);
      this.apiEditable = { ...apiClone };
    },
  },
};
</script>

<style lang="scss">
.api-designer-container {
  .api-designer-actions-bar {
    border-bottom: 1px solid #e9ecef; 
    padding: 1rem;

    .toolbar-title {
      display: inline-flex;
      vertical-align: middle;
      font-size: 1.25rem;
      font-weight: 500;
      margin-right: 1rem;
    }

    .btn.btn-secondary.btn-selected {
      background-color: #5a6268;
      border-color: #545b62;
    }
  }

  .api-designer-columns-container {
    display: flex;
    flex-direction: row;
    flex: 1 0 0;

    .api-designer-abyss-container {
      display: flex;
      flex: 1 0 0;
    }

    .api-designer-editor-container {
      display: flex;
      flex: 1 0 0;
    }
  }
}
</style>
