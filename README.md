# 安裝

    $ npm install

# 使用

    $ node bin/www

# 目錄文件說明

### /bin

| 文件 | 說明 |
| ------ | ------ |
| bin | 伺服器、Socket 起始啟動點 |

### /public/images

網站相關圖片
| 文件 | 說明 |
| ------ | ------ |
| bg.png | 首頁背景圖 |
| icon.ico | 網站 icon |
| intro1.png | 首頁程序圖 |
| intro2.png | 首頁 AI 圖 |

### /public/javascripts

網站相關 js 文件
| 文件 | 說明 |
| ------ | ------ |
| index.js | 首頁 js |
| room.js | 房間 js |

### /public/stylesheets

網站相關 css 文件
| 文件 | 說明 |
| ------ | ------ |
| index.js | 首頁 css |
| room.js | 房間 css |

### /routes

| 文件 | 說明 |
| ------ | ------ |
| error.js | 錯誤路由 |
| INDEX.js | 首頁與房間相關路由 |

### /views

| 文件 | 說明 |
| ------ | ------ |
| index.ejs | 首頁版面 |
| message.ejs | 訊息版面，目前用於 404 |
| room.ejs | 房間版面 |

### /

| 文件 | 說明 |
| ------ | ------ |
| _DATAS.js | 資料檔，獨立出來，裡面記錄螢幕輸出的顏色 |
| _FUNCTIONS.js | 函式檔，獨立出來 |
| app.js | 伺服器主要內容 |
| Chess.js | 象棋棋子類 |
| Player.js | 玩家類 |
| Room.js | 房間類 |
| XChess.js | 象棋棋盤類 |

# 文件相關連結

### 類別的相關連結

| 檔案 | 使用的檔案 |
| ------ | ------ |
| /XChess.js | /Chess.js |
|  |  |
| /Room.js | /Player.js |
|  | /XChess.js |
|  |  |
| /bin/www | /Room.js |
|  | /Player.js |
    
