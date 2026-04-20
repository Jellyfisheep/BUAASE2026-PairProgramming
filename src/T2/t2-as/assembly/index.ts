// T2: 不祥之影 - 当前状态计算
export function calc_current_state(history: string, board: Int8Array): Int8Array {
  let p1Area = new Int8Array(7);
  let p2Area = new Int8Array(7);
  let newBoard = new Int8Array(7);

  // 复制上一轮的标记状态
  for (let i = 0; i < 7; i++) {
    newBoard[i] = board[i];
  }

  if (history.length > 0) {
    let tokens = history.split(" ");
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      if (token.length == 0) continue;
      
      // 偶数索引是 P1 的回合，奇数索引是 P2 的回合
      let isP1Turn = (i % 2 == 0);
      let actorArea = isP1Turn ? p1Area : p2Area;
      let oppArea = isP1Turn ? p2Area : p1Area;

      let type = token.charAt(0);
      if (type == '1') {
        let cardStr = token.substring(1);
        if (cardStr != "X") {
          let card = cardStr.charCodeAt(0) - 65; // 'A' 是 65
          if (card >= 0 && card < 7) {
            actorArea[card]++;
          }
        }
      } else if (type == '2') {
        // 取舍行动，被丢弃的牌不进入场面
      } else if (type == '3') {
        let parts = token.split("-");
        let offer = parts[0].substring(1);
        let choice = parts.length > 1 ? parts[1] : "";
        if (choice.length > 0) {
          // 对手获得选择的牌
          for (let j = 0; j < choice.length; j++) {
            oppArea[choice.charCodeAt(j) - 65]++;
          }
          // 行动方获得剩下的牌
          let offerArr = offer.split("");
          for (let j = 0; j < choice.length; j++) {
            let idx = offerArr.indexOf(choice.charAt(j));
            if (idx != -1) offerArr.splice(idx, 1);
          }
          for (let j = 0; j < offerArr.length; j++) {
            actorArea[offerArr[j].charCodeAt(0) - 65]++;
          }
        }
      } else if (type == '4') {
        let parts = token.split("-");
        let offer = parts[0].substring(1);
        let choice = parts.length > 1 ? parts[1] : "";
        if (choice.length > 0 && offer.length == 4) {
          let left = offer.substring(0, 2);
          let right = offer.substring(2, 4);
          
          let leftSorted = left.split("").sort().join("");
          let choiceSorted = choice.split("").sort().join("");
          
          let remain = (choiceSorted == leftSorted) ? right : left;
          
          for (let j = 0; j < choice.length; j++) {
            oppArea[choice.charCodeAt(j) - 65]++;
          }
          for (let j = 0; j < remain.length; j++) {
            actorArea[remain.charCodeAt(j) - 65]++;
          }
        }
      }
    }
  }

  // 根据当前局面上的牌数更新倾向
  for (let i = 0; i < 7; i++) {
    if (p1Area[i] > p2Area[i]) {
      newBoard[i] = 1;
    } else if (p1Area[i] < p2Area[i]) {
      newBoard[i] = -1;
    }
  }

  // AS的二维数组传出比较麻烦，测试脚本提供了一维数组支持 (长度21)
  let res = new Int8Array(21);
  for(let i = 0; i < 7; i++) res[i] = p1Area[i];
  for(let i = 0; i < 7; i++) res[7 + i] = p2Area[i];
  for(let i = 0; i < 7; i++) res[14 + i] = newBoard[i];
  return res;
}