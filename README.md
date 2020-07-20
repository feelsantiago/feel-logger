# Feel Logger

This is my default configuration for [winston logger](https://github.com/winstonjs/winston).

[![NPM](https://nodei.co/npm/feel-logger.png)](https://nodei.co/npm/feel-logger/)

## Table of contents

-   [Motivation](#motivation)
-   [Quick Start](#quick-start)
-   [Outpu Format](#outpu-format)
-   [Configuration](#configuration)
-   [Dynamic Initialization](#dynamic-initialization)
-   [Logger Interface](#logger-interface)
-   [Loggin Context](#loggin-context)
-   [Logger Instance](#logger-instance)
-   [Wisnton Instance](#wisnton-instance)

## Motivation

`Winston` is an incredible and versatile logging library. To simplify the configuration process and keep the logs consistent across projects, i decided to create this package to easily setup winston with my formats and configurations.

This package has two default transports: `Console` and `Dayle Rotate File`.

## Quick Start

You just need to import `Logger` and call the `init` method and a `Console` logger will be created.

```js
import { Logger } from 'feel-logger';

Logger.init();
Logger.info('My Awesome Logger!');
// output: 2020-07-12 13:43:05 [Application] INFO: My Awesome Logger!
```

To activate the `Daily Rotate File` just pass a `configuration object` to `init` method.

```js
import { Logger } from 'feel-logger';

Logger.init({ file: true });
Logger.info('My Awesome Logger!');
```

This will create a `/logs` folder in the project root and store there the logs files.

## Output Format

The output format is composed by a `timestamp`, a identifier `label`, the log `level`, the log `message` and the associated `metadata`.

```js
 YYYY-MM-DD HH:MM:SS [label] LEVEL: message Meta: ...
```

## Configuration

The configurations accepted by the Logger are:

| property        | type                              | default                        | description                               |
| --------------- | --------------------------------- | ------------------------------ | ----------------------------------------- |
| name            | string                            | Application                    | this will be the `label`                  |
| level           | string                            | info                           | the log level                             |
| exitOnError     | boolean                           | false                          |                                           |
| handleException | boolean                           | false                          |                                           |
| transports      | `Winston.Transports[]`            | `Console`, `Daily Rotate File` | custom transports to be add to the Logger |
| file            | boolean                           | false                          | active `Dayle Rotate File` transport      |
| fileOptions     | `DailyRotateFileTransportOptions` | null                           | overrides default transport options       |
| console         | `WinstonLoggerOptions`            | null                           | overrides default transport options       |

## Dynamic Initialization

To make the Logger instance `static` across the application you have to create a `logger.options` file. When the lib is loaded by node it will be search for a configuration file (.js or .ts) in the project. This dynamic initialization overrides `init` method.

```
    +-- root
    |   +-- src
    |   |   +-- configuration.options.[ts|js]
    |   +-- package.json
```

The configuration file accepts the same object as the `init` method, but make sure that your `logger.options.[ts|js]` is inside a `src` folder under the `root` directory and follow the conventions:

```js
/* logger.options.js */
module.exports = {
    file: true,
};
```

```js
/* logger.options.ts */
export default {
    file: true,
};
```

Now you can import `Logger` in any file and use without pass through injection.

```js
/* AccountController */
import { Logger } from 'feel-logger';

export class AwesomeClass {
    AwesomeMethod() {
        Logger.info('Awesome Method Called');
    }
}
```

## Logger Interface

The following is the methods for logging:

```js
interface LoggerOperations {
    log: (level: string, message: string) => void;
    info: (message: string, ...meta: unknown[]) => void;
    warning: (message: string, ...meta: unknown[]) => void;
    error: (message: string, ...meta: unknown[]) => void;
    debug: (message: string, ...meta: unknown[]) => void;
}
```

## Logging Context

If you want to add a context information to the output log you can pass a special metadata called `context` and it will be add to the `label` part of the log.

```js
import { Logger } from 'feel-logger';

Logger.info('My Awesome Logger', { context: 'MyContext' });
// output: 2020-07-12 14:42:29 [Application - MyContext] INFO: My Awesome Logger
```

## Logger Instance

If you initialize your `Logger` dynamically, you can create instances of the logger to set a default `context`.

```js
import { Logger } from 'feel-logger';

const logger = Logger.createLoggerInstance('MyDefaultContext');
logger.info('My Awesome Logger');
// output: 2020-07-12 14:47:31 [Application - MyDefaultContext] INFO: My Awesome Logger
```

You can pass a `class` type as well.

```js
import { Logger } from 'feel-logger';

export class MyAwesomeClass {
    logger = Logger.createLoggerInstance(MyAwesomeClass);

    log() {
        this.logger.info('My Awesome Logger');
    }
}

new MyAwesomeClass().log();
// output: 2020-07-12 14:47:31 [Application - MyAwesomeClass] INFO: My Awesome Logger
```

## Winston Instance

You can get the `winston` instance object by calling the method:

```js
import { Logger } from 'feel-logger';
const winston = Logger.getWinstonInstance();
```
