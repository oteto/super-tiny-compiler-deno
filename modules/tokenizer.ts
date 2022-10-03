export const TOKEN = {
  PAREN: "paren",
  NUMBER: "number",
  STRING: "string",
  IDENT: "ident",
} as const;

type TokenType = typeof TOKEN[keyof typeof TOKEN];

export type Token = {
  type: TokenType;
  value: string;
};

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let currentPosition = 0;

  while (currentPosition < input.length) {
    // unicode 文字は考慮しない
    let char = input[currentPosition];

    // rapen '(' or ')'
    if (RegExpParen.test(char)) {
      tokens.push({ type: TOKEN.PAREN, value: char });
      currentPosition += 1;
      continue;
    }

    // space, tab, wrap
    if (RegExpWhiteSpace.test(char)) {
      currentPosition += 1;
      continue;
    }

    // number
    if (RegExpNumber.test(char)) {
      let value = "";
      while (RegExpNumber.test(char)) {
        value += char;
        currentPosition += 1;
        char = input[currentPosition];
      }
      tokens.push({ type: TOKEN.NUMBER, value });
      continue;
    }

    // string double quotes
    if (RegExpStringDoubleQuotes.test(char)) {
      // ダブルクォートの次から読んでいく
      currentPosition += 1;
      char = input[currentPosition];
      let value = "";
      // 閉じのダブルクォートまで読む
      while (!RegExpStringDoubleQuotes.test(char)) {
        value += char;
        currentPosition += 1;
        char = input[currentPosition];
      }
      currentPosition += 1;
      tokens.push({ type: TOKEN.STRING, value });
      continue;
    }

    // identifier
    if (RegExpIdentifier.test(char)) {
      let value = "";
      while (RegExpIdentifier.test(char)) {
        value += char;
        currentPosition += 1;
        char = input[currentPosition];
      }
      tokens.push({ type: TOKEN.IDENT, value });
      continue;
    }
  }

  return tokens;
}

const RegExpParen = /[\(\)]/;

const RegExpWhiteSpace = /[\s]/;

const RegExpNumber = /\d/;

const RegExpStringDoubleQuotes = /["]/;

const RegExpIdentifier = /[a-z]/i;
