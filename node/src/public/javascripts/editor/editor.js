setTimeout(function () {
    // 5秒後に実行するコード
    require.config({
      paths: { vs: "javascripts/module/monaco-editor/min/vs" },
    });

    require(["vs/editor/editor.main"], function () {
      // ソースコードの取得
      fetch("/javascripts/pages/updateAcceleration_sample.js")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load script: " + response.status);
          }
          return response.text();
        })
        .then((sourceCode) => {
          // Monaco Editor の初期化
          var editor = monaco.editor.create(
            document.getElementById("container"),
            {
              value: sourceCode,
              language: "javascript",
            },
          );

          // 変更を反映するボタン
          document.getElementById("applyChangesButton").addEventListener("click", function () {
            // エディタの内容を取得
            var newSourceCode = editor.getValue();
            // 取得した内容を実行
            eval(newSourceCode);
          });
        })
        .catch((error) => {
          console.error("Script loading error:", error);
        });
    });
  }, 10); // 0.01秒後に読み込む