// This module script .

import fs from 'fs'
import path from 'path'
import url from 'url'
import { McdocParserTestSuites } from './_suites.js'

// Generates test files for each mcdoc rule parser with test suites from `./_suites.js`.
// It is super laggy to have a giant snapshot file, hence why we separated the tests to multiple files.

/**
 * @param {string} parser
 * @param {string} directory
 * @returns {string}
 */
function template(parser, directory, functionParams = '') {
	return `// This file is generated by \`_generate.js\`. Do not modify by hand.
import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { ${parser} } from '@spyglassmc/mcdoc/lib/parser/index.js'
// @ts-expect-error
import { McdocParserTestSuites } from '@spyglassmc/mcdoc/test/parser/_suites.js'

describe('mcdoc ${parser}${functionParams ? '()' : ''}', () => {
	for (const content of McdocParserTestSuites['${directory}'].${parser}.content) {
		it(\`Parse "\${showWhitespaceGlyph(content)}"\`, () => {
			snapshot(testParser(${parser}${functionParams}, content))
		})
	}
})
`
}

for (const [directory, parserSuites] of Object.entries(McdocParserTestSuites)) {
	for (const [parser, { functionParams }] of Object.entries(parserSuites)) {
		fs.writeFileSync(
			path.join(url.fileURLToPath(new URL('.', import.meta.url)), directory, `${parser}.generated.spec.ts`),
			template(parser, directory, functionParams),
			{ encoding: 'utf-8' }
		)
	}
}
