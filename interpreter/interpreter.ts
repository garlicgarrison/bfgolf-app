const TIMEOUT = 5000;
const TIMEOUT_ERROR = "timeout";
const INVALID_ERROR = "invalid code";

export class Interpreter {
  code: string;
  memory: number[];
  pointer: number;
  stack: number[];
  input: number[];
  output: number[];
  error: string | undefined;

  constructor() {
    this.code = "";
    this.memory = new Array(30000);
    this.memory.fill(0);
    this.pointer = 0;
    this.stack = [];

    this.input = [];
    this.output = [];
  }

  run(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      let timedOut = false;
      setTimeout(() => {
        timedOut = true;
        reject(new Error(TIMEOUT_ERROR));
      }, TIMEOUT);

      for (let i = 0; i < this.code.length && !timedOut; i++) {
        const c = this.code.charAt(i);
        switch (c) {
          case ">":
            this.pointer++;
            if (this.pointer === 30000) {
              this.pointer = 0;
              continue;
            }
            break;
          case "<":
            this.pointer--;
            if (this.pointer < 0) {
              this.pointer = 29999;
            }
            break;
          case "+": {
            const current = this.memory[this.pointer];
            if (current === 255) {
              this.memory[this.pointer] = 0;
              continue;
            }

            this.memory[this.pointer]++;
            break;
          }
          case "-": {
            const current = this.memory[this.pointer];
            if (current === 0) {
              this.memory[this.pointer] = 255;
              continue;
            }

            this.memory[this.pointer]--;
            break;
          }
          case ".":
            this.output.push(this.memory[this.pointer]);
            break;
          case ",":
            const ch = this.input.shift();
            if (ch) {
              this.memory[this.pointer] = ch;
            }
            break;
          case "[":
            // we first need to find where the close bracket is
            if (this.memory[this.pointer]) {
              this.stack.push(i);
            } else {
              let count = 0;
              while (!timedOut) {
                i++;
                const currentChar = this.code.charAt(i);
                if (!currentChar) break;
                if (currentChar === "[") count++;
                else if (currentChar === "]") {
                  if (count) count--;
                  else break;
                }
              }
            }
            break;
          case "]":
            const jumpTo = this.stack.pop();
            if (!jumpTo) reject(new Error(INVALID_ERROR));
            else {
              i = jumpTo - 1;
            }
            break;
          default:
            break;
        }
      }

      resolve(this.output);
    });
  }

  reset() {
    this.memory = new Array(30000);
    this.memory.fill(0);
    this.pointer = 0;
    this.stack = [];
    this.output = [];
  }

  changeCode(code: string) {
    this.code = code;
  }

  changeInput(input: string) {
    this.input = [];
    for (const c of input) {
      this.input.push(c.charCodeAt(0));
    }
  }
}
