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

            //コードを取得
            var newSourceCode = editor.getValue();            
            // 取得した内容を実行
            eval(newSourceCode);

            sceneManager.model.rotation.x = 0;
            sceneManager.model.rotation.y = 0;
            sceneManager.model.rotation.z =0;

            //以下は、updateAcceleration関数以外にも、受講者側に弄らせる可能性が出てきた為、コメントアウト
            //window.updateAcceleration = eval(`(${newSourceCode})`);
            //console.log(window.updateAcceleration);
          });
        })
        .catch((error) => {
          console.error("Script loading error:", error);
        });
    });
  }, 10); // 0.01秒後に読み込む