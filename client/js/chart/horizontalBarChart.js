define(
    ['chart/chart'], function () {
      this.HolizontalBarChart = function HolizontalBarChart(option) {
        Chart.call(this, option);
      };

      HolizontalBarChart.prototype = Object.create(Chart.prototype, {
        constructor: {
          value: PieChart,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    });
