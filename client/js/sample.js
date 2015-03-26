define([ 'chart/pieChart', 'chart/horizontalBarChart',
    'chart/varticalBarChart', 'chart/lineChart' ], function() {

  this.Sample = function Sample() {

  };

  // pieChartサンプルデータ
  // 東大理系ー配点(%)
  Sample.PIE_DATA = [ {
    caption : "英語",
    value : "26.3",
    color : "#98abc5"
  }, {
    caption : "数学",
    value : "26.3",
    color : "#8a89a6"
  }, {
    caption : "理科",
    value : "26.3",
    color : "#7b6888"
  }, {
    caption : "国語",
    value : "19.0",
    color : "#6b486b"
  }, {
    caption : "社会",
    value : "2.2",
    color : "#a05d56"
  } ];

  // BarChartサンプルデータ
  // 合格最低点人数分布(max:40 人)
  Sample.BAR_DATA = [ {
    caption : "+3",
    value : "10",
    color : "#98abc5"
  }, {
    caption : "+2",
    value : "6",
    color : "#8a89a6"
  }, {
    caption : "+1",
    value : "14",
    color : "#7b6888"
  }, {
    caption : "合格最低点",
    value : "17",
    color : "#6b486b"
  }, {
    caption : "-1",
    value : "12",
    color : "#a05d56"
  }, {
    caption : "-2",
    value : "11",
    color : "#a05d56"
  }, {
    caption : "-3",
    value : "9",
    color : "#a05d56"
  } ];

  // lineChartサンプルデータ(データ-１系統）
  Sample.LINE_DATA = {
    caption : [ "", "1/25", "2/25", "3/25", "4/25" ],
    stroke : [ {
      width : 2,
      type : Chart.STROKE_TYPE_DOT,
      color : "#98abc5"
    } ],
    value : [ [ 10, 30, 40, 20, 30 ] ]
  };

  // lineChartサンプルデータ(データ-3系統）
  Sample.LINE_DATA_MULTI = {
    caption : [ "", "1/25", "2/25", "3/25", "4/25" ],
    stroke : [ {
      width : 3,
      type : Chart.STROKE_TYPE_SOLID,
      color : "#98abc5"
    }, {
      width : 2,
      type : Chart.STROKE_TYPE_DOT,
      color : "#a05d56"
    }, {
      width : 4,
      type : Chart.STROKE_TYPE_DASH,
      color : "#8a89a6"
    } ],
    value : [ [ 10, 30, 40, 20, 30 ], [ 100, 20, 30, 50, 60 ],
        [ 100, 20, 30, 50, 60 ] ]
  };

  // radaChartサンプルデータ
  Sample.RADAR_DATA = [ {
    width : 2,
    type : Chart.STROKE_TYPE_DASH,
    color : "#a05d56",
    value : [ 2, 3, 2, 1, 4 ]
  }, {
    width : 2,
    type : Chart.STROKE_TYPE_SOLID,
    color : "blue",
    value : [ 5, 4, 1, 2, 2 ]
  } ];

  // ツリーサンプルデータ
  Sample.TREE_DATA = {
    "name" : "なんたら資格",
    "children" : [ {
      "name" : "なんたら試験A",
      "children" : [ {
        "name" : "なんたら試験A-1",
        "color": "red",
        "strokewidth":2,
        "strokeDasharray":"0",
        "children" : [ {
          "name" : "A-1 詳細１",
          "size" : 3938,
          "color": "red",
          "strokewidth":2,
          "strokeDasharray":"0"
        }, {
          "name" : "A-1 詳細２",
          "size" : 3812,
          "color": "red",
          "strokewidth":2,
          "strokeDasharray":"0"
        }, {
          "name" : "A-1 詳細３",
          "size" : 6714,
          "color": "red",
          "strokewidth":2,
          "strokeDasharray":"0"
        }, {
          "name" : "A-1 詳細４",
          "size" : 743,
          "color": "red",
          "strokewidth":2,
          "strokeDasharray":"0"
        } ]
      }, {
        "name" : "なんたら試験A-2",
        "children" : [ {
          "name" : "A-2 詳細１",
          "size" : 3534
        }, {
          "name" : "A-2 詳細２",
          "size" : 5731
        }, {
          "name" : "A-2 詳細３",
          "size" : 7840
        }, {
          "name" : "A-2 詳細４",
          "size" : 5914,
          "color": "red",
          "strokewidth":2,
          "strokeDasharray":"0"
        }, {
          "name" : "A-2 詳細５",
          "size" : 3416,
          "color": "red",
          "strokewidth":2,
          "strokeDasharray":"0"
        } ]
      } ]
    }, {
      "name" : "なんたら試験B",
      "children" : [ {
        "name" : "B 詳細１",
        "size" : 8833
      }, {
        "name" : "B 詳細２",
        "size" : 1732
      }, {
        "name" : "B 詳細３",
        "size" : 3623
      }, {
        "name" : "B 詳細４",
        "size" : 10066
      } ]
    }, {
      "name" : "なんたら試験C",
      "children" : [ {
        "name" : "C 詳細１",
        "size" : 1082
      }, {
        "name" : "C 詳細２",
        "size" : 1336
      }, {
        "name" : "C 詳細３",
        "size" : 9983
      }, {
        "name" : "C 詳細４",
        "size" : 2213
      }, {
        "name" : "C 詳細５",
        "size" : 1681
      } ]
    } ]
  };

  // ツリーサンプルデータ
  Sample.MAP_DATA = {
    "name" : "なんたら資格",
    "children" : [ {
      "name" : "なんたら試験A",
      "children" : [ {
        "name" : "なんたら試験A-1",
        "color" : "#98abc5",
        "children" : [ {
          "name" : "A-1 詳細１",
          "size" : 3938
        }, {
          "name" : "A-1 詳細２",
          "size" : 3812
        }, {
          "name" : "A-1 詳細３",
          "size" : 6714
        }, {
          "name" : "A-1 詳細４",
          "size" : 743
        } ]
      }, {
        "name" : "なんたら試験A-2",
        "color" : "#336600",
        "children" : [ {
          "name" : "A-2 詳細１",
          "size" : 3534
        }, {
          "name" : "A-2 詳細２",
          "size" : 5731
        }, {
          "name" : "A-2 詳細３",
          "size" : 7840
        }, {
          "name" : "A-2 詳細４",
          "size" : 5914
        }, {
          "name" : "A-2 詳細５",
          "size" : 3416
        } ]
      } ]
    }, {
      "name" : "なんたら試験B",
      "color" : "#CC0033",
      "children" : [ {
        "name" : "B 詳細１",
        "size" : 8833
      }, {
        "name" : "B 詳細２",
        "size" : 1732
      }, {
        "name" : "B 詳細３",
        "size" : 3623
      }, {
        "name" : "B 詳細４",
        "size" : 10066
      } ]
    }, {
      "name" : "なんたら試験C",
      "color" : "#6600FF",
      "children" : [ {
        "name" : "C 詳細１",
        "size" : 1082
      }, {
        "name" : "C 詳細２",
        "size" : 1336
      }, {
        "name" : "C 詳細３",
        "size" : 9983
      }, {
        "name" : "C 詳細４",
        "size" : 2213
      }, {
        "name" : "C 詳細５",
        "size" : 1681
      } ]
    } ]
  };

  Sample.TEST = {
    "name" : "root",
    "children" : [ {
      "name" : "aaa",
      "children" : [ {
        "name" : "bbb",
        "size" : 8833
      }, {
        "name" : "ccc",
        "size" : 8833
      } ]
    }, {
      "name" : "ddd",
      "children" : [ {
        "name" : "eee",
        "size" : 8833
      }, {
        "name" : "fff",
        "size" : 8833
      } ]
    } ]
  }
});
