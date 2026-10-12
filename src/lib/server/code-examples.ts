import {
  codeToHtml,
  type ShjLanguageDefinition,
} from 'rangi/core'
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

import { cosmofiSyntaxTheme, type CodeExample } from '#lib/syntax'

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

const languages = {
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
}

const sources = [
  {
    id: 'ts',
    label: 'TS',
    name: 'TypeScript',
    file: 'reading.ts',
    source: `type Reading = {
  label: string
  value: number
}

const LIMIT = 100

/* Preserve the label while keeping
   the measurement within range. */
export function measure(input: Reading): Reading {
  const value = Math.min(input.value, LIMIT)

  return { label: 'normalized', value }
}

const result = measure({ label: 'source', value: 72 })`,
  },
  {
    id: 'cpp',
    label: 'C++',
    name: 'C++',
    file: 'reading.cpp',
    source: `#include <algorithm>
#include <string>

struct Reading {
  std::string label;
  double value;
};

constexpr double LIMIT = 100.0;

Reading measure(const Reading& input) {
  const double value = std::min(input.value, LIMIT);
  return {"normalized", value};
}

const auto result = measure({"source", 72.0});`,
  },
  {
    id: 'rs',
    label: 'Rust',
    name: 'Rust',
    file: 'reading.rs',
    source: `struct Reading {
  label: &'static str,
  value: f64,
}

const LIMIT: f64 = 100.0;

fn measure(input: &Reading) -> Reading {
  Reading {
    label: "normalized",
    value: input.value.min(LIMIT),
  }
}

fn main() {
  let input = Reading { label: "source", value: 72.0 };
  let result = measure(&input);
}`,
  },
  {
    id: 'swift',
    label: 'Swift',
    name: 'Swift',
    file: 'Reading.swift',
    source: `struct Reading {
  let label: String
  let value: Double
}

let LIMIT: Double = 100.0

func measure(_ input: Reading) -> Reading {
  let value = min(input.value, LIMIT)

  return Reading(label: "normalized", value: value)
}

let input = Reading(label: "source", value: 72.0)
let result = measure(input)`,
  },
] as const

export const codeExamples: CodeExample[] = sources.map(
  ({ source, ...example }) => ({
    ...example,
    html: codeToHtml(source, {
      lang: example.id,
      languages,
      theme: cosmofiSyntaxTheme,
    }),
  }),
)
