/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * カテゴリーとブロック項目の定義
 */
const CATEGORIES = [
  {
    name: "フレーム",
    colour: "#5C81A6",
    blocks: ["image_generation"],
  },
  {
    name: "基本プロンプト",
    colour: "#5CA65C",
    icon: "💬",
    blocks: ["text_prompt", "theme_prompt", "negative_prompt"],
  },
  {
    name: "詳細設定",
    colour: "#A65CA6",
    blocks: ["keyword_emphasis", "entity_block", "bracket_decoration"],
  },
  {
    name: "スタイル設定",
    colour: "#A6835C",
    blocks: ["image_style", "color_palette", "multi_select_prompt", "img_size"],
  },
  {
    name: "構成",
    colour: "#5CA6A6",
    blocks: ["prompt_switch", "seed_setting"],
  },
];

/**
 * カテゴリー定義からツールボックスのコンテンツを生成
 */
const createToolboxCategory = (category) => ({
  kind: "category",
  name: category.name,
  colour: category.colour,
  icon: category.icon,
  expanded: category.expanded ?? false,
  contents: category.blocks.map((type) => ({
    kind: "block",
    type,
    shadow: false,
  })),
});

// ツールボックス構成をエクスポート
export const toolbox = {
  kind: "categoryToolbox",
  css: "toolbox-css",
  maxCategories: 100,
  contents: CATEGORIES.map(createToolboxCategory),
};
