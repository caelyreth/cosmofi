import { codeToHtml } from 'rangi/core'

import {
  languageById,
  type CodeExample,
  type CodeExamples,
  type LanguageId,
} from '#lib/introduction/code'

import { grammars } from './grammars'
import { cosmofiSyntaxTheme } from './theme'

const sources = {
  ts: `type Reading = {
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

  cpp: `#include <algorithm>
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

  rs: `struct Reading {
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

  swift: `struct Reading {
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
} as const satisfies Readonly<Record<LanguageId, string>>

const syntaxVariables = [
  ['#1A1A1A', 'var(--panel)'],
  ['#C1BFB3', 'var(--syntax-variable)'],
  ['#DC8789', 'var(--syntax-keyword)'],
  ['#77766D', 'var(--syntax-punctuation)'],
  ['#BD9976', 'var(--syntax-type)'],
  ['#A19EC2', 'var(--syntax-function)'],
  ['#A0A77B', 'var(--syntax-string)'],
  ['#539579', 'var(--syntax-constant)'],
  ['#92918B', 'var(--syntax-comment)'],
] as const

function themedHtml(html: string) {
  let next = html.replaceAll('color-scheme:dark', 'color-scheme:inherit')

  for (const [color, token] of syntaxVariables) {
    next = next.replaceAll(color, token)
    next = next.replaceAll(color.toLowerCase(), token)
  }

  return next
}

function renderExample<Id extends LanguageId>(id: Id): CodeExample<Id> {
  return {
    ...languageById[id],
    html: themedHtml(
      codeToHtml(sources[id], {
        lang: id,
        languages: grammars,
        theme: cosmofiSyntaxTheme,
      }),
    ),
  }
}

export const codeExamples = {
  ts: renderExample('ts'),
  cpp: renderExample('cpp'),
  rs: renderExample('rs'),
  swift: renderExample('swift'),
} satisfies CodeExamples
