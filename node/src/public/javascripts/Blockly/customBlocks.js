// カラーパレット - 共通色定義
const BLOCK_COLORS = {
  TEXT: 330,
  THEME: 30,
  FRAME: 120,
  PROMPT_SWITCH: 290,
  SIZE: 70,
  NEGATIVE: 10,
  STYLE: 210,
  SEED: 180,
  EMPHASIS: 100,
  ENTITY: 40,
  COLOR: 250,
  BRACKET: 310,
  MULTI_SELECT: 20,
};

// ブロック定義のファクトリークラス
class BlockFactory {
  static createField(config) {
    const { type, options = {} } = config;

    switch (type) {
      case "text":
        return new Blockly.FieldTextInput(options.defaultValue || "");
      case "dropdown":
        return new Blockly.FieldDropdown(options.items || [["", ""]]);
      case "number":
        return new Blockly.FieldNumber(
          options.defaultValue || 0,
          options.min,
          options.max,
          options.precision
        );
      case "checkbox":
        return new Blockly.FieldCheckbox(options.checked ? "TRUE" : "FALSE");
      default:
        return null;
    }
  }

  static createSimpleBlock(config) {
    return {
      init: function () {
        const input = this.appendDummyInput().appendField(config.label || "");

        if (config.fields) {
          config.fields.forEach((field) => {
            const fieldComponent = BlockFactory.createField(field);
            if (fieldComponent) {
              input.appendField(fieldComponent, field.name);
            }
          });
        }

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(config.colour || 0);
        this.setTooltip(config.tooltip || "");
        this.setHelpUrl(config.helpUrl || "");

        if (config.extend) {
          config.extend.call(this);
        }
      },
    };
  }

  static createNestedBlock(config) {
    return {
      init: function () {
        const input = this.appendDummyInput().appendField(config.label || "");

        if (config.fields) {
          config.fields.forEach((field) => {
            const fieldComponent = BlockFactory.createField(field);
            if (fieldComponent) {
              input.appendField(fieldComponent, field.name);
            }
          });
        }

        this.appendStatementInput(config.inputName || "CONTENT")
          .setCheck(null)
          .appendField(config.inputLabel || "内容");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(config.colour || 0);
        this.setTooltip(config.tooltip || "");
        this.setHelpUrl(config.helpUrl || "");
      },
    };
  }
}

// テキストプロンプト
Blockly.Blocks["text_prompt"] = BlockFactory.createSimpleBlock({
  label: "テキストプロンプト",
  fields: [
    {
      type: "text",
      name: "TEXT_INPUT",
      options: { defaultValue: "自由入力" },
    },
  ],
  colour: BLOCK_COLORS.TEXT,
  tooltip: "自由に入力できるテキストプロンプト",
});

// テーマ選択ブロック
Blockly.Blocks["theme_prompt"] = BlockFactory.createSimpleBlock({
  label: "テーマ",
  fields: [
    {
      type: "dropdown",
      name: "THEME",
      options: {
        items: [
          ["夕日", "美しい夕日の風景"],
          ["ビーチ", "静かなビーチの風景"],
          ["未来都市", "近未来的な都市の風景"],
          ["夜の街", "静寂で暗い街の風景"],
          ["宇宙", "壮大な宇宙の風景"],
          ["森の中", "神秘的な森の風景"],
        ],
      },
    },
  ],
  colour: BLOCK_COLORS.THEME,
  tooltip: "テーマから選択できるプロンプト",
});

// ネガティブプロンプトブロック
Blockly.Blocks["negative_prompt"] = BlockFactory.createSimpleBlock({
  label: "ネガティブプロンプト",
  fields: [
    {
      type: "text",
      name: "NEG_TEXT",
      options: { defaultValue: "不要な要素..." },
    },
  ],
  colour: BLOCK_COLORS.NEGATIVE,
  tooltip: "生成から除外したい要素を記述",
});

// スタイル選択ブロック
Blockly.Blocks["image_style"] = BlockFactory.createSimpleBlock({
  label: "スタイル",
  fields: [
    {
      type: "dropdown",
      name: "STYLE",
      options: {
        items: [
          ["リアル系", "REAL"],
          ["イラスト系", "ILLUST"],
          ["3D風", "THREED"],
          ["水彩画", "WATERCOLOR"],
          ["油絵", "OIL"],
          ["アニメ風", "ANIME"],
          ["ピクセルアート", "PIXEL"],
          ["写真風", "PHOTO"],
        ],
      },
    },
  ],
  colour: BLOCK_COLORS.STYLE,
  tooltip: "画像の生成スタイルを選択",
});

// シード値設定ブロック
Blockly.Blocks["seed_setting"] = BlockFactory.createSimpleBlock({
  label: "シード値",
  fields: [
    {
      type: "number",
      name: "SEED",
      options: {
        defaultValue: 0,
        min: 0,
        max: 999999,
      },
    },
  ],
  colour: BLOCK_COLORS.SEED,
  tooltip: "画像生成の乱数シードを固定",
});

// カラーパレットブロック
Blockly.Blocks["color_palette"] = BlockFactory.createSimpleBlock({
  label: "カラーパレット",
  fields: [
    {
      type: "dropdown",
      name: "COLOR",
      options: {
        items: [
          ["赤", "red"],
          ["青", "blue"],
          ["緑", "green"],
          ["黄", "yellow"],
          ["紫", "purple"],
          ["橙", "orange"],
          ["黒", "black"],
          ["白", "white"],
        ],
      },
    },
  ],
  colour: BLOCK_COLORS.COLOR,
  tooltip: "色を指定して画像に反映させる",
});

