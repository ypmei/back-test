/**
 * Created by quany on 2018/4/20.
 */

/* global window */
/* global localStorage */
/* global isNaN */

// import { network } from 'utils';
import { setExchangeRealtimeCallback } from '$utils/socket_wcs';
// import config from 'config';
// import zipObj from 'ramda/es/zipObj';
// import evolve from 'ramda/es/evolve';
// import pipe from 'ramda/es/pipe';
// import { dateMap } from '$utils/candleConfig';

const Datafeeds = {};

Datafeeds.UDFCompatibleDatafeedExchange = function (symbolInfo) {
  this.configuration = undefined;

  this.symbolInfo = symbolInfo;

  this.enableLogging = false;
  this.initializationFinished = false;
  this.callbacks = {};

  // eslint-disable-next-line func-names
  // this.dateMap = dateMap;

  this.initialize();
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.defaultConfiguration = function () {
  return {
    supports_search: false,
    supports_group_request: true,
    supported_resolutions: this.symbolInfo.supported_resolutions,
    supports_marks: true,
    supports_timescale_marks: false,
    supports_time: true,
  };
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.getServerTime = function (callback) {
  if (this.configuration.supports_time) {
    callback(new Date().getTime() / 1000);
  }
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.on = function (event, callback) {
  // eslint-disable-next-line no-prototype-builtins
  if (!this.callbacks.hasOwnProperty(event)) {
    this.callbacks[event] = [];
  }

  this.callbacks[event].push(callback);
  return this;
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.fireEvent = function (event, argument) {
  // eslint-disable-next-line no-prototype-builtins
  if (this.callbacks.hasOwnProperty(event)) {
    const callbacksChain = this.callbacks[event];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < callbacksChain.length; ++i) {
      callbacksChain[i](argument);
    }

    this.callbacks[event] = [];
  }
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.onInitialized = function () {
  this.initializationFinished = true;
  this.fireEvent('initialized');
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.logMessage = function (message) {
  if (this.enableLogging) {
    const now = new Date();
    console.log(`${now.toLocaleTimeString()}.${now.getMilliseconds()}>${message}`);
  }
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.initialize = function () {
  this.configuration = this.defaultConfiguration();
  this.onInitialized();
  this.fireEvent('configuration_ready');
};

// 此方法旨在提供填充配置数据的对象。
Datafeeds.UDFCompatibleDatafeedExchange.prototype.onReady = function (callback) {
  if (this.configuration) {
    setTimeout(() => {
      callback(this.configuration);
    }, 0);
  } else {
    this.on('configuration_ready', () => {
      callback(this.configuration);
    });
  }
};


// 提供一个匹配用户搜索的商品列表
Datafeeds.UDFCompatibleDatafeedExchange.prototype.searchSymbols = function (userInput, exchange, symbolType, onResultReadyCallback) {
    onResultReadyCallback([])
}

// eslint-disable-next-line max-len
// 通过商品名称解析商品信息
Datafeeds.UDFCompatibleDatafeedExchange.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
  setTimeout(() => {
    onSymbolResolvedCallback(this.symbolInfo);
  }, 0);
};

// eslint-disable-next-line max-len
// 通过日期范围获取历史K线数据。图表库希望通过onHistoryCallback仅一次调用，接收所有的请求历史。而不是被多次调用。
// 当您调用onRealtimeCallback且K线时间等于最近一条K线时间时，那么这条最近的K线将被您传入的K线所替换。
// 是否可以更新最近的K线或追加一条新的，取决于onRealtimeCallback。 如果您调用此功能尝试更新历史记录中的一个K线时，则会收到错误消息。
// 现在，在图表接收到数据后，没有办法改变历史上的K线。
Datafeeds.UDFCompatibleDatafeedExchange.prototype.getBars = function somename(symbolInfo, resolution, rangeStartDate, rangeEndDate, onHistoryCallback, onErrorCallback, firstDataRequest) {
  // ßtimestamp sample: 1399939200
  if (rangeStartDate > 0 && rangeStartDate.toString().length > 10) {
    throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
  }

    onHistoryCallback([], {
    noData: true,
  });

  // if (firstDataRequest && this.symbolInfo && this.symbolInfo.pairCode) {
  //   // TODO 这里的symbol要改成pairCode product 现在不存在。可以参考perpetual
  //   network.get(`${config.api}/exchange/public/${this.symbolInfo.pairCode}/candles`, {
  //     interval: this.dateMap[resolution] || this.dateMap[localStorage.interval],
  //     // since: rangeStartDate * 1000,
  //   }).then((data) => {
  //     const len = data.length;
  //     if (len) {
  //       // eslint-disable-next-line prefer-destructuring
  //       localStorage.oldtime = data[0][0];
  //       // let max = 0.00;
  //       // let maxTime = 0;
  //       // let min = 10000000000.00;
  //       // let minTime = 0;
  //       // console.time("K线转换时间");
  //       // const bars = [];
  //
  //       const bars = data
  //         .map(pipe(
  //           zipObj(['time', 'low', 'high', 'open', 'close', 'volume']),
  //           evolve({
  //             low: Number,
  //             high: Number,
  //             open: Number,
  //             close: Number,
  //             volume: Number,
  //           }),
  //         ));
  //
  //       onDataCallback(bars, {
  //         noData: false,
  //       });
  //
  //       const status = bars.reduce((agg, item) => {
  //         if (item.low < agg.min) {
  //           agg.min = item.low;
  //           agg.minTime = item.time;
  //         }
  //
  //         if (item.high > agg.max) {
  //           agg.max = item.high;
  //           agg.maxTime = item.time;
  //         }
  //
  //         return agg;
  //       }, {
  //         min: Number.MAX_VALUE,
  //         minTime: null,
  //         max: Number.MIN_VALUE,
  //         maxTime: null,
  //       });
  //
  //       // localStorage.lastBar = data[len - 1][0];
  //       localStorage.maxPrice = status.max;
  //       localStorage.maxTime = status.maxTime / 1000;
  //       localStorage.minPrice = status.min;
  //       localStorage.minTime = status.minTime / 1000;
  //     } else {
  //       onDataCallback([], {
  //         noData: true,
  //       });
  //       // onErrorCallback(`${Date.now()}没有数据了`);
  //     }
  //   }).catch((e) => {
  //     onErrorCallback(`network error:${JSON.stringify(e)}`);
  //   });
  // } else {
  //   onDataCallback([], {
  //     noData: true,
  //   });
  //   // onErrorCallback(`${localStorage.oldtime}没有数据了`);
  // }
};
// 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据。
// eslint-disable-next-line max-len
Datafeeds.UDFCompatibleDatafeedExchange.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
  setExchangeRealtimeCallback(onRealtimeCallback);
};

// 取消订阅K线数据。在调用subscribeBars方法时,图表库将跳过与subscriberUID相同的对象。
Datafeeds.UDFCompatibleDatafeedExchange.prototype.unsubscribeBars = function (subscriberUID) {
  // this.socket.destroy();
  setExchangeRealtimeCallback(null);
};

// 图书馆调用这个函数来获得可见的K线范围的标记。 图表预期每调用一次getMarks就会调用一次onDataCallback。
// eslint-disable-next-line max-len
Datafeeds.UDFCompatibleDatafeedExchange.prototype.getMarks = function (symbolInfo, startDate, endDate, onDataCallback, resolution) {
  onDataCallback([{
    id: 1,
    time: localStorage.maxTime,
    color: {
      border: '#5B8E67',
      background: '#5B8E67',
    },
    text: localStorage.maxPrice,
    label: 'H',
    labelFontColor: '#fff',
    minSize: 24,
  },
  {
    id: 2,
    time: localStorage.minTime,
    color: 'red',
    text: localStorage.minPrice,
    label: 'L',
    labelFontColor: '#fff',
    minSize: 24,
  },
  ]);
};

// 图表库调用此函数获取可见K线范围的时间刻度标记。图表预期您每个调用getTimescaleMarks会调用一次onDataCallback。
// eslint-disable-next-line max-len
Datafeeds.UDFCompatibleDatafeedExchange.prototype.getTimescaleMarks = function (symbolInfo, startDate, endDate, onDataCallback, resolution) {
  onDataCallback([]);
};

// 图表库在它要请求一些历史数据的时候会调用这个函数，让你能够覆盖所需的历史深度。
// eslint-disable-next-line max-len
Datafeeds.UDFCompatibleDatafeedExchange.prototype.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack){
  // onDataCallback([]);
};

export default {
  UDFCompatibleDatafeedExchange: Datafeeds.UDFCompatibleDatafeedExchange,
};
