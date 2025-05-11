export const consoleError = console.error
export class Logger {
  private static instance: Logger
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

  protected configureErrorLogging() {
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
    
      consoleError.apply(console, args);
    };
  }

  public static init() {
    if (!this.instance) {
      this.instance = new Logger()
    }

    return this.instance
  }
}