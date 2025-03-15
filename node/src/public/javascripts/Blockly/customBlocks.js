// 複数の画像プロンプトやURLを設定するブロックを追加
Blockly.Blocks["text_prompt"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("テキストプロンプト")
      .appendField(new Blockly.FieldTextInput("自由入力"), "TEXT_INPUT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("自由に入力できるテキストプロンプト");
    this.setHelpUrl("");
  },
};

// テーマ選択ブロック (旧: sample_prompt)
Blockly.Blocks["theme_prompt"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("テーマ")
      .appendField(
        new Blockly.FieldDropdown([
          ["夕日", "美しい夕日の風景"],
          ["ビーチ", "静かなビーチの風景"],
          ["未来都市", "近未来的な都市の風景"],
          ["夜の街", "静寂で暗い街の風景"],
          ["宇宙", "壮大な宇宙の風景"],
          ["森の中", "神秘的な森の風景"],
        ]),
        "THEME"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(185);
    this.setTooltip("テーマから選択できるプロンプト");
    this.setHelpUrl("");
  },
};

// 画像生成という大枠ブロック (request_link を改名)
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
    this.setColour(120);
    this.setTooltip(
      "画像生成用の大枠。URLは送信先として利用し、PROMPTS内に各種プロンプトを入れる"
    );
    this.setHelpUrl("");
  },
};

// 複数のプロンプトを切り替えるブロック
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
    this.appendStatementInput("PROMPT1")
      .setCheck(null)
      .appendField("プロンプト1");
    this.appendStatementInput("PROMPT2")
      .setCheck(null)
      .appendField("プロンプト2");
    this.appendStatementInput("PROMPT3")
      .setCheck(null)
      .appendField("プロンプト3");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(265);
    this.setTooltip("複数のプロンプトを切り替える");
    this.setHelpUrl("");
  },
};

// 画像サイズ指定ブロック
Blockly.Blocks["img_size"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("画像サイズ")
      .appendField("幅:")
      .appendField(new Blockly.FieldNumber(512, 64, 2048, 64), "WIDTH")
      .appendField("高さ:")
      .appendField(new Blockly.FieldNumber(512, 64, 2048, 64), "HEIGHT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(190);
    this.setTooltip("生成する画像の幅・高さを指定");
    this.setHelpUrl("");
  },
};

// ネガティブプロンプトブロック
Blockly.Blocks["negative_prompt"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("ネガティブプロンプト")
      .appendField(new Blockly.FieldTextInput("不要な要素..."), "NEG_TEXT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip("生成から除外したい要素を記述");
    this.setHelpUrl("");
  },
};

// スタイル選択ブロック
Blockly.Blocks["image_style"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("スタイル")
      .appendField(
        new Blockly.FieldDropdown([
          ["リアル系", "REAL"],
          ["イラスト系", "ILLUST"],
          ["3D風", "THREED"],
          ["水彩画", "WATERCOLOR"],
        ]),
        "STYLE"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("画像の生成スタイルを選択");
    this.setHelpUrl("");
  },
};

// シード値設定ブロック
Blockly.Blocks["seed_setting"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("シード値")
      .appendField(new Blockly.FieldNumber(0, 0, 999999), "SEED");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
    this.setTooltip("画像生成の乱数シードを固定");
    this.setHelpUrl("");
  },
};

// キーワード強調ブロック - 入れ子構造対応に変更
Blockly.Blocks["keyword_emphasis"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("キーワード強調")
      .appendField(
        new Blockly.FieldDropdown([
          ["弱 (+)", "+"],
          ["中 (++)", "++"],
          ["強 (+++)", "+++"],
          ["最強 (++++)", "++++"],
        ]),
        "EMPHASIS"
      );
    this.appendStatementInput("KEYWORD_CONTENT") // 入れ子構造にする
      .setCheck(null)
      .appendField("強調内容");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("内部のブロックをまとめて強調します");
    this.setHelpUrl("");
  },
};

// エンティティ指定ブロック - 入れ子構造対応に変更
Blockly.Blocks["entity_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("エンティティ")
      .appendField(
        new Blockly.FieldDropdown([
          ["人物", "人物:"],
          ["背景", "背景:"],
          ["アイテム", "アイテム:"],
          ["時間", "時間:"],
          ["天気", "天気:"],
        ]),
        "ENTITY_TYPE"
      );
    this.appendStatementInput("ENTITY_CONTENT") // 入れ子構造にする
      .setCheck(null)
      .appendField("具体内容");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(130);
    this.setTooltip("人物、背景などのカテゴリごとに内容を指定");
    this.setHelpUrl("");
  },
};

// カラーパレットブロック - FieldColourをドロップダウンに変更
Blockly.Blocks["color_palette"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("カラーパレット")
      .appendField(
        new Blockly.FieldDropdown([
          ["赤", "red"],
          ["青", "blue"],
          ["緑", "green"],
          ["黄", "yellow"],
          ["紫", "purple"],
          ["橙", "orange"],
          ["黒", "black"],
          ["白", "white"],
        ]),
        "COLOR"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("色を指定して画像に反映させる");
    this.setHelpUrl("");
  },
};

// 括弧装飾ブロック - 入れ子構造対応に変更
Blockly.Blocks["bracket_decoration"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("括弧装飾")
      .appendField(
        new Blockly.FieldDropdown([
          ["括弧 ()", "()"],
          ["角括弧 []", "[]"],
          ["波括弧 {}", "{}"],
          ["山括弧 <>", "<>"],
        ]),
        "BRACKET_TYPE"
      );
    this.appendStatementInput("BRACKET_CONTENT") // 入れ子構造にする
      .setCheck(null)
      .appendField("内容");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("括弧内に他のプロンプトブロックを配置できます");
    this.setHelpUrl("");
  },
};

// 複数選択式プロンプトブロック
Blockly.Blocks["multi_select_prompt"] = {
  init: function () {
    this.appendDummyInput().appendField("複数選択プロンプト");
    this.appendDummyInput()
      .appendField("選択A")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "SELECT_A")
      .appendField(new Blockly.FieldTextInput("選択肢A"), "TEXT_A");
    this.appendDummyInput()
      .appendField("選択B")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "SELECT_B")
      .appendField(new Blockly.FieldTextInput("選択肢B"), "TEXT_B");
    this.appendDummyInput()
      .appendField("選択C")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "SELECT_C")
      .appendField(new Blockly.FieldTextInput("選択肢C"), "TEXT_C");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("複数の選択肢をオン/オフで指定できる");
    this.setHelpUrl("");
  },
};

// JavaScript ジェネレーター部分を削除またはコメントアウト
// Blockly.JavaScript["simple_text"] = function (block) {
//   var text = block.getFieldValue("TEXT");
//   return 'TEXT: "' + text + '"\n';
// };
