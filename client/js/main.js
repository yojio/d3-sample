/**
 * Created by yoji on 15/03/09.
 */
define(['bootstrap', 'underscore', 'backbone', 'd3'],
    function (bootstrap, _, backbone, d3) {

        var list =
            [
                ["項目1", "10", "#98abc5"],
                ["項目2", "30", "#8a89a6"],
                ["項目3", "20", "#7b6888"],
                ["項目4", "60", "#6b486b"],
                ["項目5", "15", "#a05d56"]
            ];

        // tab-change
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var activated_tab = e.target; // activated tab
            var previous_tab = e.relatedTarget; // previous tab

            // 処理,,,,,
            if (activated_tab.hash == "#menu2") {
                makePieChart(d3, '#result', list);
            }
        });

    });

function makePieChart(d3, base, list) {

    var svgWidth = 960; // SVG領域の横幅
    var svgHeight = 500;// SVG領域の縦幅
    radius = Math.min(svgWidth, svgHeight) / 2;

    // 円グラフのサイズを指定
    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(radius - 10);

    // 円グラフを生成
    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d[1];
        });

    // 領域のリセット
    $(base).empty();

    // 色の用意
    var color = d3.scale.category10();

    // SVGの表示領域を生成
    var svg = d3.select(base).append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // 円グラフを描画
    var g = svg.selectAll("path")
        .data(pie(list))
        .enter()
        .append("g");

    g.append("path") // 円弧はパスで指定する
        .attr("d", arc) // 円弧を設定
        .attr("stroke", "white")    // 円グラフの区切り線を白色にする
        .attr("transform", "translate(" + svgWidth / 2 + ", " + svgHeight / 2 + ")") // 円グラフをSVG領域の中心にする
        .style("fill", function (d, i) {
            //return d.data[2];
            return color(i);
        });

    // キャプション表示
    g.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dx", svgWidth / 2)
        .attr("dy", svgHeight / 2)
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data[0];
        });

    // アニメーション http://tukumemo.com/d3-pie-chart/

};