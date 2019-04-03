<template>
  <div>
    <div 
      v-for="(item, index) in currentObjectInterfaceKeys" 
      v-bind:key="index" 
      :class="(index < (currentObjectInterfaceKeys.length - 1) ? 'mb-3' : '')"
    >
      <div v-if="interfaces[currentObjectInterface[item].type]">
        <div>
          <OpenApiObject
            :item="item"
            :type="currentObjectInterface[item].type"
            :formData="(
              formData[item] ||
              (currentObjectInterface[item].Array ? [] : {})
            )"
            :pathArray="[...pathArray, item]"
            :onChange="onChange"
            :isMapWithRegex="currentObjectInterface[item].MapWithRegex || false"
            :isMap="currentObjectInterface[item].Map || false"
            :isArray="currentObjectInterface[item].Array || false"
          />
        </div>
      </div>
      <div v-else>
        <div v-if="currentObjectInterface[item].type === 'string'">
          <div v-if="currentObjectInterface[item].Array">
            <DynamicFormChips
              :label="item"
              :propAddress="[...pathArray, item]"
              :onChange="onChange"
              :value="formData[item]"
              addItemText="New Item"
            />
          </div>
          <div v-else>
            <div v-if="currentObjectInterface[item].Markdown">
              <DynamicFormTextarea
                :description="item"
                :propAddress="[...pathArray, item]"
                :onChange="onChange"
                :value="formData[item]"
                :debounce="1000"
              />
            </div>
            <div v-else>
              <DynamicFormInputString
                :description="item"
                :propAddress="[...pathArray, item]"
                :onChange="onChange"
                :value="formData[item]"
                :debounce="1000"
              />
            </div>
          </div>
        </div>
        <div v-else-if="currentObjectInterface[item].type === 'boolean'">
          <DynamicFormCheckbox
            :description="item"
            :propAddress="[...pathArray, item]"
            :onChange="onChange"
            :value="formData[item]"
          />
        </div>
        <div v-else>
          {{ currentObjectInterface[item] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Interfaces from '@/assets/openAPI3.0.json';
import Icon from '@/components/shared/Icon';
import DynamicFormInputString from '@/components/shared/dynamicForm/DynamicFormInputString';
import DynamicFormTextarea from '@/components/shared/dynamicForm/DynamicFormTextarea';
import DynamicFormCheckbox from '@/components/shared/dynamicForm/DynamicFormCheckbox';
import DynamicFormChips from '@/components/shared/dynamicForm/DynamicFormChips';

export default {
  name: 'OpenApiObjectForm',
  props: {
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
  },
  components: {
    Icon,
    DynamicFormInputString,
    DynamicFormTextarea,
    DynamicFormCheckbox,
    DynamicFormChips,
    OpenApiObject: () => import('@/components/shared/apiDesigner/abyssTool/OpenApiObject'),
  },
  computed: {
    currentObjectInterfaceKeys() {
      return Object.keys(this.currentObjectInterface);
    },
  },
  data() {
    return {
      currentObjectInterface: Interfaces[this.type],
      interfaces: Interfaces,
      collapsedRows: [],
    };
  },
  methods: {
    handleToggleCollapse(key) {
      const index = this.collapsedRows.indexOf(key);

      if (index > -1) {
        this.collapsedRows.splice(index, 1);
      } else {
        this.collapsedRows.push(key);
      }
    },
  },
};
</script>

<style lang="scss">
</style>