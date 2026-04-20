// T1: 七色之缨 - 胜负判定
export function hanamikoji_judge(board: Int8Array, round: i8): i8 {
  let p1Score: i32 = 0;
  let p2Score: i32 = 0;
  let p1Count: i32 = 0;
  let p2Count: i32 = 0;

  const scores: i32[] = [2, 2, 2, 3, 3, 4, 5];

  for (let i = 0; i < 7; i++) {
    if (board[i] == 1) {
      p1Score += scores[i];
      p1Count++;
    } else if (board[i] == -1) {
      p2Score += scores[i];
      p2Count++;
    }
  }

  // 1. 绝对分值胜利条件
  if (p1Score >= 11) return 1;
  if (p2Score >= 11) return -1;

  // 2. 数量胜利条件 (前提是对方没有达到11分)
  if (p1Count >= 4 && p2Score < 11) return 1;
  if (p2Count >= 4 && p1Score < 11) return -1;

  // 3. 前两小轮结束时尚未满足胜利条件，继续游戏
  if (round < 3) return 0;

  // 4. 第三小轮结束，总分高者获胜
  if (p1Score > p2Score) return 1;
  if (p2Score > p1Score) return -1;

  // 5. 第三小轮总分相同，看最高档位
  if (board[6] != 0) return board[6]; // G
  if (board[5] != 0) return board[5]; // F

  let p1De = (board[3] == 1 || board[4] == 1); // D, E
  let p2De = (board[3] == -1 || board[4] == -1);
  if (p1De && !p2De) return 1;
  if (p2De && !p1De) return -1;

  let p1Abc = (board[0] == 1 || board[1] == 1 || board[2] == 1); // A, B, C
  let p2Abc = (board[0] == -1 || board[1] == -1 || board[2] == -1);
  if (p1Abc && !p2Abc) return 1;
  if (p2Abc && !p1Abc) return -1;

  // 6. 彻底平局
  return 2;
}