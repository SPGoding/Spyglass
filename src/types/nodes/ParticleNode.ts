import { LintConfig } from '../Config'
import IdentityNode from './IdentityNode'
import { ToFormattedString } from '../Formattable'
import ArgumentNode, { NodeType, GetCodeActions, NodeRange } from './ArgumentNode'
import FunctionInfo from '../FunctionInfo'
import TextRange, { areOverlapped } from '../TextRange'
import { Diagnostic, CodeAction } from 'vscode-languageserver'

export default class ParticleNode<T extends ArgumentNode> extends ArgumentNode {
    readonly [NodeType] = 'Particle'

    constructor(
        public id: IdentityNode,
        public param?: T
    ) { super() }

    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: Diagnostic[]) {
        const ans: CodeAction[] = []
        if (areOverlapped(range, this.id[NodeRange])) {
            ans.push(...this.id[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        } else if (this.param && areOverlapped(range, this.param[NodeRange])) {
            ans.push(...this.param[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        }
        ans.push(...super[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        return ans
    }

    [ToFormattedString](lint: LintConfig) {
        return `${this.id[ToFormattedString](lint)}${this.param ? ` ${this.param[ToFormattedString](lint)}` : ''}`
    }
}
