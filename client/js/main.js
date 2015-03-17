/**
 * Created by yoji on 15/03/09.
 */
define([ 'bootstrap', 'underscore', 'backbone', 'd3', 'chart' ],
    function(bootstrap, _, backbone, d3) {

      var list1 = [ [ "項目1", "10", "#98abc5" ], [ "項目2", "30", "#8a89a6" ],
          [ "項目3", "20", "#7b6888" ], [ "項目4", "60", "#6b486b" ],
          [ "項目5", "15", "#a05d56" ] ];

      var list2 = [ [ "項目1", "30", "#98abc5" ], [ "項目2", "2", "#8a89a6" ],
          [ "項目3", "30", "#7b6888" ], [ "項目4", "20", "#6b486b" ],
          [ "項目5", "20", "#a05d56" ] ];

      var me = this;
      me.chartArray = new Array(10);
      for (var i = 0; i < me.chartArray.length; i++) {
        index = i + 1;
        item = "chart" + i;

        $("#result").append('<div id=\"' + item + '\" style=\"float:left\"></div>');

        me.chartArray[i] = createChartObject("#" + item, "サンプルチャート" + index);
      }

      // tab-change
      $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var activated_tab = e.target; // activated tab
        var previous_tab = e.relatedTarget; // previous tab
        if (activated_tab.hash == "#menu2") {
          drawChart(list1);
        }
      });

      $("#data1").on("click", function() {
        drawChart(list1);
      });

      $("#data2").on("click", function() {
        drawChart(list2);
      });

      function createChartObject(dom, caption) {

        return new PieChart({
          dom : dom,
          title : {
            caption : caption
          },
          width : 200,
          height : 200
        });

      }

      function drawChart(data) {
        // 処理,,,,,
        for (var i = 0; i < me.chartArray.length; i++) {
          me.chartArray[i].draw(data);
        }
      }

    });
