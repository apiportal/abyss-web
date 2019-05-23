<template>
  <div>
    <div
      v-for="(item, index) in currentObjectInterfaceKeys"
      v-bind:key="index"
    >
      <div v-if="interfaces[currentObjectInterface[item].type]">
        <OpenApiObject
          :item="item"
          :type="currentObjectInterface[item].type"
          :formData="(
            formData[item] ||
            (currentObjectInterface[item].Array ?
            (currentObjectInterface[item].type === 'Security Requirement Object' ? { empty: true } : []) : {})
          )"
          :pathArray="[...pathArray, item]"
          :onChange="onChange"
          :isMapWithRegex="currentObjectInterface[item].MapWithRegex || false"
          :isMap="currentObjectInterface[item].Map || false"
          :isArray="currentObjectInterface[item].Array || false"
          :refs="refs"
          :securitySchemes="securitySchemes"
          :isInterface="true"
        />
      </div>

      <div v-else>
        <div v-if="currentObjectInterface[item].type === 'String'">
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
                :required="currentObjectInterface[item].Required"
                :debounce="1000"
              />
            </div>
            <div v-else-if="currentObjectInterface[item].Select">
              <DynamicFormSelect
                :description="item"
                :propAddress="[...pathArray, item]"
                :onChange="onChange"
                :value="formData[item]"
                :options="currentObjectInterface[item].Options"
                :required="currentObjectInterface[item].Required"
                :debounce="1000"
              />
            </div>
            <div v-else>
              <DynamicFormInputString
                :description="item"
                :propAddress="[...pathArray, item]"
                :onChange="onChange"
                :value="formData[item]"
                :required="currentObjectInterface[item].Required"
                :debounce="1000"
              />
            </div>
          </div>
        </div>
        <div v-else-if="currentObjectInterface[item].type === 'Boolean'">
          <DynamicFormCheckbox
            :description="item"
            :propAddress="[...pathArray, item]"
            :onChange="onChange"
            :value="formData[item]"
          />
        </div>
        <div v-else-if="currentObjectInterface[item].type === 'Number' || currentObjectInterface[item].type === 'Integer'">
          <div v-if="currentObjectInterface[item].Array">
            <DynamicFormChips
              :label="item"
              :propAddress="[...pathArray, item]"
              :onChange="onChange"
              :value="formData[item]"
              type="number"
              addItemText="New Item"
            />
          </div>
          <div v-else>
            <DynamicFormInputInteger
              :description="item"
              :propAddress="[...pathArray, item]"
              :onChange="onChange"
              :value="formData[item]"
              :required="currentObjectInterface[item].Required"
              :debounce="1000"
            />
          </div>
        </div>
        <!-- <div v-else-if="currentObjectInterface[item].type === 'Object'">
          {{item}}
          <hr>
          {{currentObjectInterface[item]}}
          <hr>
          {{formData[item]}}
          <hr>
          {{pathArray}}
          <OpenApiObjectForm
            :type="'Single Object'"
            :formData="formData[item]"
            :pathArray="[...pathArray, item]"
            :refs="refs"
            :securitySchemes="securitySchemes"
            :onChange="onChange"
          />
        </div> -->
        <div v-else-if="currentObjectInterface[item].type === 'Object' && formData[item]">
          <div
            v-for="(key, index) in Object.keys(formData[item])"
            v-bind:key="index"
          >
            <DynamicFormInputString
              :description="key"
              :propAddress="[...pathArray, item, key]"
              :onChange="onChange"
              :value="formData[item][key]"
              :debounce="1000"
            />
          </div>
        </div>

        <div v-else>
<pre>
i: {{item}}
cii: {{ currentObjectInterface[item] }}
fi: {{ formData[item] }}
f: {{ formData }}
</pre>
        </div>

        <div v-if="item == 'type' && formData[item]">
          <OpenApiObjectForm
            :type="formData[item]"
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
import DynamicFormInputString from '@/components/shared/dynamicForm/DynamicFormInputString';
import DynamicFormTextarea from '@/components/shared/dynamicForm/DynamicFormTextarea';
import DynamicFormCheckbox from '@/components/shared/dynamicForm/DynamicFormCheckbox';
import DynamicFormChips from '@/components/shared/dynamicForm/DynamicFormChips';
import DynamicFormSelect from '@/components/shared/dynamicForm/DynamicFormSelect';
import DynamicFormInputInteger from '@/components/shared/dynamicForm/DynamicFormInputInteger';

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
    refs: {
      type: Array,
    },
    securitySchemes: {
      type: Object,
    },
  },
  components: {
    Icon,
    DynamicFormInputString,
    DynamicFormTextarea,
    DynamicFormCheckbox,
    DynamicFormChips,
    DynamicFormSelect,
    DynamicFormInputInteger,
    OpenApiObject: () => import('@/components/shared/apiDesigner/abyssTool/OpenApiObject'),
  },
  computed: {
    currentObjectInterface() {
      return Interfaces[this.type];
    },
    currentObjectInterfaceKeys() {
      return Object.keys(this.currentObjectInterface);
    },
  },
  data() {
    return {
      // currentObjectInterface: Interfaces[this.type],
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