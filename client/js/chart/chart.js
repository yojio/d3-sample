/**
 * Created by yoji on 15/03/09.
 */

// TODO データ選択イベント（円グラフで領域を浮かび上がらせる。
// TODO データ選択でツールチップ
// TODO 棒グラフと折れ線グラフのミックス
// TODO 軸のラベル（単位等）
// TODO radarChartの内部領域を半透明描画（マウスオーバーなどで）
// TODO radarChartで外周円を描画する。

// Chart基底クラス
define(['jquery', 'd3'], function () {
  this.Chart = function Chart(option) {

    var DEF_OPT = {
      dom: "", // 表示用DIV
      width: 100, // サイズ横
      height: 100, // サイズ縦
      // タイトル情報
      title: {
        caption: "",
        height: 20,
        fontSize: 16,
        margin: 10,
        decoration : "underline"
      }
    };

    this.opt = $.extend(true, {}, DEF_OPT, option);
    validate(this.opt);
    this.created = false;

    function validate(opt) {
      if ((!opt.dom) || (opt.dom.trim().length == 0)) {
        throw new Error("dom undefined error");
      }

      if (!$(opt.dom).hasClass()) {
        $(opt.dom).addClass("chart-class");
      }

    }

  };

// 定数
// 線種
  Chart.STROKE_TYPE_SOLID = "";
  Chart.STROKE_TYPE_DASH = "10 4";
  Chart.STROKE_TYPE_DOT = "4 4";

// 描画
  Chart.prototype.draw = function (data) {
    if (!this.created) {
      this._create(data);
      this.created = true;
    } else {
      this._redraw(data);
    }
  };

// 作成
  Chart.prototype._create = function (data) {
    throw new Error(this.constructor.name
    + " Create function is not implemented yet.");
  };

// 再描画
  Chart.prototype._redraw = function (data) {
    throw new Error(this.constructor.name
    + " Redraw function is not implemented yet.");
  };

// タイトル描画(返り値ータイトル高さ）
  Chart.prototype._drawTitle = function (svg, opt, left) {

    if (!opt.title.caption) {
      return 0;
    }

    if (!left) {
      left = opt.width / 2;
    }

    svg.append("text")
        .attr("class", "title")
        .attr("type", "caption")
        .attr("x", left)
        .attr("y", opt.title.height)
        .attr("text-anchor", "middle")
        .style("font-size", opt.title.fontSize + "px")
        .style("text-decoration", opt.title.decoration).text(opt.title.caption);

    return opt.title.height + opt.title.margin;
  };

});


