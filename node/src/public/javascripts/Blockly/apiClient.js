/**
 * APIリクエスト処理を担当するモジュール
 */
export class ApiClient {
  constructor() {
    this.promptProcessor = null;
  }

  init(promptProcessor) {
    this.promptProcessor = promptProcessor;
    this.initializeControls();
  }

  initializeControls() {
    const generateBtn = document.getElementById("generateImagesBtn");
    if (generateBtn) {
      generateBtn.addEventListener("click", () =>
        this.sendImageGenerationRequests()
      );
    }
  }

  async sendImageGenerationRequests() {
    const loadingIndicator = document.getElementById("apiLoadingIndicator");
    const imagesContainer = document.getElementById("generatedImagesContainer");
    const apiErrorContainer = document.getElementById("apiErrorContainer");
    const apiErrorMessage = document.getElementById("apiErrorMessage");

    // 画面リセット
    imagesContainer.innerHTML = "";
    apiErrorContainer.classList.add("hidden");

    // ローディング表示
    loadingIndicator.classList.remove("hidden");

    try {
      // ラジオボタンから選択された画像生成ブロックのインデックスを取得
      const selectedRadio = document.querySelector(
        'input[name="promptChoice"]:checked'
      );

      if (!selectedRadio) {
        throw new Error("画像生成ブロックが選択されていません");
      }

      const selectedIndex = parseInt(
        selectedRadio.getAttribute("data-index"),
        10
      );

      const selectedGroup = this.promptProcessor.currentPromptGroups.find(
        (group) => group.index === selectedIndex
      );

      if (!selectedGroup) {
        throw new Error("選択された画像生成ブロックが見つかりません");
      }

      // APIリクエスト：プロンプト文字列を送信
      const response = await fetch(selectedGroup.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: selectedGroup.prompts.join(" ") }),
      });

      if (!response.ok) {
        throw new Error(
          `${selectedGroup.blockName} のエラー: ${response.statusText}`
        );
      }

      const data = await response.json();

      // 受信した画像を画面に表示
      const img = document.createElement("img");
      img.src = data.imageUrl || "";
      img.alt = `生成画像 #${selectedGroup.index + 1}`;
      img.className = "generated-image";
      imagesContainer.appendChild(img);
    } catch (error) {
      console.error("APIリクエストエラー:", error);
      apiErrorMessage.textContent = error.message;
      apiErrorContainer.classList.remove("hidden");
    } finally {
      loadingIndicator.classList.add("hidden");
    }
  }
}
