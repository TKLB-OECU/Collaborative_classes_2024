# Collaborative_classes_2024

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
