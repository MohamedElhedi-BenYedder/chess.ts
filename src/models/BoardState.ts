import {
  Board,
  ColorState,
  Color,
  PieceSymbol,
  Square,
  BitState,
  Move,
  HexMove,
} from '../interfaces/types'
import { fromBitBoard, toBitBoard } from '../board'
import { BITS, EMPTY, WHITE } from '../constants'
import { hexToMove, generateMoves, getFen, moveToSan } from '../move'
import { bitToSquare, getBitIndices, squareToBit } from '../utils'

/** @public */
export class BoardState {
  board: Board
  kings: ColorState
  turn: Color
  castling: ColorState
  ep_square: number
  half_moves: number
  move_number: number

  constructor(
    board?: Board,
    kings?: ColorState,
    turn?: Color,
    castling?: ColorState,
    ep_square?: number,
    half_moves?: number,
    move_number?: number,
  ) {
    this.board = board || new Array(128)
    this.kings = kings || { w: EMPTY, b: EMPTY }
    this.turn = turn || WHITE
    this.castling = castling || { w: 0, b: 0 }
    this.ep_square = ep_square || EMPTY
    this.half_moves = half_moves || 0
    this.move_number = move_number || 1
  }

  public get fen(): string {
    return getFen(this)
  }

  public static fromBitState({
    board,
    castling,
    turn,
    ep_square,
    half_moves,
    move_number,
  }: BitState): BoardState {
    return new BoardState(
      fromBitBoard(board),
      {
        w: bitToSquare(getBitIndices(board.w.k, true)[0]),
        b: bitToSquare(getBitIndices(board.b.k, true)[0]),
      },
      turn,
      {
        w:
          ((castling >> 3) & 1) * BITS.KSIDE_CASTLE +
          ((castling >> 2) & 1) * BITS.QSIDE_CASTLE,
        b:
          ((castling >> 1) & 1) * BITS.KSIDE_CASTLE +
          (castling & 1) * BITS.QSIDE_CASTLE,
      },
      bitToSquare(ep_square),
      half_moves,
      move_number,
    )
  }

  public toBitState(): BitState {
    return {
      board: toBitBoard(this.board),
      turn: this.turn,
      ep_square: squareToBit(this.ep_square),
      half_moves: this.half_moves,
      move_number: this.move_number,
      castling:
        (+!!(BITS.KSIDE_CASTLE & this.castling.w) << 3) +
        (+!!(BITS.QSIDE_CASTLE & this.castling.w) << 2) +
        (+!!(BITS.KSIDE_CASTLE & this.castling.b) << 1) +
        +!!(BITS.QSIDE_CASTLE & this.castling.b),
    }
  }

  public clone(): BoardState {
    return new BoardState(
      this.board.slice(),
      {
        w: this.kings.w,
        b: this.kings.b,
      },
      this.turn,
      {
        w: this.castling.w,
        b: this.castling.b,
      },
      this.ep_square,
      this.half_moves,
      this.move_number,
    )
  }

  public generateMoves(
    options: {
      legal?: boolean
      piece?: PieceSymbol
      from?: Square | number
      to?: Square | number
    } = {},
  ) {
    return generateMoves(this, options)
  }

  public toMove(hexMove: Readonly<HexMove>): Move {
    return hexToMove(this, hexMove)
  }

  public toSan(
    hexMove: Readonly<HexMove>,
    moves: HexMove[] = this.generateMoves({ piece: hexMove.piece }),
    options: { addPromotion?: boolean } = {},
  ): string {
    return moveToSan(this, hexMove, moves, options)
  }
}
