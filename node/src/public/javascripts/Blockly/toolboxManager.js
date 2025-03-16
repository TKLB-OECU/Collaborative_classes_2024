import { CONFIG } from "./config.js";
import { toolbox } from "./toolbox.js";

/**
 * ツールボックスの表示・非表示を管理するモジュール
 */
export class ToolboxManager {
  constructor() {
    this.workspace = null;
    this.elements = null;
    this.toolboxVisible = true;
  }

  init(workspace, elements) {
    this.workspace = workspace;
    this.elements = elements;
    // ツールボックスボタンの生成と配置
    const button = this.createToolboxButton();
    if (this.elements.mobileTabs) {
      this.elements.mobileTabs.insertAdjacentElement("afterend", button);
      button.addEventListener("click", () => this.toggle());
    }
  }

  // ツールボックス用ボタン作成（表示/非表示切替）
  createToolboxButton() {
    const button = document.createElement("button");
    button.id = "toolboxControl";
    button.className = "toolbox-control";
    button.innerHTML = CONFIG.toolboxBtn.hideText;
    button.title = "ツールボックスの表示/非表示を切り替え";
    button.setAttribute("aria-label", "ツールボックスを切り替える");
    return button;
  }

  toggle() {
    try {
      this.toolboxVisible = !this.toolboxVisible;
      if (this.toolboxVisible) {
        this.show();
      } else {
        this.hide();
      }
      // ワークスペースサイズ再計算
      if (this.workspace) {
        Blockly.svgResize(this.workspace);
      }
    } catch (error) {
      console.error("Failed to toggle toolbox:", error);
      this.reset(); // エラー回復
    }
  }

  show() {
    if (!this.workspace) return;
    this.elements.blocklyDiv.classList.remove("toolbox-hidden");
    this.workspace.updateToolbox(toolbox);
    const button = document.getElementById("toolboxControl");
    if (button) {
      button.innerHTML = CONFIG.toolboxBtn.hideText;
    }
  }

  hide() {
    if (!this.workspace) return;
    this.elements.blocklyDiv.classList.add("toolbox-hidden");
    const button = document.getElementById("toolboxControl");
    if (button) {
      button.innerHTML = CONFIG.toolboxBtn.showText;
    }
  }

  reset() {
    this.toolboxVisible = true;
    this.show();
  }
}
