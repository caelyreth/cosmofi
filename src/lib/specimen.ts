export const source = [
  '// Cosmic color. Lo-fi feeling.',
  "import { starfield } from './palette'",
  '',
  'type Transmission = { origin: string; message: string }',
  '',
  'const signal: Transmission = {',
  "  origin: 'a quiet corner of the cosmos',",
  "  message: 'Still here. Still listening.'",
  '}',
  '',
  'function receive(source: Transmission) {',
  '  return { ...source, colors: starfield }',
  '}',
  '',
  'console.log(receive(signal))',
]

const patterns = [
  { pattern: /^\/\//, kind: 'comment' },
  { pattern: /^'/, kind: 'string' },
  {
    pattern: /^(import|from|type|const|function|return)$/,
    kind: 'keyword',
  },
  { pattern: /^(Transmission|string)$/, kind: 'type' },
  { pattern: /^(receive|log)$/, kind: 'function' },
]
export function highlight(line: string) {
  return line
    .split(
      /(\/\/.*|'[^']*'|\b(?:import|from|type|const|function|return|Transmission|string|receive|log)\b)/g,
    )
    .map((text) => ({
      text,
      kind: patterns.find(({ pattern }) => pattern.test(text))?.kind ?? '',
    }))
}
