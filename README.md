# Collaborative_classes_2024

## ディレクトリ構造
<pre>
root
├── docker-compose.yml
│
├── node
│   ├── .devcontainer
│   │   ├── devcontainer.json
│   │   └── dockerfile
│   │
│   └── src
│       ├── app.js
│       ├── package.json
│       ├──public
│       ├──routes
│       ├──views
│       └──node_models
│
├── shap-e
│   ├── .devcontainer
│   │   ├── devcontainer.json
│   │   └── dockerfile
│   └── src
│       ├── shap_e
│       ├── server.py
│       ├── start-server.sh
│       └── setup.py
│
└── README.md
</pre>


## proxy.env
後々記述予定

    http_proxy=http://wwwproxy.osakac.ac.jp:8080
    https_proxy=http://wwwproxy.osakac.ac.jp:8080