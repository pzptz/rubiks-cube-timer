import * as Crypto from "expo-crypto";
import seedrandom = require("seedrandom");

const turnMoves = ["R", "U", "L", "D", "F", "B"];

export interface Scramble {
  /**
   * Moves of the scramble.
   */
  scrambleMoves: string[];

  /**
   * The scramble itself.
   */
  scramble: string;

  /**
   * The token to verify the scramble.
   */
  token: string;

  /**
   * The size of the Rubik's cube the scramble is for.
   */
  size: number;
}

/**
 * Generates a scramble for the designated size of cube.
 * @param count the amount of moves in the scramble
 * @param size size of the cube to scramble
 * @param hash the (optional) seed to use to generate the scramble
 * @returns the generated scramble
 */
export function generateScrambleSync(
  count: number,
  size: number = 3,
  hash?: string
): Scramble {
  if (!hash) hash = Crypto.getRandomBytes(32).toString();

  let hasDone = [];

  let scramble = [];

  for (let i = 0; i < count * 3; i += 3) {
    var move =
      turnMoves[Math.floor(seedrandom(hash + i).quick() * turnMoves.length)];

    let y = 0;

    while (hasDone.includes(move)) {
      y++;
      move =
        turnMoves[
          Math.floor(
            seedrandom(hash + parseInt(i.toString() + y)).quick() *
              turnMoves.length
          )
        ];
    }

    if (move == "U" || move == "D" || move == "F") {
      delete hasDone[hasDone.indexOf("R")];
      delete hasDone[hasDone.indexOf("L")];
    } else if (move == "R" || move == "L") {
      delete hasDone[hasDone.indexOf("U")];
      delete hasDone[hasDone.indexOf("D")];
      delete hasDone[hasDone.indexOf("F")];
    }

    if (!hasDone.includes(move)) {
      hasDone.push(move);
    }

    let isPrime = Math.floor(seedrandom(hash + i + 1).quick() * 1.5);
    let is2 = Math.floor(seedrandom(hash + i + 2).quick() * 2);

    if (size > 3) {
      let isSlice = Math.floor(
        seedrandom(hash + i + 3).quick() * (size - 2 + 1)
      );
      if (isSlice > 2) move = isSlice.toString() + move + "w";
      else if (isSlice == 2) move = move + "w";
    }

    if (isPrime) move += "'";
    else if (is2) move += "2";

    scramble.push(move);
  }

  return {
    scrambleMoves: scramble,
    scramble: scramble.join(" "),
    token: hash,
    size: count,
  };
}

/**
 * Compares the token to the scramble to see if it was generated using Scrambled.
 * @param token the seed/hash used to generate the seed
 * @param scramble the scramble to verify
 * @param count the moves in the scramble
 * @param size size of the cube
 * @returns the result, true or false
 */
export function verifyScrambleSync(
  token: string,
  scramble: string,
  count: number,
  size: number = 3
): boolean {
  let toVerifyWith = generateScrambleSync(count, size, token);

  return toVerifyWith.scramble == scramble;
}

/**
 * Generates a scramble for the designated size of cube.
 * @param count the amount of moves in the scramble
 * @param size size of the cube to scramble
 * @param hash the (optional) seed to use to generate the scramble
 * @returns the generated scramble
 */
export async function generateScramble(
  count: number,
  size: number = 3,
  hash?: string
): Promise<Scramble> {
  return generateScramble(count, size, hash);
}

/**
 * Compares the token to the scramble to see if it was generated using Scrambled.
 * @param token the seed/hash used to generate the seed
 * @param scramble the scramble to verify
 * @param count the moves in the scramble
 * @param size size of the cube
 * @returns the result, true or false
 */
export async function verifyScramble(
  token: string,
  scramble: string,
  count: number,
  size: number = 3
): Promise<boolean> {
  return verifyScrambleSync(token, scramble, count, size);
}
