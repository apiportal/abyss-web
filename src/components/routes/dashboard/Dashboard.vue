<template>
  <div class="dashboard-container">
    <div class="container-fluid" style="margin-top: 1em; margin-bottom: 1em;">
      <div class="row">
        <div class="col-12 col-md-4">
          <Widget title="widget 1 - line chart">
            <main>
              <div>
                <LineChart
                  :series="chartData.series"
                />
              </div>
            </main>
          </Widget>
        </div>
        <div class="col-12 col-md-4">
          <Widget title="widget 2 - column cart">
            <main>
              <div>
                <ColumnChart
                  :series="chartData.series"
                />
              </div>
            </main>
          </Widget>
        </div>
        <div class="col-12 col-md-4">
          <Widget title="widget 3 - bar chart">
            <main>
              <div>
                <BarChart
                  :series="chartData.series"
                />
              </div>
            </main>
          </Widget>
        </div>
        <div class="col-12 col-md-4">
          <Widget title="widget 4 - inform modal">
            <template slot-props="{ toggleInformModal }">
                <b-button variant="primary" @click="toggleInformModal">
                  Show Inform Modal
                </b-button>
                <InformModal
                  v-if="isInformModalVisible"  
                  :onClose="toggleInformModal"
                >
                  <div>
                    This is an inform modal
                  </div>
                  <div slot="footer" slot-props="{ toggleInformModal }">
                    <b-button class="float-right" variant="primary" size="sm" @click="toggleInformModal">
                      OK
                    </b-button>
                  </div>
                </InformModal>
            </template>
          </Widget>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Widget from '@/components/shared/Widget';
import LineChart from '@/components/shared/charts/LineChart';
import BarChart from '@/components/shared/charts/BarChart';
import ColumnChart from '@/components/shared/charts/ColumnChart';
import InformModal from '@/components/shared/modals/InformModal';
import api from '@/api';

export default {
  components: {
    Widget,
    LineChart,
    BarChart,
    ColumnChart,
    InformModal,
  },
  data() {
    return {
      chartData: {
        series: [
          {
            name: 'Installation',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
          },
        ],
      },
      isInformModalVisible: false,
      foo: {},
    };
  },
  methods: {
    toggleInformModal() {
      this.isInformModalVisible = !this.isInformModalVisible;
    },
    getDashboarData() {
      return api.getDashboardData();
    },
  },
  mounted() {
    this.getDashboarData();
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  flex: 1 0 0;
  overflow-y: auto;

  .col-md-4 {
    margin-bottom: 1em;
  }
}
</style>
