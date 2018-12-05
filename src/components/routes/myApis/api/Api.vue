<template>
  <div class="api-container">
    <!-- <RollableWidget
      :title="widgets[0].title"
      :isRolled="widgets[0].isRolled"
      :onToggle="() => toggleRollableWidget(0)"
    >
      <template>
        <InputWithIcon
          :append="{ icon: 'search' }"
        />
        MY APIs content
      </template>
    </RollableWidget>

    <RollableWidget
      :title="widgets[1].title"
      :isRolled="widgets[1].isRolled"
      :onToggle="() => toggleRollableWidget(1)"
    >
      <template>
        My Proxies Content
      </template>
    </RollableWidget>

    <RollableWidget
      :title="widgets[2].title"
      :isRolled="widgets[2].isRolled"
      :onToggle="() => toggleRollableWidget(2)"
    >
      <template>
        Information Content
      </template>
    </RollableWidget>

    <RollableWidget
      :title="widgets[3].title"
      :isRolled="widgets[3].isRolled"
      :onToggle="() => toggleRollableWidget(3)"
    >
      <template>
        Components &amp; Limits Content
      </template>
    </RollableWidget>

    <RollableWidget
      :title="widgets[4].title"
      :isRolled="widgets[4].isRolled"
      :onToggle="() => toggleRollableWidget(4)"
    >
      <template>
        <Paths
          :paths="apiData.paths"
          :onMethodChange="handleMethodChange"
          :onDescriptionChange="handleDescriptionChange"
          :onSummaryChange="handleSummaryChange"
        />
      </template>
    </RollableWidget>

    <RollableWidget
      :title="widgets[5].title"
      :isRolled="widgets[5].isRolled"
      :onToggle="() => toggleRollableWidget(5)"
      unrolledWidth="1"
    >
      <template>
        Editor Content
      </template>
    </RollableWidget> -->
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
              :propNames="column.propNames"
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
import pet3 from '@/assets/pet3.json';

export default {
  components: {
    FinderLayout,
    FinderColumn,
    FinderColumnObject,
  },
  computed: {
    columns() {
      const getColumnData = (data) => {
        const dataType = (typeof data);

        if (dataType === 'object') {
          return {
            type: dataType,
            propNames: Object.keys(data),
          };
        }
        return {
          type: dataType,
          data,
        };
      };
      const getPropData = (obj, keysArr) =>
        keysArr.reduce((reducedObj, item) => reducedObj[item], obj);

      return this.path.map((item, index) => {
        const pathData = (
          index === 0 ?
          this.apiData :
          getPropData(this.apiData, this.path.slice(1, (index + 1)))
        );
        return getColumnData(pathData);
      });
    },
  },
  data() {
    return {
      apiData: pet3,
      path: [''],
      // widgets: [
      //   {
      //     isRolled: true,
      //     title: 'My APIs',
      //   },
      //   {
      //     isRolled: true,
      //     title: 'My Proxies',
      //   },
      //   {
      //     isRolled: true,
      //     title: 'Information',
      //   },
      //   {
      //     isRolled: true,
      //     title: 'Components & Limits',
      //   },
      //   {
      //     isRolled: false,
      //     title: 'Paths',
      //   },
      //   {
      //     isRolled: true,
      //     title: 'Editor',
      //   },
      // ],
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