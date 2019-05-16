<template>
  <div 
    :class="`open-api-object ${isCollapsed ? 'collapsed' : ''}`"
  >
    <div 
      class="open-api-object-title"
      @click="() => handleToggleCollapse()"
    >
      <span style="float: right;">
        <Icon :icon="(isCollapsed ? 'chevron-down' : 'chevron-right')" />
      </span>
      <span v-if="type === 'Response Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteObjectItem">Delete response</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="type === 'Schema Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteObjectItem">Delete schema</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="type === 'Parameter Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteObjectItem" v-if="!isDynamicTitle">Delete parameter</b-dropdown-item>
          <b-dropdown-item @click="handleDeleteArrayItem" v-if="isDynamicTitle">Delete parameter</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="type === 'Request Body Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteObjectItem">Delete request body</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="type === 'Header Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteObjectItem">Delete header</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="type === 'Security Scheme Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteObjectItem">Delete security scheme</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="type === 'Link Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteObjectItem">Delete link</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="type === 'Callback Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteObjectItem">Delete callback</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="type === 'Server Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteArrayItem">Delete Server</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="type === 'Tag Object' && !isMap && !isArray" class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteArrayItem">Delete tag</b-dropdown-item>
        </b-dropdown>
      </span>
      <span v-if="isDynamicTitle">
        {{ title }} <span style="font-size: .75rem; color: grey;">{{ description }}</span>
      </span>
      <span v-else>
        <strong>{{ item }}</strong>
        <small class="text-muted">{{type}} - {{typeHelper}}</small>
      </span>
    </div>
    <div v-if="isCollapsed" class="open-api-object-container">
      <div v-if="isMapWithRegex">
        <div
          v-for="(key, index) in formDataKeys"
          v-bind:key="index"
          :class="(index < (formDataKeys.length - 1) ? 'mb-3' : '')"
        >
          <OpenApiObject
            :item="key"
            :type="interfaces[type]['{template}'].type"
            :formData="formData[key]"
            :pathArray="[...pathArray, key]"
            :refs="refs"
            :securitySchemes="securitySchemes"
            :onChange="onChange"
          />
        </div>
      </div>
      <div v-else-if="isMap">
        <div
          v-for="(key, index) in formDataKeys"
          v-bind:key="index"
          :class="(index < (formDataKeys.length - 1) ? 'mb-3' : '')"
        >
          <OpenApiObject
            :item="key"
            :type="type"
            :formData="formData[key]"
            :pathArray="[...pathArray, key]"
            :refs="refs"
            :securitySchemes="securitySchemes"
            :onChange="onChange"
          />
        </div>
      </div>
      <div v-else-if="isArray">
        <div
          v-if="type === 'Security Requirement Object'"
        >
          <Security
            :onChange="onChange"
            :pathArray="pathArray"
            :formData="formData"
            :securitySchemes="securitySchemes"
          />
        </div>
        <div v-else>
          <div
            v-for="(formItemData, index) in formData"
            v-bind:key="index"
            :class="(index < (formData.length - 1) ? 'mb-3' : '')"
          >
            <OpenApiObject
              :item="index"
              :type="type"
              :formData="formItemData"
              :pathArray="[...pathArray, index]"
              :refs="refs"
              :securitySchemes="securitySchemes"
              :onChange="onChange"
              :isDynamicTitle ="true"
              :title="getTitle(type, formItemData)"
              :description="getDescription(type, formItemData)"
            />
          </div>
          <div :style="`margin-top: ${formData.length === 0 ? 0 : 1}rem;`">
            <b-button
              @click="() => addArrayItem(pathArray, formData)"
            >
              New "{{item}}" item
            </b-button>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          v-if="
            type === 'Response Object' ||
            type === 'Request Body Object' ||
            type === 'Parameter Object' ||
            type === 'Callback Object' ||
            type === 'Schema Object' ||
            type === 'Security Scheme Object'
          "
          style="margin-bottom: 1rem;"
        >
          <b-input-group prepend="$ref:">
            <b-form-select
              v-model="formData['$ref']"
              @change="handleRefChange"
            >
              <option
                :value="undefined"
              >
                None
              </option>
              <optgroup 
                v-for="(optGroup, optGroupIndex) in refs"
                v-bind:key="optGroupIndex"
                :label="optGroup.name"
              >
                <option
                  v-for="(option, optionIndex) in optGroup.options"
                  v-bind:key="optionIndex"
                  :value="option"
                >
                  {{ option }}
                </option>
              </optgroup>
            </b-form-select>
          </b-input-group>
        </div>
        <div v-if="!formData['$ref']">
          <OpenApiObjectForm
            :type="type"
            :formData="formData"
            :pathArray="pathArray"
            :refs="refs"
            :securitySchemes="securitySchemes"
            :onChange="onChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Interfaces from '@/assets/openAPI3.0.json';