// キーワード強調ブロック
Blockly.Blocks["keyword_emphasis"] = BlockFactory.createNestedBlock({
  label: "重要度",
  fields: [
    {
      type: "dropdown",
      name: "EMPHASIS",
      options: {
        items: [
          ["少し重要", "少し重要な"],
          ["重要", "重要な"],
          ["とても重要", "とても重要な"],
          ["最重要", "最も重要な"],
        ],
      },
    },
  ],
  inputName: "KEYWORD_CONTENT",
  inputLabel: "強調内容",
  colour: BLOCK_COLORS.EMPHASIS,
  tooltip: "内部のブロックを重要度に応じて強調します",
});

// エンティティ指定ブロック
Blockly.Blocks["entity_block"] = BlockFactory.createNestedBlock({
  label: "エンティティ",
  fields: [
    {
      type: "dropdown",
      name: "ENTITY_TYPE",
      options: {
        items: [
          ["人物", "人物:"],
          ["背景", "背景:"],
          ["アイテム", "アイテム:"],
          ["時間", "時間:"],
          ["天気", "天気:"],
        ],
      },
    },
  ],
  inputName: "ENTITY_CONTENT",
  inputLabel: "具体内容",
  colour: BLOCK_COLORS.ENTITY,
  tooltip: "人物、背景などのカテゴリごとに内容を指定",
});

// 括弧装飾ブロック
Blockly.Blocks["bracket_decoration"] = BlockFactory.createNestedBlock({
  label: "括弧装飾",
  fields: [
    {
      type: "dropdown",
      name: "BRACKET_TYPE",
      options: {
        items: [
          ["括弧 ()", "()"],
          ["角括弧 []", "[]"],
          ["波括弧 {}", "{}"],
          ["山括弧 <>", "<>"],
        ],
      },
    },
  ],
  inputName: "BRACKET_CONTENT",
  colour: BLOCK_COLORS.BRACKET,
  tooltip: "括弧内に他のプロンプトブロックを配置できます",
});

// 複雑なブロックは個別に定義
Blockly.Blocks["image_generation"] = {
  init: function () {
    this.appendDummyInput().appendField("画像生成");
    this.appendDummyInput()
      .appendField("URL:")
      .appendField(
        new Blockly.FieldTextInput("https://api.example.com/generate"),
        "URL"
      );
    this.appendStatementInput("PROMPTS")
      .setCheck(null)
      .appendField("▼プロンプト群");
    this.setColour(BLOCK_COLORS.FRAME);
    this.setTooltip(
      "画像生成用の大枠。URLは送信先として利用し、PROMPTS内に各種プロンプトを入れる"
    );
    this.setHelpUrl("");
  },
};

// プロンプト切り替えブロック
Blockly.Blocks["prompt_switch"] = {
  init: function () {
    this.appendDummyInput().appendField("プロンプト切り替え");
    this.appendDummyInput()
      .appendField("使用するプロンプト:")
      .appendField(
        new Blockly.FieldDropdown([
          ["1", "PROMPT1"],
          ["2", "PROMPT2"],
          ["3", "PROMPT3"],
          ["All", "ALL"],
        ]),
        "SELECTED"
      );

    // プロンプト入力欄を追加
    ["プロンプト1", "プロンプト2", "プロンプト3"].forEach((label, index) => {
      this.appendStatementInput(`PROMPT${index + 1}`)
        .setCheck(null)
        .appendField(label);
    });

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BLOCK_COLORS.PROMPT_SWITCH);
    this.setTooltip("複数のプロンプトを切り替える");
    this.setHelpUrl("");
  },
};

// 画像サイズ設定ブロック
Blockly.Blocks["img_size"] = BlockFactory.createSimpleBlock({
  label: "画像サイズ",
  fields: [
    {
      type: "text",
      name: "WIDTH_LABEL",
      options: { defaultValue: "幅:" },
    },
    {
      type: "number",
      name: "WIDTH",
      options: { defaultValue: 512, min: 64, max: 2048, precision: 64 },
    },
    {
      type: "text",
      name: "HEIGHT_LABEL",
      options: { defaultValue: "高さ:" },
    },
    {
      type: "number",
      name: "HEIGHT",
      options: { defaultValue: 512, min: 64, max: 2048, precision: 64 },
    },
  ],
  colour: BLOCK_COLORS.SIZE,
  tooltip: "生成する画像の幅・高さを指定",
});

// 複数選択プロンプトブロック
Blockly.Blocks["multi_select_prompt"] = {
  init: function () {
    this.appendDummyInput().appendField("複数選択プロンプト");

    ["A", "B", "C"].forEach((key, index) => {
      this.appendDummyInput()
        .appendField(`選択${key}`)
        .appendField(
          new Blockly.FieldCheckbox(index === 0 ? "TRUE" : "FALSE"),
          `SELECT_${key}`
        )
        .appendField(new Blockly.FieldTextInput(`選択肢${key}`), `TEXT_${key}`);
    });

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BLOCK_COLORS.MULTI_SELECT);
    this.setTooltip("複数の選択肢をオン/オフで指定できる");
    this.setHelpUrl("");
  },
};
