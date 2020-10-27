var db=null;//データベースオブジェクト
function createDB(){//データベースの構築
 try {
     if (!window.openDatabase) {
         alert('このサイトはGoogle ChromeまたはSafariでご利用ください。\nGoogle Chrome,iPhoneおよびWindows阪Mac阪Safariでご利用いただけます。');
     } else {
      var shortName = 'HA';//データベース名（英語）システムで利用
      var version = '1.0';//データベースバージョン
      var displayName = '家計簿';//データベース名（日本語）開発コンソールで表示されます。
      var maxSize = 5000000; // in bytes
         db = openDatabase(shortName, version, displayName, maxSize);
     }
 } catch(e) {
     alert("エラー"+e+".");
     return;
 }
    db.transaction(function(tx) {// テーブルがない場合、テーブルを作る
  tx.executeSql('CREATE TABLE IF NOT EXISTS MANAGEMENT (id INTEGER AUTOINCREMENT, date TEXT, money INTEGER, memo TEXT, categoryid INTEGER);', [],nullDataHandler, errorHandler)
  tx.executeSql('CREATE TABLE IF NOT EXISTS HOME (categoryid INTEGER, categoryName TEXT, flag INTEGER);')
        /*
  tx.executeSql('CREATE TABLE IF NOT EXISTS user (sdate TEXT,edate TEXT,card INTEGER,bank INTEGER);', [],nullDataHandler, errorHandler);
  tx.executeSql('CREATE TABLE IF NOT EXISTS shiwake(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, type TEXT,date TEXT,hid INTEGER,kid INTEGER,kingaku INTEGER,bikou TEXT)');
        CREATE TABLEのサンプルです
        */
    }, TransactionErrorCallback,function(){});
}

function back_page(){
 document.querySelector('#myNavigator').popPage(options = {animation : "fade"});
}

//エラーハンドラ　変更、削除不可
function nullDataHandler(tx, rs) {}//Nullデータハンドラ
function TransactionErrorCallback(error){//トランザクションエラー
    alert('トランザクションエラー'+error.message+' (Code '+error.code+')');
}
function errorHandler(transaction, error){//エラーハンドラ
    alert('エラー '+error.message+' (Code '+error.code+')');
    var we_think_this_error_is_fatal = true;
    if (we_think_this_error_is_fatal) return true;
    return false;
}

function dropDB(){
 db.transaction(function (tx) {
   tx.executeSql('DROP SCHEMA HA;')
  },TransactionErrorCallback,function(){});
}