import * as LoggerLib from "./../../src/logger";

// Testable class with public constructor and methods
class TestLogger extends LoggerLib.Logger {
  constructor() {
    super()
  }

  configureErrorLogging() {
    super.configureErrorLogging()
  }
}

describe("Logger unit tests", () => {
  afterAll(() => {
    console.error = LoggerLib.consoleError
  })

  describe(".suppressError/unsuppressError", () => {
    let logger: TestLogger
    let consoleErrorSpy: jest.SpiedFunction<typeof LoggerLib.consoleError>
    
    beforeEach(() => {
      logger = new TestLogger()
      consoleErrorSpy = jest.spyOn(LoggerLib, 'consoleError')
    })
  
    test("should suppress errors and then unsuppress them", () => {
      const logToSuppress = "logToSuppress"
      logger.suppressError(logToSuppress)
      console.error("something")
      console.error(`something with ${logToSuppress}`)
  
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      consoleErrorSpy.mockReset()

      logger.unsuppressError(logToSuppress)
      console.error("something")
      console.error(`something with ${logToSuppress}`)
  
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2)
    });
  });
})

