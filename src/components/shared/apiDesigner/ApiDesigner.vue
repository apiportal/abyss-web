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
          <b-button
            @click="setMode('json')" 
            :class="`${ mode === 'json' ? 'btn-selected' : '' }`"
          >JSON</b-button>
          <b-button
            @click="setMode('yaml')" 
            :class="`${ mode === 'yaml' ? 'btn-selected' : '' }`"
          >YAML</b-button>
        </b-button-group>

        <b-button-group size="sm" class="mr-1">
          <b-button
            @click="handleUndo"
            :disabled="apiStateIndex === 0"
          >
            <Icon icon="undo" />
          </b-button>
          <b-button
            @click="handleRedo"
            :disabled="apiStateIndex === (apiStates.length - 1)"
          >
            <Icon icon="redo" />
          </b-button>
        </b-button-group>
      </b-button-toolbar>
    </div>

    <div class="api-designer-columns-container" :style="`height: ${height}px`">
      <div 
        :class="`api-designer-abyss-container ${ (view === 'abyss' || view === 'hybrid') ? '' : 'd-none'}`"
      >
        <AbyssTool
          :api="apiStates[apiStateIndex]"
          :onChange="handleChange"
        />
      </div>
      <div
        :class="`api-designer-editor-container ${ (view === 'editor' || view === 'hybrid') ? '' : 'd-none'}`"
      >
        <Editor
          :value="editorValue"
          :onChange="handleEditorChange"
          :mode="mode"
          :debounce="1000"
        />
      </div>
    </div>
    <div class="api-designer-footer">
      <div class="row">
        <div class="col-md-10">
          <b-alert v-model="showNotValidAlert" variant="danger" dismissible>API is not valid!</b-alert>
          <b-alert v-model="showSavedAlert" variant="success" dismissible>API saved successfully!</b-alert>
        </div>
        <div class="col-md-1">
          <b-button
            variant="link"
            @click="onClose"
            data-qa="btnCancel"
            block
          >
            Close
          </b-button>
        </div>
        <div class="col-md-1">
          <b-button
            variant="primary"
            @click="handleSubmit"
            data-qa="btnSave"
            block
          >
            <Icon icon="save" /> Save
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import yaml from 'js-yaml';
import { mapActions } from 'vuex';
import Helpers from '@/helpers';
import AbyssTool from '@/components/shared/apiDesigner/abyssTool/AbyssTool';
import Editor from '@/components/shared/Editor';
import Icon from '@/components/shared/Icon';
import api from '@/api';

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
    onClose: {
      type: Function,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      view: this.initialView,
      apiStates: [(JSON.parse(JSON.stringify(this.api)))],
      apiStateIndex: 0,
      showNotValidAlert: false,
      showSavedAlert: false,
      mode: 'json',
    };
  },
  computed: {
    editorValue() {
      const { apiStates, apiStateIndex, mode } = this;
      const { openapidocument } = apiStates[apiStateIndex];
      if (mode === 'json') {
        return JSON.stringify(openapidocument, null, '\t');
      } else if (mode === 'yaml') {
        return yaml.dump(openapidocument);
      }
      return openapidocument;
    },
  },
  methods: {
    ...mapActions('businessApis', ['putBusinessApis']),
    ...mapActions('apis', ['putApis']),
    setView(view) {
      this.view = view;
    },
    setMode(mode) {
      this.mode = mode;
    },
    handleChange(propAddress, newPropValue, customAction) {
      const { apiStates, apiStateIndex } = this;
      const { objectDeepUpdate } = Helpers;
      let newApiState = JSON.parse(JSON.stringify(apiStates[apiStateIndex])); // eslint-disable-line
      objectDeepUpdate(propAddress, newPropValue, newApiState, customAction);
      this.apiStates = [...this.apiStates.slice(0, (apiStateIndex + 1)), newApiState];
      this.apiStateIndex += 1;
    },
    handleEditorChange(newValue) {
      const { apiStates, apiStateIndex, mode } = this;
      const newApiState = {
        ...apiStates[apiStateIndex],
        openapidocument: {
          ...(mode === 'json' ? JSON.parse(newValue) : yaml.load(newValue)),
        },
      };
      this.apiStates = [...this.apiStates.slice(0, (apiStateIndex + 1)), newApiState];
      this.apiStateIndex += 1;
    },
    handleUndo() {
      if (this.apiStateIndex > 0) {
        this.apiStateIndex -= 1;
      }
    },
    handleRedo() {
      if (this.apiStateIndex < (this.apiStates.length - 1)) {
        this.apiStateIndex += 1;
      }
    },
    handleSubmit() {
      const { apiStates, apiStateIndex, putApis } = this;
      const currentApi = apiStates[apiStateIndex];
      const { openapidocument } = currentApi;
      const { businessapiid } = openapidocument;
      // VALIDATE API
      api.validateApi({ spec: openapidocument })
      .then(() => {
        // SAVE API
        putApis({
          ...currentApi,
          apioriginid: currentApi.uuid,
          apiparentid: currentApi.uuid,
          businessapiid: businessapiid !== null ? businessapiid : currentApi.uuid,
        })
        .then(() => {
          this.showSavedAlert = true;
          setTimeout(function() { // eslint-disable-line
            this.showSavedAlert = false;
          }.bind(this), 3000);
        });
      })
      .catch(() => {
        this.showNotValidAlert = true;
        setTimeout(function() { // eslint-disable-line
          this.showNotValidAlert = false;
        }.bind(this), 3000);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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

  .api-designer-footer {
    padding: 1rem;
    border-top: 1px solid #dee2e6;
  }
}
</style>
