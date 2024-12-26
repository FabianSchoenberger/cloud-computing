import ts_parser from "@typescript-eslint/parser"
import plugin_import from "eslint-plugin-import"
import svelte from "eslint-plugin-svelte"
import svelte_parser from "svelte-eslint-parser"
import ts from "typescript-eslint"

const plugins = {
	"import": plugin_import
}

const import_rules = {
	"import/order": [
		"error",
		{
			"newlines-between": "always",
			"alphabetize": {
				"order": "asc"
			}
		}
	],
	"sort-imports": [
		"error",
		{
			"ignoreDeclarationSort": true
		}
	]
}
const svelte_rules = {
	"svelte/no-at-html-tags": "off"
}
const rules = {
	...import_rules,
	...svelte_rules
}

const config = [
	...ts.configs.strict,
	...ts.configs.stylistic,
	...svelte.configs["flat/recommended"],
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parser: svelte_parser,
			parserOptions: {
				parser: ts_parser
			}
		}
	},

	{plugins, rules}
]

export default config;