import Icon from '@/components/shared/Icon';

export default {
  name: 'OpenApiObject',
  props: {
    item: {
      type: [String, Number],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    formData: {
      type: [Array, Object],
      required: false,
      default() { return {}; },
    },
    pathArray: {
      type: Array,
      required: true,
    },
    onChange: {
      type: Function,
      required: true,
    },
    isMapWithRegex: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    isMap: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    isArray: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    isCollapsedInitial: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    title: {
      type: String,
      required: false,
      default() { return ''; },
    },
    description: {
      type: String,
      required: false,
      default() { return ''; },
    },
    isDynamicTitle: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    refs: {
      type: Array,
    },
    securitySchemes: {
      type: Object,
    },
  },
  components: {
    OpenApiObjectForm: () => import('@/components/shared/apiDesigner/abyssTool/OpenApiObjectForm'),
    Security: () => import('@/components/shared/apiDesigner/abyssTool/Security'),
    Icon,
  },
  computed: {
    formDataKeys() {
      return Object.keys(this.formData);
    },
    typeHelper() {
      if (this.isMapWithRegex) {
        return 'isMapWithRegex';
      } else if (this.isMap) {
        return 'isMap';
      } else if (this.isArray) {
        return ('isArray');
      }
      return 'isElse';
    },
  },
  data() {
    return {
      isCollapsed: this.isCollapsedInitial,
      interfaces: Interfaces,
      refAddress: this.formData['$ref'] || null, // eslint-disable-line
    };
  },
  methods: {
    handleToggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    handleRefChange(newValue) {
      const { pathArray } = this;
      if (newValue === null) {
        this.onChange([...pathArray], {});
      } else {
        this.onChange([...pathArray], { '$ref': newValue }); // eslint-disable-line
      }
    },
    addArrayItem(pathArray, currentItems) {
      console.log('pathArray, currentItems: ', pathArray, currentItems); // eslint-disable-line
      this.onChange(pathArray, [...currentItems, {}]);
    },
    getTitle(type, data) {
      if (data['$ref']) { // eslint-disable-line
        return data['$ref']; // eslint-disable-line
      }
      if (type === 'Tag Object') {
        return (data.name || '');
      } else if (type === 'Server Object') {
        return (data.url || '');
      } else if (type === 'Parameter Object') {
        return (data.name || '');
      }
      return '';
    },
    getDescription(type, data) {
      if (type === 'Tag Object') {
        return (data.description || '');
      } else if (type === 'Server Object') {
        return (data.description || '');
      } else if (type === 'Parameter Object') {
        return (data.description || '');
      }
      return '';
    },
    handleDeleteObjectItem() {
      this.handleToggleCollapse();
      this.onChange(this.pathArray, null, 'deleteLastItem');
    },
    handleDeleteArrayItem() {
      this.handleToggleCollapse();
      this.onChange(this.pathArray, null, 'deleteLastIndex');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>