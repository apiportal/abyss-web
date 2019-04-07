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
      <span v-if="isDynamicTitle">
        {{ title }} <span style="font-size: .75rem; color: grey;">{{ description }}</span>
      </span>
      <span v-else>
        {{ item }}
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
            :onChange="onChange"
          />
        </div>
      </div>
      <div v-else-if="isArray">
        <div
          v-if="type === 'Security Requirement Object'"
        >
          <b-form-group>
            <b-form-radio v-model="selected" name="some-radios" value="A">Use default security</b-form-radio>
            <b-form-radio v-model="selected" name="some-radios" value="B">Disable security</b-form-radio>
            <b-form-radio v-model="selected" name="some-radios" value="C">Use custom security</b-form-radio>
          </b-form-group>
        </div>
        <div v-else>
          <div
            v-for="(formItemData, index) in formData"
            v-bind:key="index"
            :class="(index < (formData.length - 1) ? 'mb-3' : '')"
          >
            <!-- {{ formItemData.name }} -->
            <OpenApiObject
              :item="index"
              :type="type"
              :formData="formItemData"
              :pathArray="[...pathArray, index]"
              :refs="refs"
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
        <!-- {{ type }} -->
        <div
          v-if="
            type === 'Response Object' ||
            type === 'Request Body Object' ||
            type === 'Parameter Object' ||
            type === 'Callback Object' ||
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
  },
  components: {
    OpenApiObjectForm: () => import('@/components/shared/apiDesigner/abyssTool/OpenApiObjectForm'),
    Icon,
  },
  computed: {
    formDataKeys() {
      return Object.keys(this.formData);
    },
  },
  data() {
    return {
      isCollapsed: this.isCollapsedInitial,
      interfaces: Interfaces,
      refAddress: this.formData['$ref'] || null, // eslint-disable-line
      selected: 'A', // get rid of this line
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
      this.onChange(pathArray, [...currentItems, {}]);
    },
    getTitle(type, data) {
      // console.log(type, data);
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
      // console.log(type, data);
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
.open-api-object {
  border: 1px solid silver;
  border-radius: .3rem;

  &.collapsed {
    border-left: 4px solid #0088CC;
  }

  .open-api-object-title {
    padding: .5rem;
    cursor: pointer;
  }
}

.open-api-object-container {
  padding: 1rem;
  border-top: 1px solid silver;
}
</style>