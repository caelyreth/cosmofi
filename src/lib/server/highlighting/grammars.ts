import type { ShjLanguageDefinition, ShjLanguages } from 'rangi/core'
import {
  cpp,
  js,
  js_template_literals,
  jsdoc,
  regex,
  rs,
  swift,
  todo,
  ts,
} from 'rangi/languages'

import type { LanguageId } from '#lib/introduction/code'

// Rangi groups constants with numbers or classes, and some types with keywords.
// Its grammar API lets those roles stay distinct without processing raw tokens.
function withSyntaxRoles(
  grammar: ShjLanguageDefinition,
  primitiveTypes: RegExp,
): ShjLanguageDefinition {
  return [
    [/\b(?:[A-Z][A-Z0-9_]*|true|false|null|nullptr|undefined|nil)\b/g, 'bool'],
    [primitiveTypes, 'type'],
    [/\b[A-Z][\w]*(?=\s*\()/g, 'class'],
    [/=>|[{}()[\],.;:]/g, 'bracket'],
    ...grammar,
  ]
}

export const grammars = {
  ts: withSyntaxRoles(
    ts,
    /\b(?:any|boolean|never|number|object|string|unknown|void)\b/g,
  ),
  cpp: withSyntaxRoles(
    cpp,
    /\b(?:bool|char|char8_t|char16_t|char32_t|double|float|int|long|short|size_t|string|void|wchar_t)\b/g,
  ),
  rs: withSyntaxRoles(
    rs,
    /\b(?:bool|char|f32|f64|i8|i16|i32|i64|i128|isize|str|u8|u16|u32|u64|u128|usize)\b/g,
  ),
  swift: withSyntaxRoles(swift, /\b(?:Any|Self)\b/g),
  js,
  js_template_literals,
  jsdoc,
  regex,
  todo,
} satisfies ShjLanguages & Record<LanguageId, ShjLanguageDefinition>
