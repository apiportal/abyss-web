<template>
  <div>
    <div
      v-for="(key, index) in currentInterfaceKeys"
      v-bind:key="index"
    >
<!-- <textarea class="code" id="" cols="60" rows="5">
:type={{type}}
:currentInterface={{currentInterface}}
:formData={{formData}}
</textarea> -->
      <div v-if="interfaces[currentInterface[key].type]">
<!-- <textarea class="code" id="" cols="60" rows="5">
:item-{{key}}
:type={{type}}
:currentInterface-key-type={{currentInterface[key].type}}
:currentInterface-key={{currentInterface[key]}}
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
          :isMenu="currentInterface[key].Menu"
        />
      </div>

      <div v-else>
<!-- <textarea class="code" id="" cols="30" rows="10">
:type={{type}}
:ooo={{Object.keys(currentInterface)}}
</textarea>
<textarea class="code" id="" cols="30" rows="10">
:type={{type}}
:ooo={{Object.keys(formData)}}
</textarea> -->
        <div v-if="currentInterface[key].type === 'String'">
          <div v-if="currentInterface[key].Array">
            <DynamicFormChips
              :label="key"
              :propAddress="[...pathArray, key]"
              :onChange="onChange"
              :value="formData[key]"
              :autocompleteOptions="autocompleteOptions(key)"
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
                :options="currentInterface[key].Select"
                :required="currentInterface[key].Required"
                :replace="Boolean(currentInterface[key].Replace)"
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

        <div v-if="currentInterface[key].Options && formData[key]">
<!-- <textarea class="code" id="" cols="30" rows="5">
{{`${type}.${Object.keys(currentInterface)[0]}.Options.${formData[key]}`}}
:type={{type}}
:currentInterface[key]={{currentInterface[key]}}
:currentInterface={{currentInterface}}
</textarea>
<textarea class="code" id="" cols="30" rows="5">
:type={{type}}
:formData={{formData}}
:formData[key]={{formData[key]}}
</textarea> -->
          <OpenApiObjectForm
            :type="`${type}.${Object.keys(currentInterface)[0]}.Options.${formData[key]}`"
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
    isMenu: {
      type: Boolean,
      required: false,
      default() { return true; },
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
      const getNestedObject = (o, p) => p.split('.').reduce((xs, x) => (xs && xs[x]) ? xs[x] : undefined, o); // eslint-disable-line
      if (this.type.indexOf('Options') > -1) {
        return getNestedObject(Interfaces, this.type);
      }
      if (this.type === 'Object Property') {
        const objectInterface = {
          [Object.keys(this.formData)[0]]: { ...Interfaces[this.type] },
        };
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
      interfaces: Interfaces,
      collapsedRows: [],
    };
  },
  methods: {
    autocompleteOptions(key) {
      if (key === 'tags') {
        return this.tags.map(chip => ({ text: chip.name, value: chip.name }));
      }
      if (this.type === 'Schema Object' && key === 'required' && this.formData.properties) {
        return Object.keys(this.formData.properties).map(chip => ({ text: chip, value: chip }));
      }
      return [];
    },
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