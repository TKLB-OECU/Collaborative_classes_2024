import { toolbox } from "../Blockly/toolbox.js";
import "../Blockly/customBlocks.js";

document.addEventListener("DOMContentLoaded", function () {
  // JavaScriptジェネレーターの存在を確認
  if (!Blockly.JavaScript) {
    console.error("Blockly.JavaScriptが見つかりません");
    // ジェネレーターを明示的に読み込む試み
    try {
      // もし別途読み込む必要があればここでimportなどを行う
    } catch (e) {
      console.error("ジェネレーターの読み込みに失敗:", e);
    }
  }

  // Blocklyの初期化
  const blocklyDiv = document.getElementById("blocklyDiv");
  const workspace = Blockly.inject(blocklyDiv, {
    toolbox: toolbox,
  });

  // 生成されたコードを表示
  const outputArea = document.getElementById("generatedCode");

  // 再帰的にブロック情報を収集
  function collectBlockData(startBlock) {
    let result = [];
    let currentBlock = startBlock;
    while (currentBlock) {
      if (currentBlock.type === "text_prompt") {
        // ラベル削除: 内容だけ追加
        result.push(currentBlock.getFieldValue("TEXT_INPUT"));
      } else if (currentBlock.type === "theme_prompt") {
        // テーマの値だけを追加
        result.push(currentBlock.getFieldValue("THEME"));
      } else if (currentBlock.type === "negative_prompt") {
        // ネガティブプロンプト
        result.push(currentBlock.getFieldValue("NEG_TEXT"));
      } else if (currentBlock.type === "image_generation") {
        let childBlock = currentBlock.getInputTargetBlock("PROMPTS");
        if (childBlock) {
          result.push(...collectBlockData(childBlock));
        }
      } else if (currentBlock.type === "prompt_switch") {
        const selectedKey = currentBlock.getFieldValue("SELECTED");
        if (selectedKey === "ALL") {
          ["PROMPT1", "PROMPT2", "PROMPT3"].forEach((key) => {
            let childBlock = currentBlock.getInputTargetBlock(key);
            if (childBlock) {
              result.push(...collectBlockData(childBlock));
            }
          });
        } else {
          let childBlock = currentBlock.getInputTargetBlock(selectedKey);
          if (childBlock) {
            result.push(...collectBlockData(childBlock));
          }
        }
      } else if (currentBlock.type === "image_style") {
        // スタイル値のみを追加
        result.push(currentBlock.getFieldValue("STYLE"));
      } else if (currentBlock.type === "keyword_emphasis") {
        // 入れ子構造対応 - ブロック名削除
        const emphasis = currentBlock.getFieldValue("EMPHASIS");
        let childBlock = currentBlock.getInputTargetBlock("KEYWORD_CONTENT");
        let childContent = childBlock ? collectBlockData(childBlock) : [];
        // 括弧と強調記号だけ追加
        result.push(`(${childContent.join(" ")})${emphasis}`);
      } else if (currentBlock.type === "entity_block") {
        // 入れ子構造対応 - ブロック名削除
        const entityType = currentBlock.getFieldValue("ENTITY_TYPE");
        let childBlock = currentBlock.getInputTargetBlock("ENTITY_CONTENT");
        let childContent = childBlock ? collectBlockData(childBlock) : [];
        result.push(`${entityType} ${childContent.join(" ")}`);
      } else if (currentBlock.type === "color_palette") {
        // 色の値のみを追加
        result.push(currentBlock.getFieldValue("COLOR"));
      } else if (currentBlock.type === "bracket_decoration") {
        // 入れ子構造対応 - ブロック名削除
        const bracketType = currentBlock.getFieldValue("BRACKET_TYPE");
        const leftBracket = bracketType.charAt(0);
        const rightBracket = bracketType.charAt(1);
        let childBlock = currentBlock.getInputTargetBlock("BRACKET_CONTENT");
        let childContent = childBlock ? collectBlockData(childBlock) : [];
        // 括弧のみを追加して内容を囲む
        result.push(`${leftBracket}${childContent.join(" ")}${rightBracket}`);
      } else if (currentBlock.type === "multi_select_prompt") {
        let selections = [];
        if (currentBlock.getFieldValue("SELECT_A") === "TRUE") {
          selections.push(currentBlock.getFieldValue("TEXT_A"));
        }
        if (currentBlock.getFieldValue("SELECT_B") === "TRUE") {
          selections.push(currentBlock.getFieldValue("TEXT_B"));
        }
        if (currentBlock.getFieldValue("SELECT_C") === "TRUE") {
          selections.push(currentBlock.getFieldValue("TEXT_C"));
        }
        if (selections.length > 0) {
          // "複数選択:" ラベルを削除して内容だけ追加
          result.push(selections.join(", "));
        }
      } else {
        result.push("[不明なブロック]: " + currentBlock.type);
      }
      currentBlock = currentBlock.getNextBlock();
    }
    return result;
  }

  function displayPrompts() {
    const topBlocks = workspace.getTopBlocks(false);
    let prompts = [];
    topBlocks.forEach((block) => {
      // 画像生成ブロック以外はスキップ
      if (block.type === "image_generation") {
        prompts.push(...collectBlockData(block));
      }
    });
    outputArea.textContent = prompts.join("\n") || "プロンプトがありません";
  }

  // ブロック配置や変更があった時に内容をまとめて表示
  workspace.addChangeListener(() => {
    displayPrompts();
  });

  // 初期表示
  displayPrompts();

  // ウィンドウリサイズ対応
  window.addEventListener("resize", function () {
    Blockly.svgResize(workspace);
  });
});
