/**
 * 空のツールボックス構成
 * ツールボックス非表示時に使用する
 */
export const emptyToolbox = {
  kind: "categoryToolbox",
  css: "toolbox-css",
  maxCategories: 100,
  contents: [
    {
      kind: "category",
      name: "",
      colour: "#ffffff",
      contents: [],
    },
  ],
};
