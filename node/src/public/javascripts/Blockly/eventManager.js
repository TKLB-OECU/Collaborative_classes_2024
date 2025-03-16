/**
 * Blocklyのイベント関連処理を担当するモジュール
 */
export class EventManager {
  constructor() {
    this.workspace = null;
    this.promptProcessor = null;
  }

  init(workspace, promptProcessor) {
    this.workspace = workspace;
    this.promptProcessor = promptProcessor;
    this.registerEvents();
  }

  registerEvents() {
    if (!this.workspace) return;

    // ウィンドウリサイズイベントでBlocklyを再調整
    window.addEventListener("resize", () => {
      if (this.workspace) {
        Blockly.svgResize(this.workspace);
      }
    });

    // Blocklyの変更イベント登録（プロンプト更新用）
    this.workspace.addChangeListener((event) =>
      this.promptProcessor.handleBlocklyChange(event)
    );

    // 親なしブロックを無効化するイベント登録
    this.workspace.addChangeListener(Blockly.Events.disableOrphans);
  }
}
