<template>
  <div :class="`open-api-object ${isCollapsed ? 'collapsed' : ''}`">
    <div class="open-api-object-title">
      <span class="float-right">
        <Icon :icon="(isCollapsed ? 'chevron-down' : 'chevron-right')" />
      </span>
      <span class="oao-dropdown">
        <b-dropdown variant="link" size="sm" right no-caret>
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
      <div @click="handleToggleCollapse"><strong>{{ path }}</strong></div>
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
        />
      </div>
      <div>
        <OpenApiObjectForm
          type="Path Item Object"
          :formData="pathObject"
          :pathArray="['openapidocument', 'paths', path]"
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
    refs: {
      type: Array,
    },
    pathObject: {
      type: Object,
    },
    securitySchemes: {
      type: Object,
    },
    operations: {
      type: Array,
      required: true,
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
      if (this.pathKeyState) {
        this.onChange(['openapidocument', 'paths', this.path], val, 'renameItem');
      }
    },
    deletePath() {
      this.onChange(['openapidocument', 'paths', this.path], null, 'deleteLastItem');
    },
    addPath() {
      this.onChange(['openapidocument', 'paths', '/newPath'], {}, 'addItem');
    },
    addOperation(val) {
      if (val) {
        const newOp = {
          responses: {
            default: {
              description: 'Default Response',
            },
          },
        };
        this.onChange(['openapidocument', 'paths', this.path, val], newOp, 'addItem');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>