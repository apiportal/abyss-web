<template>
  <div>
    <div 
      v-for="(item, index) in Object.keys(currentObjectInterface)" 
      v-bind:key="index" 
      style="margin-bottom: 1rem;"
    >
      <div v-if="interfaces[currentObjectInterface[item].type]" style="border: 1px solid silver; border-radius: .3rem;">
        <div class="open-api-object-title" @click="() => handleToggleCollapse(item)">
          <span style="float: right;">
            <Icon :icon="(collapsedRows.indexOf(item) > -1 ? 'chevron-down' : 'chevron-right')" />
          </span>
          {{ item }}
        </div>
        <div v-if="(collapsedRows.indexOf(item) > -1)" style="padding: 1rem; border-top: 1px solid silver;">
          <OpenApiObjectForm
            :type="currentObjectInterface[item].type"
            :formData="formData[item] || {}"
            :pathArray="[...pathArray, item]"
            :onChange="onChange"
          />
        </div>
      </div>
      <div v-else>
        <div v-if="currentObjectInterface[item].type === 'string'">
          <div v-if="currentObjectInterface[item].Array">
            {{ currentObjectInterface[item] }}
          </div>
          <div v-else>
            <div v-if="currentObjectInterface[item].Markdown">
              <b-form-group
                :label="item"
              >
                <b-form-textarea
                  :placeholder="item"
                  :rows="3"
                  :max-rows="6"
                  :value="formData[item]"
                >
                </b-form-textarea>
              </b-form-group>
            </div>
            <div v-else>
              <DynamicFormInputString
                :description="item"
                :propAddress="[...pathArray, item]"
                :onChange="onChange"
                :value="formData[item]"
              />
            </div>
          </div>
        </div>
        <div v-else-if="currentObjectInterface[item].type === 'boolean'">
          <b-form-group>
            <b-form-checkbox-group>
              <b-form-checkbox 
                :value="true"
                :unchecked-value="false"
              >
                {{ item }}
              </b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </div>
        <div v-else>
          {{ item }}
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
.open-api-object-title {
  padding: .5rem;
}
</style>