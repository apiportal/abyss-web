<template>
  <Chart
    type="line"
    :series="series"
    :categories="categories"
    :xAxis="xAxis"
    :yAxis="yAxis"
    :tooltip="tooltip"
    :title="title"
  />
</template>

<script>
import Chart from '@/components/shared/charts/Chart';

export default {
  components: {
    Chart,
  },
  props: {
    series: {
      type: Array,
      required: false,
      default() { return []; },
    },
    categories: {
      type: Array,
      required: false,
      default() { return []; },
    },
    xAxis: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    yAxis: {
      type: Array,
      required: false,
      default() {
        return [
          {
            title: {
              enabled: false,
            },
          },
        ];
      },
    },
    tooltip: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    title: {
      type: Object,
      required: false,
      default() { return { text: '' }; },
    },
  },
};
</script>