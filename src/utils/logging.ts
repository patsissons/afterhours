type Loggers = Pick<Console, 'error' | 'warn' | 'info' | 'debug' | 'log'>
type LogLevel = keyof Loggers

const consoleLoggers: Loggers = console

function write<T extends LogLevel>(
  level: T,
  message: any,
  ...optionalParams: any[]
) {
  consoleLoggers[level](message, ...optionalParams)
}

function wrap(level: LogLevel) {
  return (message: any, ...optionalParams: any[]) => {
    return write(level, message, ...optionalParams)
  }
}

export const logging = {
  error: wrap('error'),
  warn: wrap('warn'),
  info: wrap('info'),
  debug: wrap('debug'),
  log: wrap('log'),
}
