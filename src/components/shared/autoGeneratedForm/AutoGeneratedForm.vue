<template>
  <div class="auto-generated-form-container">
    <div class="auto-generated-form-header-container">
      <span
        v-for="(propName, columnIndex) in path"
        v-bind:key="columnIndex"
      >
        <span>
          {{ propName === '' ? name : propName }}
        </span>
        <span v-if="(columnIndex + 1) < path.length">
          &raquo;
        </span>
      </span>
    </div>
    <div class="auto-generated-form-content-container">
      <b-form>
        <AutoGeneratedFormLevel
          :interfaces="interfaces"
          :interfaceKey="formData.interfaceKey"
          :isArray="formData.isArray"
          :isMap="formData.isMap"
          :isCollapsible="false"
          :levelData="formData.propData"
          :levelPath="['']"
          :levelTitle="name"
          :level="0"
          :setPath="handlePathChange"
        />
      </b-form>
    </div>
  </div>
</template>

<script>
import AutoGeneratedFormLevel from '@/components/shared/autoGeneratedForm/AutoGeneratedFormLevel';

export default {
  props: {
    formData: {
      type: [Object, Array],
      required: true,
    },
    interfaces: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  components: {
    AutoGeneratedFormLevel,
  },
  data() {
    return {
      path: [''],
    };
  },
  methods: {
    handlePathChange(path) {
      this.path = [...path];
    },
  },
};
</script>

<style lang="scss">
.auto-generated-form-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .auto-generated-form-header-container {
    flex: 40px 0 0;
    padding: .5em 1em;
    border-bottom: 1px solid silver;
  }

  .auto-generated-form-content-container {
    flex: 1 0 0;
    overflow-y: scroll;
    padding: 1em;
  }
}
</style>