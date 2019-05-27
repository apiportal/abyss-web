<template>
  <div>
    <!-- <code class="text-success">{{currentInterfaceKeys}}</code> -->
    <div
      v-for="(key, index) in currentInterfaceKeys"
      v-bind:key="index"
    >
      <div v-if="interfaces[currentInterface[key].type]">
<!-- <textarea class="code" id="" cols="60" rows="5">
:item-{{key}}
:type={{type}}
:ci-key-type={{currentInterface[key].type}}
:formData={{formData[key] }}
:pathArray={{[...pathArray, key]}}
</textarea> -->
        <OpenApiObject
          :item="key"
          :type="currentInterface[key].type"
          :formData="(
            formData[key] ||
            (currentInterface[key].Array ?
            (currentInterface[key].type === 'Security Requirement Object' ? { empty: true } : []) : {})
          )"
          :pathArray="[...pathArray, key]"
          :onChange="onChange"
          :isMapWithRegex="currentInterface[key].MapWithRegex || false"
          :isMap="currentInterface[key].Map || false"
          :isArray="currentInterface[key].Array || false"
          :refs="refs"
          :securitySchemes="securitySchemes"
          :isInterface="true"
        />
      </div>

      <div v-else>
        <!-- <code>i:{{key}} t:{{type}} cit:{{currentInterface[key].type}}</code> -->
        <div v-if="currentInterface[key].type === 'String'">
          <div v-if="currentInterface[key].Array">
            <DynamicFormChips
              :label="key"
              :propAddress="[...pathArray, key]"
              :onChange="onChange"
              :value="formData[key]"
              addItemText="New Item"
            />
          </div>
          <div v-else>
            <div v-if="currentInterface[key].Markdown">
              <DynamicFormTextarea
                :description="key"
                :propAddress="[...pathArray, key]"
                :onChange="onChange"
                :value="formData[key]"
                :required="currentInterface[key].Required"
                :debounce="1000"
              />
            </div>
            <div v-else-if="currentInterface[key].Select">
              <DynamicFormSelect
                :description="key"
                :propAddress="[...pathArray, key]"
                :onChange="onChange"
                :value="formData[key]"
                :options="currentInterface[key].Options"
                :required="currentInterface[key].Required"
                :debounce="1000"
              />
            </div>
            <div v-else>
              <DynamicFormInputString
                :description="key"
                :propAddress="[...pathArray, key]"
                :onChange="onChange"
                :value="formData[key]"
                :required="currentInterface[key].Required"
                :debounce="1000"
              />
            </div>
          </div>
        </div>
        <div v-else-if="currentInterface[key].type === 'Boolean'">
          <DynamicFormCheckbox
            :description="key"
            :propAddress="[...pathArray, key]"
            :onChange="onChange"
            :value="formData[key]"
          />
        </div>
        <div v-else-if="currentInterface[key].type === 'Number' || currentInterface[key].type === 'Integer'">
          <div v-if="currentInterface[key].Array">
            <DynamicFormChips
              :label="key"
              :propAddress="[...pathArray, key]"
              :onChange="onChange"
              :value="formData[key]"
              type="number"
              addItemText="New Item"
            />
          </div>
          <div v-else>
            <DynamicFormInputInteger
              :description="key"
              :propAddress="[...pathArray, key]"
              :onChange="onChange"
              :value="formData[key]"
              :required="currentInterface[key].Required"
              :debounce="1000"
            />
          </div>
        </div>

        <div v-else-if="type === 'Object Property'">
<!-- <textarea class="code" id="" cols="30" rows="5">
key-{{key}}
type-{{type}}
pathArray-{{pathArray}}
formData-{{formData}}
formData-{{formData[key]}}
</textarea> -->
          <DynamicFormInputString
            :description="key"
            :propAddress="[...pathArray]"
            :onChange="onChange"
            :value="formData[key]"
            :debounce="1000"
          />
        </div>

        <div v-else>
<pre>
key: {{key}}
currentInterface.key: {{ currentInterface[key] }}
formData.key: {{ formData[key] }}
formData: {{ formData }}
</pre>
        </div>

        <div v-if="key == 'type' && formData[key]">
          <OpenApiObjectForm
            :type="formData[key]"
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
    currentInterface() {
      // console.log('Interfaces[this.type]: ', Interfaces[this.type]); // eslint-disable-line
      const objectInterface = {
        [Object.keys(this.formData)[0]]: { ...Interfaces[this.type] },
      };
      // console.log('objectInterface: ', objectInterface); // eslint-disable-line
      if (this.type === 'Object Property') {
        return objectInterface;
      }
      return Interfaces[this.type];
    },
    currentInterfaceKeys() {
      return Object.keys(this.currentInterface);
    },
  },
  data() {
    return {
      // currentInterface: Interfaces[this.type],
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