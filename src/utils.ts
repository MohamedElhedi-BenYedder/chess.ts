import { BLACK, WHITE, SQUARES } from './constants'
import { Color, FlagKey, Piece, PieceSymbol, Square } from './interfaces/types'

/**
 * Extracts the zero-based rank of an 0x88 square.
 * @public
 */
export function rank(i: number): number {
  return i >> 4
}

/**
 * Extracts the zero-based file of an 0x88 square.
 * @public
 */
export function file(i: number): number {
  return i & 15
}

/**
 * Converts a 0x88 square to algebraic notation.
 * @public
 */
export function algebraic(i: number): Square | undefined {
  const f = file(i)
  const r = rank(i)
  return toSquare(
    'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1),
  )
}

/**
 * Returns the opposite color.
 */
export function swapColor(c: Color): Color {
  return c === WHITE ? BLACK : WHITE
}

/**
 * Checks if a character is a numeric digit.
 */
export function isDigit(c: string): boolean {
  return /^[0-9]$/.test(c)
}

/**
 * Returns the ASCII symbol for each piece.  White pieces are in uppercase,
 * black in lowercase.
 */
export function symbol({ type, color }: Piece): string {
  return color === WHITE ? type.toUpperCase() : type.toLowerCase()
}

/** @public */
export function isColor(color: string): color is Color {
  return color === 'w' || color === 'b'
}

/** @public */
export function isPieceSymbol(symbol: string): symbol is PieceSymbol {
  return /^[pnbrqk]$/.test(symbol)
}

export function toPieceSymbol(obj: unknown): PieceSymbol | undefined {
  if (typeof obj == 'string') {
    const str = obj.toLowerCase()
    if (isPieceSymbol(str)) return str
  }
  return
}

/** @public */
export function isSquare(sq: string): sq is Square {
  return /^[a-h][1-8]$/.test(sq)
}

export function toSquare(obj: unknown): Square | undefined {
  if (typeof obj == 'string') {
    const str = obj.toLowerCase()
    if (isSquare(str)) return str
  }
  return
}

export function bitToSquare(sq: number): number {
  return (sq & 7) + 16 * (sq >> 3)
}

export function isFlagKey(key: string): key is FlagKey {
  const keys = [
    'NORMAL',
    'CAPTURE',
    'BIG_PAWN',
    'EP_CAPTURE',
    'PROMOTION',
    'KSIDE_CASTLE',
    'QSIDE_CASTLE',
  ]
  return keys.indexOf(key) !== -1
}

export function isDefined<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false
  return true
}

export function splitStr(str: string, char: string): string[] {
  const index = str.indexOf(char)
  if (index === -1) return []
  return [str.slice(0, index), str.slice(index)]
}
