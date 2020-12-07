### 回测系统


```bash
安装依赖： npm install
``` 

```bash
启动： npm run dev
``` 

访问地址，需要手动输入你的websocket地址和初始本金
```bash
http://localhost:13004/index.html?wshost=localhost:8000&capital=1000
``` 

websocket传输的数据结构
```json
{
  "type": "tick",
  "currTick": [1577815200000,7168,7213,7209,7158,190806]
 }
``` 
```json
{
  "type": "order",
  "currTick": [1577815200000,7168,7213,7209,7158,190806],
   "index": "当前tick的索引值,可不填",
   "diff": "本次盈亏金额",
   "signal": {
      "action": "open|stop|close",
      "direction": "open_long|open_short|stop_long|stop_short|close_long|close_short"
   }
 }
```
```json
{
    "type": "rate", //收益率
    "diff": "本次盈亏金额",
    "vinTotal": "累计赢利",
    "failTotal": "累计亏损",
    "totalFee": "总费用",
    "profit": "净利润",
    "vinCount": "赢利次数",
    "failCount": "亏损次数",
    "totalCount": "总次数",
    "currTick": [1577815200000,7168,7213,7209,7158,190806]
 }
``` 





