<template>
  <div>
    <DynamicFormSection
      v-for="(key, index) in keys" v-bind:key="index"
      :title="key"
      :properties="formTemplateWithData[key].properties"
      :required="formTemplateWithData[key].required"
      :type="formTemplateWithData[key].type"
      :propAddress="[key]"
      :level="0"
      :onChange="handleChange"
    />
  </div>
</template>

<script>
import Helpers from '@/helpers';
import DynamicFormSection from '@/components/shared/dynamicForm/DynamicFormSection';

export default {
  components: {
    DynamicFormSection,
  },
  props: {
    formTemplate: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    formData: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    onUpdate: {
      type: Function,
      required: true,
    },
  },
  watch: {
    formData() {
      this.mergeDataIntoTemplate();
    },
    formTemplate() {
      this.mergeDataIntoTemplate();
    },
  },
  computed: {
    keys() {
      const { formTemplateWithData } = this;
      return Object.keys(formTemplateWithData);
    },
  },
  data() {
    return {
      formTemplateWithData: {},
    };
  },
  methods: {
    handleChange(propAddress, newPropValue) {
      const { formTemplateWithData, onUpdate } = this;
      const { objectDeepUpdate, openApiObjectToFlatObject } = Helpers;
      let formTemplateWithDataClone = JSON.parse(JSON.stringify(formTemplateWithData)); // eslint-disable-line
      let flatObject = {}; // eslint-disable-line
      objectDeepUpdate([...propAddress, 'value'], newPropValue, formTemplateWithDataClone);
      openApiObjectToFlatObject(formTemplateWithDataClone, flatObject);
      onUpdate(flatObject);
    },
    mergeDataIntoTemplate() {
      const { mergeFlatObjectIntoOpenApiObject } = Helpers;
      const { formTemplate, formData } = this;
      const formTemplateClone = JSON.parse(JSON.stringify(formTemplate));
      const formDataClone = JSON.parse(JSON.stringify(formData));
      let mergedObject = {}; // eslint-disable-line
      mergeFlatObjectIntoOpenApiObject(formTemplateClone, formDataClone, mergedObject);
      this.formTemplateWithData = mergedObject;
    },
  },
  mounted() {
    this.mergeDataIntoTemplate();
  },
};
</script>