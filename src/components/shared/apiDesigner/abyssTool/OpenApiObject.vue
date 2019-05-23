<template>
  <div :class="`open-api-object ${isCollapsed ? 'collapsed' : ''}`">
    <div class="open-api-object-title">
      <span class="oao-arrow">
        <Icon :icon="(isCollapsed ? 'chevron-down' : 'chevron-right')" />
      </span>
      <span v-if="isMenu && type !== 'License Object' && type !== 'Contact Object'" class="oao-dropdown">
        <b-dropdown variant="link" size="md" right no-caret>

          <template slot="button-content"><Icon icon="ellipsis-h" /></template>

          <b-dropdown-item v-if="isMap || isMapWithRegex" @click="addObjectItem(newObjectItem)"><Icon icon="plus" /> Add {{type}}</b-dropdown-item>
          <b-dropdown-item v-if="isArray" @click="addArrayItem"><Icon icon="plus" /> Add New {{item}} Item</b-dropdown-item>

          <b-dropdown-form class="pt-3 path-form" v-if="!isInterface && !isMap && !isArray && !isMapWithRegex">
            <b-form-group>
              <label class="form-label">Rename {{type}}</label>
              <b-form-input
                v-model="renamedItem"
                type="text"
                @change="renameObjectItem"
              ></b-form-input>
            </b-form-group>
          </b-dropdown-form>

          <b-dropdown-form class="pt-3 path-form" v-if="isMap && pathArray.indexOf('securitySchemes') > -1">
            <b-form-group >
              <label>
                Add Security Schemes
              </label>
              <b-form-select
                v-model="selectedSecurity"
                :options="computedSecurityOptions"
                @change="addSecurity"
              />
            </b-form-group>
          </b-dropdown-form>

          <b-dropdown-item v-if="!isInterface && !isDynamicTitle && !isArray" @click="handleDeleteObjectItem" class="border-top"><Icon icon="trash" /> Delete {{item}} Object</b-dropdown-item>
          <b-dropdown-item v-if="isDynamicTitle" @click="handleDeleteArrayItem" class="border-top"><Icon icon="trash-alt" /> Delete {{title}} Item</b-dropdown-item>

        </b-dropdown>
      </span>
      <div @click="() => handleToggleCollapse()">
        <span v-if="isDynamicTitle">
          <strong>{{ title }}</strong> <small class="text-muted">{{ description }}</small>
        </span>
        <span v-else>
          <strong>{{ item }}</strong>
          [{{ formDataKeys.length }}]
        </span>
        <small class="text-muted">{{type}} - <strong>{{typeHelper}}</strong></small>
        <small :title="pathArray">{{ pathDots }}</small>
      </div>
    </div>
    <div v-if="isCollapsed" class="open-api-object-container">
      <div v-if="isMapWithRegex">
        <div
          v-for="(key, index) in formDataKeys"
          v-bind:key="index"
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
        <div v-if="type === 'Security Requirement Object'">
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
              :title="getTitle(formItemData)"
              :description="getDescription(formItemData)"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="
            type === 'Response Object' ||
            type === 'Request Body Object' ||
            type === 'Parameter Object' ||
            type === 'Callback Object' ||
            type === 'Schema Object' ||
            type === 'Security Scheme Object'
          ">
          <b-form-group>
            <b-input-group prepend="$ref:">
              <b-form-select
                v-model="formData['$ref']"
                @change="handleRefChange"
              >
                <option :value="undefined">None</option>
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
          </b-form-group>
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
    isInterface: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    isMenu: {
      type: Boolean,
      required: false,
      default() { return true; },
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
  watch: {
    formDataKeys(newValue) {
      if (newValue) {
        this.selectedSecurity = null;
      }
    },
  },
  computed: {
    newItemName() {
      return `new${this.type.replace(' Object', '').replace(/ /g, '')}`;
    },
    newObjectItem() {
      const { type, newItemName } = this;
      if (type === 'Media Type Object') {
        return {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        };
      }
      if (type === 'Responses Object') {
        return {
          100: {
            description: 'Successful operation',
          },
        };
      }
      if (type === 'Server Variable Object') {
        return { [newItemName]: { default: 'default' } };
      }
      return { [newItemName]: {} };
    },
    formDataKeys() {
      return Object.keys(this.formData);
    },
    pathDots() {
      return this.pathArray.slice(1, this.pathArray.length).join('.');
    },
    computedSecurityOptions() {
      const { securityOptions } = this;
      const options = Object.keys(securityOptions).map(i => ({
        value: {
          [i]: securityOptions[i],
        },
        text: i,
      }));
      // console.log('options: ', options); // eslint-disable-line
      return options.filter(el =>
        !this.formDataKeys.some(f => f === el.text),
      );
    },
    renamedItem: {
      get() {
        return this.item;
      },
      set(newVal) {
        return newVal;
      },
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
      selectedSecurity: null,
      securityOptions: Interfaces['Security Schemes Options'],
      newResponse: {
        100: {
          description: 'Successful operation',
        },
      },
      newMediaType: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
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
    addArrayItem() {
      const { pathArray, formData } = this;
      this.onChange(pathArray, [...formData, {}]);
      this.isCollapsed = true;
    },
    addObjectItem(newObject = {}) {
      const { pathArray } = this;
      const key = Object.keys(newObject)[0];
      const value = newObject[key];
      // console.log('pathArray, newObject: ', [...pathArray, key], value); // eslint-disable-line
      this.onChange([...pathArray, key], value, 'addItem');
      this.isCollapsed = true;
    },
    renameObjectItem(val) {
      const { pathArray } = this;
      // console.log('pathArray, val: ', pathArray, val); // eslint-disable-line
      this.onChange(pathArray, val, 'renameItem');
    },
    handleDeleteObjectItem() {
      this.handleToggleCollapse();
      this.onChange(this.pathArray, null, 'deleteLastItem');
    },
    handleDeleteArrayItem() {
      this.handleToggleCollapse();
      this.onChange(this.pathArray, null, 'deleteLastIndex');
    },
    addSecurity(val) {
      if (val) {
        const { pathArray } = this;
        const key = Object.keys(val)[0];
        const value = val[key];
        this.onChange([...pathArray, key], value, 'addItem');
        this.isCollapsed = true;
      }
    },
    getTitle(data) {
      const { type } = this;
      if (data['$ref']) { // eslint-disable-line
        return data['$ref']; // eslint-disable-line
      }
      if (type === 'Tag Object') {
        return (data.name || '');
      } else if (type === 'Server Object') {
        return (data.url || '');
      } else if (type === 'Parameter Object') {
        return (data.name || '');
      } else if (type === 'Schema Object') {
        return (data.type || '-');
      }
      return '-';
    },
    getDescription(data) {
      const { type } = this;
      if (type === 'Tag Object') {
        return (data.description || '');
      } else if (type === 'Server Object') {
        return (data.description || '');
      } else if (type === 'Parameter Object') {
        return (data.description || '');
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>