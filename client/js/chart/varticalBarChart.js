define(
    ['chart/chart'], function () {
      this.VarticalBarChart = function VarticalBarChart(option) {
        Chart.call(this, option);
      }

      VarticalBarChart.prototype = Object.create(Chart.prototype, {
        constructor: {
          value: PieChart,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    });
