<template>
  <div></div>
</template>

<script>
import Highcharts from 'highcharts';

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    xAxis: {
      type: Object,
      required: true,
    },
    yAxis: {
      type: Array,
      required: true,
    },
    tooltip: {
      type: Object,
      required: true,
    },
    title: {
      type: Object,
      required: true,
    },
  },
  watch: {
    series() {
      this.drawChart();
    },
  },
  data() {
    return {
      target: undefined,
    };
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      this.target = Highcharts.chart(this.$el, {
        chart: {
          type: this.type,
        },
        xAxis: {
          ...this.xAxis,
        },
        yAxis: [
          ...this.yAxis,
        ],
        tooltip: {
          ...this.tooltip,
        },
        legend: {
          ...this.legend,
        },
        series: [
          ...this.series,
        ],
        title: {
          ...this.title,
        },
        credits: {
          enabled: false,
        },
      });
    },
  },
  beforeDestroy() {
    if (this.target) {
      this.target.destroy();
    }
  },
};
</script>