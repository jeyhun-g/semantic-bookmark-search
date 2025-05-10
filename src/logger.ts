class Logger {
  private suppressedErrors: Record<string, boolean>

  constructor() {
    this.suppressedErrors = {}
    this.configureErrorLogging()
  }

  public suppressError(log: string) {
    this.suppressedErrors[log] = true
  }

  public unsuppressError(log: string) {
    delete this.suppressedErrors[log]
  }

  private configureErrorLogging() {
    const originalErrorLogger = console.error
    const suppressedErrors = this.suppressedErrors

    console.error = function (...args) {
      if (
        args.some(
          (arg) =>
            typeof arg === 'string' &&
          Object.keys(suppressedErrors).some(e => arg.includes(e))
        )
      ) {
        return;
      }
    
      originalErrorLogger.apply(console, args);
    };
  }
}


const logger = new Logger()

export { logger }