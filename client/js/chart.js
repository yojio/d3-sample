/**
 * Created by yoji on 15/03/09.
 */
var DEF_OPT = {
  dom : "" // 表示用DIV
  ,width : 100 // サイズ横
  ,height : 100 // サイズ縦
  ,title : { // タイトル情報
    caption : ""
    ,height : 20
    ,fontSize : 16
    ,sorted : false
  }
};

// Chartクラス定義
function Chart(option) {
  this.opt = $.extend(true, {}, DEF_OPT, option);
  this.created = false;
};

// 描画
Chart.prototype.draw = function(data) {
  if (!this.created) {
    this._create(data);
    this.created = true;
  } else {
    this._redraw(data);
  }
};

// 作成
Chart.prototype._create = function(data) {
  throw new Error("Unimplemented");
};

// 再描画
Chart.prototype._redraw = function(data) {
  throw new Error("Unimplemented");
};

// 円グラフ
function PieChart(option) {

  Chart.call(this, option);

};

PieChart.prototype = Object.create(Chart.prototype, {
  constructor : {
    value : PieChart,
    enumerable : false,
    writable : true,
    configurable : true
  },
  // グラフ作成
  _create : {
    value : function(data) {

      var me = this;

      me.flg = 0;
      me.current = new Array(data.length);

      // 半径算出
      var radius = Math.min(me.opt.width, me.opt.height) / 2;

      // 円グラフのサイズを指定
      var arc = d3.svg.arc().innerRadius(radius / 4).outerRadius(radius - 10);

      // 円グラフを生成
      comparator = null;
      if (me.opt.sorted){
        comparator =  function(a, b) {
          return d3.descending(a[0], b[0]);
        }
      }
      var pie = d3.layout.pie().sort(comparator).value(function(d) {
        return d[1];
      });

      // 領域のリセット
      $(me.dom).empty();


      // 色の用意
      // var color = d3.scale.category20();
      // SVGの表示領域を生成
      var height = (me.opt.title.caption) ? height = me.opt.height
          + me.opt.title.height : me.opt.height;

      // 規定オブジェクト生成
      var svg = d3.select(me.opt.dom).append("svg").attr("width", me.opt.width).attr("height", height);

      // タイトル描画
      if (me.opt.title.caption) {
        svg.append("text").attr("class", "title").attr("type", "caption").attr(
            "x", (me.opt.width / 2)).attr("y", me.opt.title.height).attr(
            "text-anchor", "middle").style("font-size",
            me.opt.title.fontSize + "px").style("text-decoration", "underline")
            .text(me.opt.title.caption);
      }

      // 円グラフを描画
      var g = svg.selectAll("path").data(pie(data)).enter().append("g");

      g.on("mouseover", function(d) {
        if (tooltip.style.visibility == "visible") {
            return;
        }
        tooltip.style.visibility = "visible";
        me.flg += 1;

        if (me.flg > 1){
          return;
        }

        $("#tooltip").fadeIn("slow",function(){me.flg = false});

      }).on("mousemove", function(d) {

        if ((!d) || (!d.data[0])){
          return
        }
        tooltip.textContent = d.data[0];
        tooltip.style.top = (event.pageY - 20) + "px";
        tooltip.style.left = (event.pageX - 10) + "px";

      }).on("mouseout", function(d) {
        if (me.flg > 1){
          return;
        }
        $("#tooltip").fadeOut("slow",function(){
          me.flg -= 1;
          tooltip.style.visibility = "hidden";
        });
      });

      g.append("path") // 円弧はパスで指定する
      .attr("d", arc) // 円弧を設定
      .attr("stroke", "white") // 円グラフの区切り線を白色にする
      .attr("transform",
          "translate(" + me.opt.width / 2 + ", " + ((height / 2) + 20) + ")") // 円グラフをSVG領域の中心にする
      .style("fill", function(d, i) {
        return d.data[2];
        // return color(i);
      })
      // 今の数値を保存します。
      .each(function(d, i) {
        me.current[i] = d;
      });

      // データキャプション表示
      g.append("text").attr("class", "dataCaption").attr("transform",
          function(d) {
            return "translate(" + arc.centroid(d) + ")";
          }).attr("dx", me.opt.width / 2).attr("dy", (height / 2) + 20).style(
          "text-anchor", "middle").text(function(d) {
        return d.data[0];
      });

      me.svg = svg;
      me.arc = arc;
      me.pie = pie;

    }
  },
  _redraw : {
    value : function(data) {

      var me = this;

      var svg = me.svg;
      var pie = me.pie;
      var arc = me.arc;

      // path
      svg.selectAll("path").data(pie(data)).transition() // トランジションを設定するとアニメーションさせることができます。
      .duration(800) // アニメーションの秒数を設定します。
      .attrTween("d", function(d, i) { // アニメーションの間の数値を補完します。
        var interpolate = d3.interpolate(me.current[i], d);
        me.current[i] = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      });

      // キャプション
      svg.selectAll(".dataCaption").data(pie(data)) // 新しいデータを設定します。
      .text(function(d, i) { // 文字を更新します。
        return d.data[0];
      }).transition() // トランジションを設定。
      .duration(800) // アニメーションの秒数を設定。
      .attrTween(
          // アニメーションの間の数値を補完。
          "transform",
          function(d, i) {
            var interpolate = d3.interpolate(arc.centroid(me.current[i]), arc
                .centroid(d));
            me.current[i] = d;
            return function(t) {
              return "translate(" + interpolate(t) + ")";
            };
          });
    }
  }
});
