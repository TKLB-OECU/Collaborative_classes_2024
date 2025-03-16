/**
 * ブロックからプロンプト情報を抽出・処理するモジュール
 */
export class PromptProcessor {
  constructor() {
    this.workspace = null;
    this.elements = null;
    this.currentPromptGroups = [];
    this.handlers = {
      text_prompt: (block) => {
        return [block.getFieldValue("TEXT_INPUT")];
      },
      theme_prompt: (block) => {
        return [block.getFieldValue("THEME")];
      },
      negative_prompt: (block) => {
        return [block.getFieldValue("NEG_TEXT")];
      },
      image_style: (block) => {
        return [block.getFieldValue("STYLE")];
      },
      color_palette: (block) => {
        return [block.getFieldValue("COLOR")];
      },
      seed_setting: (block) => {
        return [`シード値: ${block.getFieldValue("SEED")}`];
      },
      img_size: (block) => {
        return [
          `サイズ: ${block.getFieldValue("WIDTH")}×${block.getFieldValue(
            "HEIGHT"
          )}`,
        ];
      },
      image_generation: (block) => {
        const childBlock = block.getInputTargetBlock("PROMPTS");
        return childBlock ? this.processBlock(childBlock) : [];
      },
      prompt_switch: (block) => {
        const selectedKey = block.getFieldValue("SELECTED");
        if (selectedKey === "ALL") {
          return ["PROMPT1", "PROMPT2", "PROMPT3"]
            .map((key) => block.getInputTargetBlock(key))
            .filter(Boolean)
            .flatMap((childBlock) => this.processBlock(childBlock));
        }
        const childBlock = block.getInputTargetBlock(selectedKey);
        return childBlock ? this.processBlock(childBlock) : [];
      },
      keyword_emphasis: (block) => {
        return this.processNestedBlock(block, "EMPHASIS", "KEYWORD_CONTENT");
      },
      entity_block: (block) => {
        return this.processNestedBlock(block, "ENTITY_TYPE", "ENTITY_CONTENT");
      },
      bracket_decoration: (block) => {
        const bracketType = block.getFieldValue("BRACKET_TYPE");
        const [leftBracket, rightBracket] = [
          bracketType.charAt(0),
          bracketType.charAt(1),
        ];
        const childBlock = block.getInputTargetBlock("BRACKET_CONTENT");
        const childContent = childBlock
          ? this.processBlock(childBlock).join(" ")
          : "";
        return [`${leftBracket}${childContent}${rightBracket}`];
      },
      multi_select_prompt: (block) => {
        const selections = ["A", "B", "C"]
          .filter((key) => block.getFieldValue(`SELECT_${key}`) === "TRUE")
          .map((key) => block.getFieldValue(`TEXT_${key}`));
        return selections.length ? [selections.join(", ")] : [];
      },
    };
  }

  init(workspace, elements) {
    this.workspace = workspace;
    this.elements = elements;
  }

  processNestedBlock(block, fieldName, contentName) {
    const fieldValue = block.getFieldValue(fieldName) || "";
    const childBlock = block.getInputTargetBlock(contentName);
    const childContent = childBlock
      ? this.processBlock(childBlock).join(" ")
      : "";
    return [`${fieldValue} ${childContent}`];
  }

  processBlock(startBlock) {
    if (!startBlock) return [];
    try {
      const result = [];
      let currentBlock = startBlock;
      while (currentBlock) {
        const handler = this.handlers[currentBlock.type];
        if (handler) {
          result.push(...handler(currentBlock));
        } else {
          result.push(`[不明なブロック: ${currentBlock.type}]`);
        }
        currentBlock = currentBlock.getNextBlock();
      }
      return result;
    } catch (error) {
      console.error("Error processing blocks:", error);
      return [`[エラー: ${error.message}]`];
    }
  }

  updateDisplay() {
    if (!this.workspace || !this.elements.outputArea) return;
    try {
      // 画像生成ブロックのみ抽出
      const imageBlocks = this.workspace
        .getTopBlocks(false)
        .filter((block) => block.type === "image_generation");

      if (imageBlocks.length === 0) {
        this.elements.outputArea.textContent = "プロンプトがありません";
        return;
      }

      // 各ブロックからプロンプト情報を抽出
      const promptGroups = imageBlocks.map((block, index) => {
        const blockName = `画像生成 #${index + 1}`;
        const url = block.getFieldValue("URL") || "URL未設定";
        const prompts = this.processBlock(block);
        return { index, blockName, url, prompts };
      });

      // 現在のグループ情報を保持
      this.currentPromptGroups = promptGroups;

      // １つのみ選択可能なラジオボタンリストを生成
      const listHtml = promptGroups
        .map((group, idx) => {
          return `<li>
          <label>
            <input type="radio" name="promptChoice" class="prompt-choice" data-index="${
              group.index
            }" ${idx === 0 ? "checked" : ""}>
            <strong>${group.blockName}</strong> (URL: ${group.url})
          </label>
          <pre class="prompt-text">${group.prompts.join("\n")}</pre>
        </li>`;
        })
        .join("");

      this.elements.outputArea.innerHTML = `<ul>${listHtml}</ul>`;
    } catch (error) {
      console.error("Error updating prompts:", error);
      this.elements.outputArea.textContent = `エラーが発生しました: ${error.message}`;
    }
  }

  handleBlocklyChange(event) {
    if (
      event.type === Blockly.Events.BLOCK_CHANGE ||
      event.type === Blockly.Events.BLOCK_CREATE ||
      event.type === Blockly.Events.BLOCK_DELETE ||
      event.type === Blockly.Events.BLOCK_MOVE
    ) {
      this.updateDisplay();
    }
  }
}
