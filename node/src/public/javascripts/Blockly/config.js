/**
 * アプリケーションの設定を集約するモジュール
 */
export const CONFIG = Object.freeze({
  selectors: {
    blocklyDiv: "#blocklyDiv",
    outputPane: "#outputPane",
    outputArea: "#generatedCode",
    blocklyTab: "#blocklyTab",
    outputTab: "#outputTab",
    container: "#pageContainer",
    mobileTabs: ".mobile-tabs",
  },
  blockly: {
    scrollbars: true,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.8,
      maxScale: 3,
      minScale: 0.3,
    },
    move: { drag: true, wheel: true },
    trashcan: false,
    collapse: true,
    toolboxPosition: "start",
  },
  toolboxBtn: {
    showText: "ツールボックス表示 ▶",
    hideText: "ツールボックス非表示 ◀",
  },
});
