/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

export const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "フレーム",
      categorystyle: "frame_category",
      contents: [
        {
          kind: "block",
          type: "image_generation",
        },
      ],
    },
    {
      kind: "category",
      name: "基本プロンプト",
      categorystyle: "prompt_category",
      contents: [
        {
          kind: "block",
          type: "text_prompt",
        },
        {
          kind: "block",
          type: "theme_prompt",
        },
        {
          kind: "block",
          type: "negative_prompt",
        },
      ],
    },
    {
      kind: "category",
      name: "高度なプロンプト",
      categorystyle: "advanced_category",
      contents: [
        {
          kind: "block",
          type: "keyword_emphasis",
        },
        {
          kind: "block",
          type: "entity_block",
        },
        {
          kind: "block",
          type: "bracket_decoration",
        },
        {
          kind: "block",
          type: "multi_select_prompt",
        },
        {
          kind: "block",
          type: "color_palette",
        },
      ],
    },
    {
      kind: "category",
      name: "切り替え",
      categorystyle: "switch_category",
      contents: [
        {
          kind: "block",
          type: "prompt_switch",
        },
      ],
    },
    {
      kind: "category",
      name: "スタイル",
      categorystyle: "style_category",
      contents: [
        {
          kind: "block",
          type: "image_style",
        },
      ],
    },
  ],
  categoryStyles: {
    frame_category: { colour: "#5CA699" },
    prompt_category: { colour: "#5BA58C" },
    advanced_category: { colour: "#995BA5" },
    switch_category: { colour: "#A55B66" },
    style_category: { colour: "#5B8CA5" },
  },
};
