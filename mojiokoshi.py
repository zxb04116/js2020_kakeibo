#言葉を聞き取って文字に変換し、エクセルブックに保存するプログラム
#2020/9/12 伊沢　剛
import pandas as pd #エクセルのブックを操作するライブラリの読み込み
import speech_recognition as sr
import datetime as dt
import threading
r = sr.Recognizer() #言葉を認識するオブジェクト
mic = sr.Microphone() #マイクオブジェクト
result_list = [] #エクセルに出力するデータを格納するリスト
endFlag = False #記録終了フラグ
lock = threading.RLock() #ロックオブジェクトの生成
def speechToText(): #マイクから音声を取り込み続ける
    print("記録を開始しました。終了するには「記録を終了」と言ってください。")
    while True:
        with mic as source:
            r.adjust_for_ambient_noise(source) #ノイズ対応
            audio  = r.listen(source) #オーディオファイルに変換
        threading.Thread(target=speechRecognize,args=(lock,audio)).start()
        if endFlag == True:
            break
    print("プログラム終了")
def speechRecognize(lock,audio): #音声を認識し文字列に変換する
    global endFlag
    if endFlag == True: #記録を終了と言われた場合は認識を行わない
        return
    with lock:
        try:
            print ("認識中",end="\r")
            result = r.recognize_google(audio, language='ja-JP')#音声を文字に変換
            now = dt.datetime.today()
            if result == "記録を終了": 
                fileName = str(now)+"会議メモ.xlsx" #保存するファイル名
                df = pd.DataFrame(result_list,columns=['時刻', '内容'])#列名
                with pd.ExcelWriter(fileName) as writer:
                    df.to_excel(writer,index=False)#エクセルファイルに書き出し
                print(fileName+"という名前で保存しました。")
                endFlag = True
            else:
                print(str(now)+result) #認識結果を表示
                result_list.append([now,result])#入力したデータをリスト形式で追加
        except:#例外処理（何もしない）
            pass
speechToText()#メイン処理
