const scrambled = require("scrambled");

function generateScrambleAndCubeState() {
  // Generate a scramble for the 3x3 Rubik's Cube
  // If the following line does not work, try pasting the following into terminal:
  // npm i --save scrambled
  const result = scrambled.generateScrambleSync(30); // Generate a scramble with 30 moves
  console.log(result.scramble);
}

generateScrambleAndCubeState();
