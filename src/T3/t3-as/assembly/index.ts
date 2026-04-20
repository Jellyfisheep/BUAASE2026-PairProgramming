// T3: 道途之荆 - 博弈决策 AI
export function hanamikoji_action(history: string, cards: string, board: Int8Array): string {
  let tokens = history.length > 0 ? history.split(" ") : new Array<string>();
  
  // 1. 判断当前是否需要响应对方的赠与或竞争 (3或4行动且末尾无选择连字符)
  let needResponse = false;
  let lastToken = "";
  if (tokens.length > 0) {
    lastToken = tokens[tokens.length - 1];
    if ((lastToken.startsWith("3") || lastToken.startsWith("4")) && !lastToken.includes("-")) {
      needResponse = true;
    }
  }

  // 1.1 被动响应逻辑：无脑选择包含大牌/对自己有利的第一组
  if (needResponse) {
    if (lastToken.startsWith("3")) {
      return "-" + lastToken.charAt(1); // 选第一张
    } else {
      return "-" + lastToken.substring(1, 3); // 选前两张一组
    }
  }

  // 2. 主动行动逻辑
  // 计算这是我方的哪个回合
  let myTurnIndex = 0;
  if (tokens.length % 2 == 0) {
    myTurnIndex = 0; // 我方先手
  } else {
    myTurnIndex = 1; // 我方后手
  }

  // 记录我方已经使用过的行动 (1, 2, 3, 4)
  let used = new Set<string>();
  for (let i = myTurnIndex; i < tokens.length; i += 2) {
    used.add(tokens[i].charAt(0));
  }

  // 将手牌排序，A在前，G在后。小牌用于抛弃，大牌用于密约
  let cardsArr = cards.split("").sort();

  // 策略A：如果有2取舍没用，且有至少两张手牌，优先丢弃最小的两张牌
  if (!used.has("2") && cardsArr.length >= 2) {
    return "2" + cardsArr[0] + cardsArr[1];
  }

  // 策略B：如果有3赠送没用，拿出2张最小的牌和1张最大的牌让对面选
  if (!used.has("3") && cardsArr.length >= 3) {
    let large = cardsArr[cardsArr.length - 1];
    return "3" + cardsArr[0] + cardsArr[1] + large;
  }

  // 策略C：如果有4竞争没用，混搭最大的牌和最小的牌去恶心对手
  if (!used.has("4") && cardsArr.length >= 4) {
    return "4" + cardsArr[0] + cardsArr[cardsArr.length - 1] + cardsArr[1] + cardsArr[cardsArr.length - 2];
  }

  // 策略D：最后保留最大的牌用作1密约
  if (!used.has("1") && cardsArr.length >= 1) {
    return "1" + cardsArr[cardsArr.length - 1];
  }

  // Fallback保底，确保无论如何返回合法语义
  for (let action = 1; action <= 4; action++) {
    if (!used.has(action.toString())) {
      let res = action.toString();
      for (let j = 0; j < action && j < cardsArr.length; j++) {
        res += cardsArr[j];
      }
      return res;
    }
  }

  return "1" + cardsArr[0];
}