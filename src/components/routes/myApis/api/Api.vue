<template>
  <div class="api-container">
    <RollableWidget
      :title="widgets[0].title"
      :isRolled="widgets[0].isRolled"
      :onToggle="() => toggleRollableWidget(0)"
    >
      <template>
        <InputWithIcon
          :append="{ icon: 'search' }"
        />
        rollable widget 1 content
      </template>
    </RollableWidget>

    <RollableWidget
      :title="widgets[1].title"
      :isRolled="widgets[1].isRolled"
      :onToggle="() => toggleRollableWidget(1)"
    >
      <template>
        rollable widget 2 content
      </template>
    </RollableWidget>

    <RollableWidget
      :title="widgets[2].title"
      :isRolled="widgets[2].isRolled"
      :onToggle="() => toggleRollableWidget(2)"
    >
      <template>
        rollable widget 3 content
      </template>
    </RollableWidget>

    <RollableWidget
      :title="widgets[3].title"
      :isRolled="widgets[3].isRolled"
      :onToggle="() => toggleRollableWidget(3)"
    >
      <template>
        rollable widget 4 content
      </template>
    </RollableWidget>

    <RollableWidget
      :title="widgets[4].title"
      :isRolled="widgets[4].isRolled"
      :onToggle="() => toggleRollableWidget(4)"
    >
      <template>
        <Paths
          :paths="petData.paths"
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
        rollable widget 6 content
      </template>
    </RollableWidget>


  </div>
</template>

<script>
// import api from '@/api';
import RollableWidget from '@/components/shared/widgets/RollableWidget';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Paths from '@/components/shared/Paths';
import pet3 from '@/assets/pet3.json';

export default {
  components: {
    RollableWidget,
    InputWithIcon,
    Paths,
  },
  data() {
    return {
      petData: pet3,
      widgets: [
        {
          isRolled: true,
          title: 'My APIs',
        },
        {
          isRolled: true,
          title: 'My Proxies',
        },
        {
          isRolled: true,
          title: 'Information',
        },
        {
          isRolled: true,
          title: 'Components & Limits',
        },
        {
          isRolled: false,
          title: 'Paths',
        },
        {
          isRolled: true,
          title: 'Editor',
        },
      ],
    };
  },
  mounted() {
  },
  methods: {
    toggleRollableWidget(index) {
      this.widgets[index].isRolled = !this.widgets[index].isRolled;
    },

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