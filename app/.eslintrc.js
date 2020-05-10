module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    rules: {
        "@typescript-eslint/explicit-function-return-type": 0, // 2
        "@typescript-eslint/no-unused-vars": 0, // 2
        "@typescript-eslint/ban-types": 0, // 2
        "prefer-const": 0, // 2
        "@typescript-eslint/no-empty-interface": 0, // 2
        "@typescript-eslint/ban-ts-ignore": 0, // 1
        "@typescript-eslint/no-use-before-define": 0, // 2
        "@typescript-eslint/no-non-null-assertion": 0, // 2
        "@typescript-eslint/no-empty-function": 0, // 2,
        "@typescript-eslint/consistent-type-assertions": 0, // 2
        "@typescript-eslint/no-inferrable-types": 0, // 2
        "@typescript-eslint/no-explicit-any": 0, // 1
        "@typescript-eslint/camelcase": 0, // 2
        "@typescript-eslint/no-var-requires": 0, // 2
        "prefer-rest-params": 0, // 2
        "@typescript-eslint/no-this-alias": 0, // 2
        "@typescript-eslint/no-array-constructor": 0, // 2
        "no-var": 0, // 2
        "prefer-spread": 0, // 2
        "@typescript-eslint/interface-name-prefix": 0, // 2
        "react/prop-types": 0, // 2
        'react/display-name': 1
    },
    ignorePatterns: ["**/*.html", "**/*.snap", "**/*.svg"],
    settings: {
        react: {
            version: "detect"
        }
    }
};
