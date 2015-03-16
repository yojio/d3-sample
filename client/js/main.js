/**
 * Created by yoji on 15/03/09.
 */
define(
		[ 'bootstrap', 'underscore', 'backbone', 'd3' ],
		function(bootstrap, _, backbone, d3) {

			me = this;
			_current = new Array(10);
			_svg = new Array(10);
			_g = new Array(10);
			_pie = new Array(10);
			_arc = new Array(10);
			_svgWidth = 300; // SVG領域の横幅
			_svgHeight = 320;// SVG領域の縦幅

			var list1 = [ [ "項目1", "10", "#98abc5" ],
					[ "項目2", "30", "#8a89a6" ], [ "項目3", "20", "#7b6888" ],
					[ "項目4", "60", "#6b486b" ], [ "項目5", "15", "#a05d56" ] ];

			var list2 = [ [ "項目1", "30", "#98abc5" ],
					[ "項目2", "2", "#8a89a6" ], [ "項目3", "30", "#7b6888" ],
					[ "項目4", "20", "#6b486b" ], [ "項目5", "20", "#a05d56" ] ];

			// tab-change
			$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
				var activated_tab = e.target; // activated tab
				var previous_tab = e.relatedTarget; // previous tab
				if (activated_tab.hash == "#menu2") {
					createPieChart(list1)
				}
			});

			$("#data1").on("click", function() {
				refreshPieChart(list1)
			});

			$("#data2").on("click", function() {
				refreshPieChart(list2)
			});

			function createPieChart(data) {
				// 処理,,,,,
				for (var i = 0; i < 10; i++) {
					addPieChart(i, d3, data);
				}
			}

			function refreshPieChart(data) {
				// 処理,,,,,
				for (var i = 0; i < 10; i++) {
					arcAnime(i, d3, data, '円グラフサンプル' + (i + 1));
				}
			}

			function addPieChart(index, d3, list) {
				i = index + 1;
				item = "chart" + i;
				$("#result").append(
						'<div id=\"' + item + '\" style=\"float:left\"></div>');
				makePieChart(index, d3, '#' + item, list, '円グラフサンプル' + i);
			}

			function makePieChart(index, d3, base, list, title) {
				// http://d3pie.org/ d3pieが使えそう

				radius = Math.min(me._svgWidth, me._svgHeight) / 2;

				// 円グラフのサイズを指定
				var arc = d3.svg.arc().innerRadius(radius / 4).outerRadius(
						radius - 10);
				me._arc[index] = arc;

				// 円グラフを生成
				var pie = d3.layout.pie().sort(null).value(function(d) {
					return d[1];
				});
				me._pie[index] = pie;

				// 領域のリセット
				$(base).empty();

				// 色の用意
				var color = d3.scale.category20();

				// SVGの表示領域を生成
				var svg = d3.select(base).append("svg").attr("width", me._svgWidth)
						.attr("height", me._svgHeight);

				me._svg[index] = svg;

				// タイトル描画
				if (title) {
					svg.append("text").attr("x", (me._svgWidth / 2)).attr("y", 20)
							.attr("text-anchor", "middle").style("font-size",
									"16px")
							// .style("text-decoration", "underline")
							.text(title);
				}
				;

				// 円グラフを描画
				var g = svg.selectAll("path").data(pie(list)).enter().append("g");
				me._g[index] = g;

				g.append("path") // 円弧はパスで指定する
				.attr("d", arc) // 円弧を設定
				.attr("stroke", "white") // 円グラフの区切り線を白色にする
				.attr(
						"transform",
						"translate(" + me._svgWidth / 2 + ", "
								+ ((me._svgHeight / 2) + 20) + ")") // 円グラフをSVG領域の中心にする
				.style("fill", function(d, i) {
					// return d.data[2];
					return color(i);
				})
				// 今の数値を保存します。
				.each(function(d, i) {
					me._current[i] = d;
				});

				// キャプション表示
				g.append("text").attr("transform", function(d) {
					return "translate(" + arc.centroid(d) + ")";
				}).attr("dx", me._svgWidth / 2).attr("dy", (me._svgHeight / 2) + 20)
						.style("text-anchor", "middle").text(function(d) {
							return d.data[0];
						});

				// アニメーション http://tukumemo.com/d3-pie-chart/

			}

			// clickイベントの関数を記述します。
			function arcAnime(index, d3, newdata,title) {

				var svg = me._svg[index];

				var g = me._g[index];

				var pie = me._pie[index];

				// 円グラフのサイズを指定
				var arc = me._arc[index];

				svg.selectAll("path")
				// 新しいデータを設定します。
				.data(pie(newdata))
				// トランジションを設定するとアニメーションさせることができます。
				.transition()
				// アニメーションの秒数を設定します。
				.duration(800)
				// アニメーションの間の数値を補完します。
				.attrTween("d", function(d,i) {
					var interpolate = d3.interpolate(me._current[i], d);
					me._current[i] = interpolate(0);
					return function(t) {
						return arc(interpolate(t));
					};
				});

				svg.selectAll("text").remove();

				svg.selectAll("text")
				// 新しいデータを設定します。
				.data(pie(newdata))
				// 文字を更新します。
//				.text(function(d, i) {
//					return d.data[0];
//				})
				// トランジションを設定。
				.transition()
				// アニメーションの秒数を設定。
				.duration(800)
				// アニメーションの間の数値を補完。
				.attrTween(
						"transform",
						function(d,i) {
							var interpolate = d3.interpolate(arc
									.centroid(me._current[index]), arc
									.centroid(d));
							me._current[i] = d;
							return function(t) {
								return "translate(" + interpolate(t) + ")";
							};
						});

				// タイトル描画
				if (title) {
					svg.append("text").attr("x", (me._svgWidth / 2)).attr("y", 20)
							.attr("text-anchor", "middle").style("font-size",
									"16px")
							// .style("text-decoration", "underline")
							.text(title);
				}
//				;
				// キャプション表示
				g.append("text").attr("transform", function(d) {
					return "translate(" + arc.centroid(d) + ")";
				}).attr("dx", me._svgWidth / 2).attr("dy", (me._svgHeight / 2) + 20)
						.style("text-anchor", "middle").text(function(d) {
							return d.data[0];
						});

			}
		});
