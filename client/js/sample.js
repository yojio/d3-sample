define(['chart/pieChart', 'chart/horizontalBarChart', 'chart/varticalBarChart', 'chart/lineChart'],
    function () {

      this.Sample = function Sample() {

      };

// pieChartサンプルデータ
      // 東大理系ー配点(%)
      Sample.PIE_DATA = [{
        caption: "英語",
        value: "26.3",
        color: "#98abc5"
      }, {
        caption: "数学",
        value: "26.3",
        color: "#8a89a6"
      }, {
        caption: "理科",
        value: "26.3",
        color: "#7b6888"
      }, {
        caption: "国語",
        value: "19.0",
        color: "#6b486b"
      }, {
        caption: "社会",
        value: "2.2",
        color: "#a05d56"
      }];

      // BarChartサンプルデータ
      // 合格最低点人数分布(max:40 人)
      Sample.BAR_DATA = [{
        caption: "+3",
        value: "10",
        color: "#98abc5"
      }, {
        caption: "+2",
        value: "6",
        color: "#8a89a6"
      }, {
        caption: "+1",
        value: "14",
        color: "#7b6888"
      }, {
        caption: "合格最低点",
        value: "17",
        color: "#6b486b"
      }, {
        caption: "-1",
        value: "12",
        color: "#a05d56"
      }, {
        caption: "-2",
        value: "11",
        color: "#a05d56"
      }, {
        caption: "-3",
        value: "9",
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

// ツリーサンプルデータ
Sample.TREE_DATA = {
  "name": "flare",
  "children": [
   {
    "name": "analytics",
    "children": [
     {
      "name": "cluster",
      "children": [
       {"name": "AgglomerativeCluster", "size": 3938},
       {"name": "CommunityStructure", "size": 3812},
       {"name": "HierarchicalCluster", "size": 6714},
       {"name": "MergeEdge", "size": 743}
      ]
     },
     {
      "name": "graph",
      "children": [
       {"name": "BetweennessCentrality", "size": 3534},
       {"name": "LinkDistance", "size": 5731},
       {"name": "MaxFlowMinCut", "size": 7840},
       {"name": "ShortestPaths", "size": 5914},
       {"name": "SpanningTree", "size": 3416}
      ]
     }
    ]
   },
   {
    "name": "display",
    "children": [
     {"name": "DirtySprite", "size": 8833},
     {"name": "LineSprite", "size": 1732},
     {"name": "RectSprite", "size": 3623},
     {"name": "TextSprite", "size": 10066}
    ]
   },
   {
    "name": "physics",
    "children": [
     {"name": "DragForce", "size": 1082},
     {"name": "GravityForce", "size": 1336},
     {"name": "IForce", "size": 319},
     {"name": "NBodyForce", "size": 10498},
     {"name": "Particle", "size": 2822},
     {"name": "Simulation", "size": 9983},
     {"name": "Spring", "size": 2213},
     {"name": "SpringForce", "size": 1681}
    ]
   }
  ]
 };
});
