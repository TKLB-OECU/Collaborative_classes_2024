import { CONFIG } from "./config.js";
import { toolbox } from "./toolbox.js";

/**
 * Blocklyワークスペース初期化と管理を担当するモジュール
 */
export class WorkspaceManager {
  constructor() {
    this.workspace = null;
    this.elements = null;
  }

  /**
   * ワークスペースの初期化処理
   * @param {Object} elements - DOM要素マッピング
   * @returns {boolean} - 初期化が成功したかどうか
   */
  initialize(elements) {
    this.elements = elements;
    try {
      if (!this.elements.blocklyDiv) {
        throw new Error("Blockly container not found");
      }

      const blocklyConfig = { ...CONFIG.blockly, toolbox };
      // Blockly.inject()でワークスペースを生成
      this.workspace = Blockly.inject(this.elements.blocklyDiv, blocklyConfig);

      return true;
    } catch (error) {
      console.error("Failed to initialize Blockly:", error);
      // 画面にエラーメッセージを表示
      this.elements.blocklyDiv.innerHTML = `
        <div class="error-message">
          Blocklyの初期化に失敗しました。ページを再読み込みしてください。
          <p>エラー: ${error.message}</p>
        </div>`;
      return false;
    }
  }

  /**
   * ワークスペースのインスタンスを取得
   * @returns {Object|null} - Blocklyワークスペース
   */
  getWorkspace() {
    return this.workspace;
  }
}
