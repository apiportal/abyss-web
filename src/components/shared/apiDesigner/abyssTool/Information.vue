<template>
  <div>
    <OpenApiObject
      item="info"
      type="Info Object"
      :formData="openapidocument.info"
      :pathArray="['openapidocument', 'info']"
      :onChange="onChange"
      :isCollapsedInitial="true"
      :isMenu="false"
    />
    <OpenApiObject
      item="externalDocs"
      type="External Documentation Object"
      :formData="openapidocument.externalDocs"
      :pathArray="['openapidocument', 'externalDocs']"
      :onChange="onChange"
      :isCollapsedInitial="true"
      :isMenu="false"
    />
  </div>
</template>

<script>
import OpenApiObject from '@/components/shared/apiDesigner/abyssTool/OpenApiObject';

export default {
  props: {
    openapidocument: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    onChange: {
      type: Function,
      required: true,
    },
  },
  components: {
    OpenApiObject,
  },
};
</script>