# Collaborative_classes_2024

## Webアプリケーション概要


### 機能

- AI（Shape-e）を用いた3Dモデルの作成
- 3Dモデルの描画
- 加速度取得(スマホ:Phyphox利用)
- 加速度を用いた3Dモデルの制御

### ページ構成

- 概要ページ
- 3Dモデル制御ページ
- 3Dモデル作成ページ
- 授業資料ページ

### 各種ページの簡単な内容

#### 概要ページ

- 当日の流れなやすることを記す？
- 各ページの操作説明など？

#### 3Dモデル制御ページ

- 演習問題
- MonacoEditorを用いたコードの編集
- Phyphoxへのリクエスト
  - URL入力
  - 通信開始ボタン
  - 通信停止ボタン
- 3Dモデル描画
  - 3Dモデル選択ボタン

#### 3Dモデル作成ページ

- 3Dモデル作成
  - プロンプト入力欄
    - 日本語・英語統一したプロンプト
  - プロンプト送信ボタン
  - 3Dモデル描画
  - モデルダウンロード


#### 授業資料ページ

- 授業の内容を記す予定


## ディレクトリ構造
<pre>
E:.
├─node
│  ├─.devcontainer
│  └─src
│      ├─bin               //Node.jsを使用して基本的なWebサーバーを作成
│      ├─public            //静的ファイル等（各ページのJavaScript,CSS,image等）
│      │  ├─images
│      │  ├─videos
│      │  ├─javascripts
│      │  └─stylesheets
│      │      ├─components
│      │      └─pages
│      ├─routes           //ルーティング関連
│      └─views            //初期提供HTMLのテンプレート等
│          ├─components   //Header,Footer等、複数ページに差し込むテンプレート
│          └─pages        //各ページの初期提供テンプレート(html)
└─shap-e                  //3dモデル作成関連
    ├─.devcontainer
    └─src
</pre>


## proxy.env
後々記述予定

    http_proxy=http://wwwproxy.osakac.ac.jp:8080
    https_proxy=http://wwwproxy.osakac.ac.jp:8080
