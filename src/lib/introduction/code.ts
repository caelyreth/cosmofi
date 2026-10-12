export const languages = [
  { id: 'ts', label: 'TS', name: 'TypeScript', file: 'reading.ts' },
  { id: 'cpp', label: 'C++', name: 'C++', file: 'reading.cpp' },
  { id: 'rs', label: 'Rust', name: 'Rust', file: 'reading.rs' },
  { id: 'swift', label: 'Swift', name: 'Swift', file: 'Reading.swift' },
] as const

export type Language = (typeof languages)[number]
export type LanguageId = Language['id']

type LanguageById = { readonly [Item in Language as Item['id']]: Item }

export type CodeExample<Id extends LanguageId = LanguageId> =
  LanguageById[Id] & { readonly html: string }

export type CodeExamples = {
  readonly [Id in LanguageId]: CodeExample<Id>
}

export const languageById = Object.fromEntries(
  languages.map((language) => [language.id, language]),
) as LanguageById
