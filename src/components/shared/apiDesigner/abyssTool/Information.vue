<template>
  <div>
    <div>
      <OpenApiObject
        item="info"
        type="Info Object"
        :formData="openapidocument.info"
        :pathArray="['openapidocument', 'info']"
        :onChange="onChange"
        :isCollapsedInitial="true"
      />
    </div>
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