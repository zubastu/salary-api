module.exports = {
  root: true,
  ignorePatterns: ["dist/**", "node_modules/**", "*.log"],
  overrides: [
    {
      files: ["**/*.ts"],
      env: { es2021: true, node: true },
      parser: "@typescript-eslint/parser",
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
      plugins: ["@typescript-eslint"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
      },
    },
  ],
};
