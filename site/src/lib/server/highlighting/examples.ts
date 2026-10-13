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

function renderExample<Id extends LanguageId>(id: Id): CodeExample<Id> {
  return {
    ...languageById[id],
    html: codeToHtml(sources[id], {
      lang: id,
      languages: grammars,
      theme: cosmofiSyntaxTheme,
    }),
  }
}

export const codeExamples = {
  ts: renderExample('ts'),
  cpp: renderExample('cpp'),
  rs: renderExample('rs'),
  swift: renderExample('swift'),
} satisfies CodeExamples
