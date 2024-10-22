import App from "../App.js";
import { MissionUtils } from "@woowacourse/mission-utils";

const mockQuestions = (answers) => {
  MissionUtils.Console.readLine = jest.fn();
  answers.reduce((acc, input) => {
    return acc.mockImplementationOnce((question, callback) => {
      callback(input);
    });
  }, MissionUtils.Console.readLine);
};

const mockRandomWord = (word) => {
  MissionUtils.Random.pickNumberInRange = jest.fn().mockReturnValueOnce(word);
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, "print");
  logSpy.mockClear();
  return logSpy;
};

describe("단어 퍼즐 게임", () => {
  test("게임에서 정답을 맞췄을 때 축하 메시지를 출력한다.", () => {
    const randomWord = "apple";
    const answers = ["ppale", "apple"];
    const logSpy = getLogSpy();
    const messages = ["정답이 아닙니다.", "정답입니다. 축하합니다."];

    mockRandomWord(randomWord);
    mockQuestions(answers);

    const app = new App();
    app.start();

    messages.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test("사용자가 시도 횟수를 초과했을 때 게임이 종료된다.", () => {
    const randomWord = "banana";
    const answers = ["nanaba", "banaba", "nabana"];
    const logSpy = getLogSpy();
    const messages = ["정답이 아닙니다.", "게임에서 패배했습니다."];

    mockRandomWord(randomWord);
    mockQuestions(answers);

    const app = new App();
    app.start();

    messages.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test("예외 테스트: 사용자 입력이 잘못된 형식일 때 에러 처리를 한다.", () => {
    const randomWord = "grape";
    const answers = ["grapess"];

    mockRandomWord(randomWord);
    mockQuestions(answers);

    expect(() => {
      const app = new App();
      app.start();
    }).toThrow();
  });
});
