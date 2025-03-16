/**
 * タブ管理（ブロック編集／プロンプト確認）を行うモジュール
 */
export class TabManager {
  constructor() {
    this.elements = null;
    this.workspace = null;
  }

  init(elements, workspace) {
    this.elements = elements;
    this.workspace = workspace;

    if (!this.elements.blocklyTab || !this.elements.outputTab) {
      console.warn("Tab elements not found, skipping tab initialization");
      return;
    }

    // 初期表示状態の設定
    this.elements.blocklyDiv.classList.add("active-view");
    this.elements.outputPane.classList.add("hidden-view");
    this.elements.blocklyTab.classList.add("active");

    // タブ切替イベントの登録
    this.elements.blocklyTab.addEventListener("click", () =>
      this.switchTo("blockly")
    );
    this.elements.outputTab.addEventListener("click", () =>
      this.switchTo("output")
    );
  }

  switchTo(tabName) {
    const config = {
      blockly: {
        activeTab: this.elements.blocklyTab,
        inactiveTab: this.elements.outputTab,
        activeView: this.elements.blocklyDiv,
        hiddenView: this.elements.outputPane,
      },
      output: {
        activeTab: this.elements.outputTab,
        inactiveTab: this.elements.blocklyTab,
        activeView: this.elements.outputPane,
        hiddenView: this.elements.blocklyDiv,
      },
    };

    if (!config[tabName]) {
      console.error(`Invalid tab name: ${tabName}`);
      return;
    }

    const { activeTab, inactiveTab, activeView, hiddenView } = config[tabName];

    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    activeView.classList.add("active-view");
    activeView.classList.remove("hidden-view");
    hiddenView.classList.add("hidden-view");
    hiddenView.classList.remove("active-view");

    if (tabName === "blockly" && this.workspace) {
      Blockly.svgResize(this.workspace);
    }
  }
}
