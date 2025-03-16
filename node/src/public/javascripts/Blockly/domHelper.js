import { CONFIG } from "./config.js";

/**
 * DOM操作用ヘルパー関数モジュール
 */
export class DomHelper {
  /**
   * セレクタから要素を取得する
   * @param {string} selector - DOM要素のセレクタ
   * @returns {Element|null} - 取得した要素またはnull
   */
  static getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  }

  /**
   * DOM上の各主要要素を一括初期化
   * @returns {Object|boolean} - 要素のマッピングまたは失敗時はfalse
   */
  static initializeElements() {
    try {
      const selectors = CONFIG.selectors;
      const elements = Object.keys(selectors).reduce((acc, key) => {
        acc[key] = this.getElement(selectors[key]);
        return acc;
      }, {});
      return elements;
    } catch (error) {
      console.error("Failed to initialize DOM elements:", error);
      return false;
    }
  }
}
