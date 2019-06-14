<template>
  <div :class="`open-api-object ${isCollapsed ? 'collapsed' : ''}`">
    <div class="open-api-object-title">
      <div @click="handleToggleCollapse"><strong>{{ path }}</strong></div>
      <span class="oao-dropdown">
        <b-dropdown variant="link" size="md" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-form class="pt-3 path-form">
            <b-form-group>
              <label class="form-label">Path Key</label>
              <b-form-input
                v-model="newPathKey"
                type="text"
                placeholder="Path Key"
                :state="pathKeyState"
                @change="renamePath"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group >
              <label>
                Add Operation
              </label>
              <b-form-select
                v-model="selectedOperation"
                :options="computedOperationOptions"
                @change="addOperation"
              />
            </b-form-group>
          </b-dropdown-form>
          <b-dropdown-divider class="m-0"></b-dropdown-divider>
          <b-dropdown-item @click="addPath">Add Path</b-dropdown-item>
          <b-dropdown-item @click="deletePath">Delete Path</b-dropdown-item>
        </b-dropdown>
      </span>
      <span class="oao-arrow" @click="handleToggleCollapse">
        <Icon :icon="(isCollapsed ? 'chevron-down' : 'chevron-right')" />
      </span>
    </div>
    <div class="open-api-object-container" :class="`${isCollapsed ? '' : 'd-none'}`">
      <div v-for="(item, index) in operations" v-bind:key="index">
        <Operation
          :operation="item"
          :operationKey="item.parentProps.operationType"
          :pathKey="item.parentProps.path"
          :onChange="onChange"
          :refs="refs"
          :securitySchemes="securitySchemes"
          :tags="tags"
        />
      </div>
      <div>
        <OpenApiObjectForm
          type="Path Item Object"
          :formData="pathObject"
          :pathArray="pathArray"
          :onChange="onChange"
          :refs="refs"
          :securitySchemes="securitySchemes"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Operation from '@/components/shared/apiDesigner/abyssTool/paths/Operation';
import OpenApiObjectForm from '@/components/shared/apiDesigner/abyssTool/OpenApiObjectForm';
import Icon from '@/components/shared/Icon';

export default {
  props: {
    path: {
      type: String,
      required: true,
    },
    pathObject: {
      type: Object,
    },
    pathArray: {
      type: Array,
      required: true,
    },
    operations: {
      type: Array,
      required: true,
    },
    refs: {
      type: Array,
      required: false,
      default() { return []; },
    },
    securitySchemes: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    tags: {
      type: Array,
      required: false,
      default() { return []; },
    },
    onChange: {
      type: Function,
      required: true,
    },
  },
  components: {
    Operation,
    OpenApiObjectForm,
    Icon,
  },
  data() {
    return {
      isCollapsed: false,
      newPathKey: this.path,
      selectedOperation: null,
      operationOptionsInuse: [],
      operationOptions: [
        { value: null, text: 'Select an operation' },
        'get',
        'post',
        'put',
        'patch',
        'delete',
        'options',
        'head',
        'trace',
      ],
    };
  },
  computed: {
    pathKeyState() {
      return this.newPathKey.length > 0;
    },
    computedOperationOptions() {
      const { operations, operationOptions } = this;
      this.operationOptionsInuse = operations.map(item => (
        item.parentProps.operationType
      ));
      return operationOptions.filter(f => !this.operationOptionsInuse.includes(f));
    },
  },
  watch: {
    path(newValue) {
      if (newValue) {
        this.newPathKey = newValue;
      }
    },
    operations(newValue) {
      if (newValue) {
        this.selectedOperation = null;
      }
    },
  },
  methods: {
    handleToggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    renamePath(val) {
      const { pathArray } = this;
      if (this.pathKeyState) {
        this.onChange(pathArray, val, 'renameItem');
      }
    },
    deletePath() {
      const { pathArray } = this;
      this.onChange(pathArray, null, 'deleteLastItem');
    },
    addPath() {
      const { pathArray } = this;
      this.onChange([...pathArray.slice(0, -1), '/newPath'], {}, 'addItem');
    },
    addOperation(val) {
      const { pathArray } = this;
      if (val) {
        const newOp = {
          responses: {
            default: {
              description: 'Default Response',
            },
          },
        };
        this.onChange([...pathArray, val], newOp, 'addItem');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>