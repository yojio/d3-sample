/**
 * PieChart
 */
define(['chart/chart'], function () {
  this.PieChart = function PieChart(option) {
    Chart.call(this, option);
  };

  PieChart.prototype = Object.create(Chart.prototype, {
    constructor: {
      value: PieChart,
      enumerable: false,
      writable: true,
      configurable: true
    },
    // グラフ作成
    _create: {
      value: function (data) {

        var me = this;
        me.current = new Array(data.length);

        // 領域のリセット
        $(me.opt.dom).empty();

        // 規定オブジェクト生成
        var svg = d3.select(me.opt.dom).append("svg").attr("width", me.opt.width).attr("height", me.opt.height);

        var top = me._drawTitle(svg, me.opt);
        var left = 0;
        var width = me.opt.width - 7;
        var height = this._getHeight(me.opt) - 7;

        // 半径算出
        var radius = Math.min(width, height - top) / 2;

        // 円グラフのサイズを指定
        var arc = d3.svg.arc()
            .innerRadius(radius * me.opt.pie.innerRadiusRate) // 内径
            .outerRadius(radius); // 外径

        // 円グラフを生成
        var comparator = null;
        if (me.opt.sorted) {
          comparator = function (d1, d2) {
            return d3.descending(d1.value, d2.value);
          }
        }
        // レイアウト定義
        var pie = d3.layout.pie()
            .sort(comparator)
            .value(function (d) {
              return d.value;
            });

        // 円グラフを描画
        var circle = svg.selectAll("path")
            .data(pie(data))
            .enter()
            .append("g");

        circle.append("path") // 円弧はパスで指定する
            .attr("d", arc) // 円弧を設定
            .attr("stroke", me.opt.pie.frameColor) // 円グラフの区切り線色
            .attr("transform","translate(" + width / 2 + ", " + ((height / 2) + top) + ")") // 円グラフをSVG領域の中心にする
            .style("fill", function (d, i) {
              return d.data.color;
            })
            // 今の数値を保存します。
            .each(function (d, i) {
              me.current[i] = d;
            }).on("mouseover", function (d) {
            }).on("mousemove", function (d) {
            }).on("mouseout", function (d) {
            });

        // データキャプション表示
        circle.append("text")
            .attr("class", "dataCaption")
            .attr("transform",function (d) {
              return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dx", width / 2)
            .attr("dy", ((height / 2) + top))
            .style("text-anchor", "middle")
            .text(function (d) {
              return d.data.caption;
            });


        me.svg = svg;
        me.arc = arc;
        me.pie = pie;

      }
    },
    _redraw: {
      value: function (data) {

        var me = this;

        var svg = me.svg;
        var pie = me.pie;
        var arc = me.arc;

        // path
        svg.selectAll("path").data(pie(data))
            .transition() // トランジションを設定するとアニメーションさせることができます。
            .duration(800) // アニメーションの秒数を設定します。
            .attrTween("d", function (d, i) { // アニメーションの間の数値を補完します。
              var interpolate = d3.interpolate(me.current[i], d);
              me.current[i] = interpolate(0);
              return function (t) {
                return arc(interpolate(t));
              };
            });

        // キャプション
        svg.selectAll(".dataCaption").data(pie(data))
            .text(function (d, i) {
              return d.data.caption;
            })
            .transition() // トランジションを設定。
            .duration(800) // アニメーションの秒数を設定。
            .attrTween("transform",function (d, i) {
              var interpolate = d3.interpolate(arc.centroid(me.current[i]), arc.centroid(d));
              me.current[i] = d;
              return function (t) {
                return "translate(" + interpolate(t) + ")";
              };
            });
      }
    }
  });

  return PieChart;

});
