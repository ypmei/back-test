import { widget as TradingViewWidget } from "$utils/charting_library.min";
import Datafeeds from '$utils/datafeeds_exchange';
import { setKlineShapeCallback } from '$utils/socket_wcs';

// 研究线
const mas = [
  // {
  //   day: 30,
  //   color: '#c900d4',
  //   linewidth: 2,
  // },
  {
    day: 9,
    color: '#ff0037',
    linewidth: 2,
  },
  {
    day: 26,
    color: '#00ab5f',
    linewidth: 2,
  },
  {
    day: 60,
    color: '#0e5aff',
    linewidth: 2,
  },
];

function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function initTradingView(){
		let SYMBOL = 'BTC/USDT';
		let widget = window.tvWidget = new TradingViewWidget({
				// debug: true, // uncomment this line to see Library errors and warnings in the console
				// autosize: true,
				// fullscreen: true,
				width: '100%',
				// height: 600,
				symbol: SYMBOL,
				interval: '5m',
				container_id: "tv_chart_container",
				// studies: [
				//     "MACD@tv-basicstudies"
				// ],
				//	BEWARE: no trailing slash is expected in feed URL
				// datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
				datafeed: new Datafeeds.UDFCompatibleDatafeedExchange({
						data_status: 'streaming',
						max_bars: 10080,
						description: SYMBOL,
						exchange: '量化交易',
						'exchange-listed': '1',
						'exchange-traded': '1',
						force_session_rebuild: false,
						full_name: SYMBOL,
						has_daily: true,
						has_empty_bars: false,
						has_intraday: true,
						has_weekly_and_monthly: true,
						minmov: 1,
						minmove2: 0,
						name: SYMBOL,
						pricescale: 10,
						session: '24x7',
						volume_precision: 8,
						timezone: 'Asia/Shanghai',
						supports_marks: true,
						supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', 'D', '3D', 'W'],
						symbol: SYMBOL,
						ticker: SYMBOL,
						type: 'bitcoin',
						pairCode: SYMBOL,
				}),
				// library_path: "/quant/charting_library/",
				library_path: "/charting_library/",
				locale: getParameterByName('lang') || "zh",
				disabled_features: ["use_localstorage_for_settings", "volume_force_overlay", "dont_show_boolean_study_arguments"],
				enabled_features: ["study_templates"],
				// charts_storage_url: 'http://saveload.tradingview.com',
				// charts_storage_api_version: "1.1",
				// client_id: 'tradingview.com',
				// user_id: 'public_user_id',
				theme: getParameterByName('theme'),
		});

		widget.onChartReady(() => {
				const chart = widget.chart();
				// // MA
				mas.forEach((item) => {
				    chart.createStudy(
				        'Moving Average',
				        false,
				        false,
				        [item.day],
				        null,
				        {
				            'plot.color': item.color,
				            'plot.linewidth': item.linewidth,
				        },
				    );
				});


      setKlineShapeCallback((data) => {
      	const {currTick, action, signal} = data;
	      let shape = '';
      	switch (signal.direction) {
		      case 'open_long': shape = 'arrow_up'; break;
          case 'open_short': shape = 'arrow_down'; break;
		      case 'close_long':
		      case 'stop_long':
		      	shape = 'vertical_line'; break;
		      case 'close_short':
		      case 'stop_short':
		      	shape = 'vertical_line'; break;
        }

        chart.createShape({
          time: currTick[0],
          price: currTick[4],
          channel: 'close'
        }, {
          shape: shape,
          lock: true
        })
      })

      //
				// // BOLL
				// chart.createStudy("Bollinger Bands", false, false);
				//
				// MACD
				// const chartId = chart.createStudy("MACD", false, false)
				//
				// // RSI
				// chart.createStudy("Relative Strength Index", false, false);
				//
				//
				// // EMA
				// chart.createStudy('Moving Average Exponential', false, false, [9], null,{
				// 		'plot.color': '#FF0000',
				// 		'plot.linewidth': 2,
				// })
				// chart.createStudy('Moving Average Exponential', false, false, [26], null, {
				// 		'plot.color': '#d442b1',
				// 		'plot.linewidth': 2,
				// })
				// chart.createStudy('Moving Average Exponential', false, false, [50], null, {
				// 		'plot.color': '#85AAD4',
				// 		'plot.linewidth': 2,
				// })
		})
}

export {
		initTradingView
}
