// 分割したモジュールのインポート
import { DomHelper } from "../Blockly/domHelper.js";
import { WorkspaceManager } from "../Blockly/workspaceManager.js";
import { ToolboxManager } from "../Blockly/toolboxManager.js";
import { TabManager } from "../Blockly/tabManager.js";
import { PromptProcessor } from "../Blockly/promptProcessor.js";
import { EventManager } from "../Blockly/eventManager.js";
import { ApiClient } from "../Blockly/apiClient.js";
import "../Blockly/customBlocks.js";

// ● アプリケーション全体の初期化をモジュールパターンで実装
const PromptEditorApp = (function () {
  // 各モジュールのインスタンス
  const workspaceManager = new WorkspaceManager();
  const toolboxManager = new ToolboxManager();
  const tabManager = new TabManager();
  const promptProcessor = new PromptProcessor();
  const eventManager = new EventManager();
  const apiClient = new ApiClient();

  // DOM要素のマッピングを保持
  let elements = {};

  // ---------------------------
  // （初期化処理）
  // ---------------------------
  return {
    initialize() {
      console.log("Initializing Prompt Editor App");

      // DOM要素の初期化
      elements = DomHelper.initializeElements();
      if (!elements) {
        console.error(
          "Failed to initialize the application: Missing required DOM elements"
        );
        return false;
      }

      // Blocklyワークスペースの初期化
      if (!workspaceManager.initialize(elements)) {
        console.error("Failed to initialize Blockly workspace");
        return false;
      }

      // 各モジュールの初期化
      const workspace = workspaceManager.getWorkspace();

      toolboxManager.init(workspace, elements);
      tabManager.init(elements, workspace);
      promptProcessor.init(workspace, elements);
      eventManager.init(workspace, promptProcessor);
      apiClient.init(promptProcessor);

      // 初期プロンプト表示
      promptProcessor.updateDisplay();

      console.log("Prompt Editor App initialized successfully");
      return true;
    },

    getWorkspace() {
      return workspaceManager.getWorkspace();
    },
  };
})();

// DOMコンテンツ読み込み完了後に初期化
document.addEventListener("DOMContentLoaded", () => {
  PromptEditorApp.initialize();
});
