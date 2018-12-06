<template>
  <div class="api-container">
    <FinderLayout
      name="pet3"
      :path="path"
      :onPathChange="handlePathChange"
    >
      <template>
        <FinderColumn
          v-for="(column, columnIndex) in columns"
          v-bind:key="columnIndex"
        >
          <template>
            <FinderColumnObject
              v-if="column.type === 'object'"
              :objectProps="column.propNames"
              :objectInterface="column.interface"
              :columnIndex="columnIndex"
              :onPathChange="handlePathChange"
              :path="path"
            />
            <div
              v-else
            >
              {{ column }}
            </div>
          </template>
        </FinderColumn>
      </template>
    </FinderLayout>

  </div>
</template>

<script>
// import api from '@/api';
import FinderLayout from '@/components/shared/finder/FinderLayout';
import FinderColumn from '@/components/shared/finder/FinderColumn';
import FinderColumnObject from '@/components/shared/finder/FinderColumnObject';
import Interfaces from '@/assets/openAPI3.0.json';
import Pet3 from '@/assets/pet3.json';


export default {
  components: {
    FinderLayout,
    FinderColumn,
    FinderColumnObject,
  },
  computed: {
    columns() {
      const getPropData = ({ obj, keys }) =>
        keys.reduce((reducedObj, key) => reducedObj[key], obj);
      const getPropInterface = ({ interfaces, keys, currentInterfaceKey = 'Root Object', currentKeyIndex = 0 }) => {
        const currentInterface = interfaces[currentInterfaceKey];
        const currentKey = keys[currentKeyIndex];

        if (currentKeyIndex < keys.length) {
          // NOT A DEFINED INTERFACE
          if (!(currentInterface[currentKey] && currentInterface[currentKey].type)) {
            // TODO PATHS -> {PATH} regex
            return {};
          }
          const nextInterfaceKey = currentInterface[currentKey].type;
          console.log(currentInterface[currentKey]);
          return getPropInterface({
            interfaces,
            keys,
            currentInterfaceKey: nextInterfaceKey,
            currentKeyIndex: (currentKeyIndex + 1),
          });
        }

        return interfaces[currentInterfaceKey];
      };
      const getColumnData = ({ propData }) => {
        const dataType = (typeof propData);

        if (dataType === 'object') {
          return {
            type: dataType,
            propNames: Object.keys(propData),
          };
        }
        return {
          type: dataType,
          data: propData,
        };
      };

      return this.path.map((item, index) => {
        const { apiData, interfaces, path } = this;
        const propData = (
          index === 0 ?
          this.apiData :
          getPropData({ obj: apiData, keys: path.slice(1, (index + 1)) })
        );
        const propInterface = (
          index === 0 ?
          interfaces['Root Object'] :
          getPropInterface({ interfaces, keys: path.slice(1, (index + 1)) })
        );
        return {
          ...getColumnData({ propData, propInterface }),
        };
      });
    },
  },
  data() {
    return {
      apiData: Pet3,
      interfaces: Interfaces,
      path: [''],
    };
  },
  mounted() {
  },
  methods: {
    handlePathChange({ columnIndex, propName }) {
      this.path = [...this.path.slice(0, (columnIndex + 1)), propName];
    },
    // updateObjectPropName(obj, oldVal, newVal) {
    //   return Object.keys(obj).reduce((object, key) => {
    //     if (key === newVal) {
    //       return { ...object };
    //     }
    //     return {
    //       ...object,
    //       [key !== oldVal ? key : newVal]: obj[key],
    //     };
    //   }, {});
    // },
    // toggleRollableWidget(index) {
    //   this.widgets[index].isRolled = !this.widgets[index].isRolled;
    // },
    // handleMethodChange({ path, oldVal, newVal }) {
    //   this.apiData = {
    //     ...this.apiData,
    //     paths: {
    //       ...this.apiData.paths,
    //       [path]: {
    //         ...this.updateObjectPropName(this.apiData.paths[path], oldVal, newVal),
    //       },
    //     },
    //   };
    // },
    // handleDescriptionChange({ path, method, newVal }) {
    //   this.apiData = {
    //     ...this.apiData,
    //     paths: {
    //       ...this.apiData.paths,
    //       [path]: {
    //         ...this.apiData.paths[path],
    //         [method]: {
    //           ...this.apiData.paths[path][method],
    //           description: newVal,
    //         },
    //       },
    //     },
    //   };
    // },
    // handleSummaryChange({ path, method, newVal }) {
    //   this.apiData = {
    //     ...this.apiData,
    //     paths: {
    //       ...this.apiData.paths,
    //       [path]: {
    //         ...this.apiData.paths[path],
    //         [method]: {
    //           ...this.apiData.paths[path][method],
    //           summary: newVal,
    //         },
    //       },
    //     },
    //   };
    // },
  },
};
</script>

<style lang="scss" scoped>
.api-container {
  display: flex;
  flex-direction: row;
  flex: 1 0 0;
}
</style>