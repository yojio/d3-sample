define(
    ['chart/chart'], function () {
      this.PieChart = function PieChart(option) {
        Chart.call(this, option);
      }

      PieChart.prototype = Object.create(Chart.prototype, {
        constructor: {
          value: PieChart,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    });
