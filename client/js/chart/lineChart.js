define(
    ['chart/chart'], function () {
      this.LineChart = function LineChart(option) {
        Chart.call(this, option);
      }

      LineChart.prototype = Object.create(Chart.prototype, {
        constructor: {
          value: PieChart,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    });
