define(['chart/pieChart', 'chart/horizontalBarChart', 'chart/varticalBarChart', 'chart/lineChart'],
    function () {

      this.Sample = function Sample() {

      };

// pieChart,barChartサンプルデータ
      Sample.DATA = [{
        caption: "項目1",
        value: "",
        color: "#98abc5"
      }, {
        caption: "項目2",
        value: "",
        color: "#8a89a6"
      }, {
        caption: "項目3",
        value: "",
        color: "#7b6888"
      }, {
        caption: "項目4",
        value: "",
        color: "#6b486b"
      }, {
        caption: "項目5",
        value: "",
        color: "#a05d56"
      }];

// lineChartサンプルデータ(データ-１系統）
      Sample.LINE_DATA = {
        caption: ["", "1/25", "2/25", "3/25", "4/25"],
        stroke: [{
          width: 2,
          type: Chart.STROKE_TYPE_DOT,
          color: "#98abc5"
        }],
        value: [[10, 30, 40, 20, 30]]
      };

// lineChartサンプルデータ(データ-3系統）
      Sample.LINE_DATA_MULTI = {
        caption: ["", "1/25", "2/25", "3/25", "4/25"],
        stroke: [{
          width: 3,
          type: Chart.STROKE_TYPE_SOLID,
          color: "#98abc5"
        }, {
          width: 2,
          type: Chart.STROKE_TYPE_DOT,
          color: "#a05d56"
        }, {
          width: 4,
          type: Chart.STROKE_TYPE_DASH,
          color: "#8a89a6"
        }],
        value: [
          [10, 30, 40, 20, 30],
          [100, 20, 30, 50, 60],
          [100, 20, 30, 50, 60]
        ]
      };

// radaChartサンプルデータ
      Sample.RADAR_DATA = [
        {
          width: 2,
          type: Chart.STROKE_TYPE_DASH,
          color: "#a05d56",
          value: [2, 3, 2, 1, 4]
        },
        {
          width: 2,
          type: Chart.STROKE_TYPE_SOLID,
          color: "blue",
          value: [5, 4, 1, 2, 2]
        }
      ];
    });
