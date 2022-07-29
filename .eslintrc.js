module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  env: {
    node: true,
    browser: true,
    amd: true,
  },
  rules: {
    "no-console": "off",
    "no-var-requires": "off",
    "@typescript-eslint/no-var-requires": "off",
  },
}
