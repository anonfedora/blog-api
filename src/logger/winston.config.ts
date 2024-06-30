import * as winston from "winston";
import "winston-daily-rotate-file";
import * as SlackHook from "winston-slack-webhook-transport";
import * as winstonMongoDB from "winston-mongodb";

//  Create transports instance
const transports = [];

// Create and export the logger instance
export const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports
});

new winston.transports.Console({
    format: winston.format.combine(
      // Add a timestamp to the console logs
      winston.format.timestamp(),
      // Add colors to you logs
      winston.format.colorize(),
      // What the details you need as logs
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
      }),
    ),
  })
  
  new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  })
  
  new SlackHook({
    webhookUrl: 'https://hooks.slack.com/services/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',
    channel: '#logs',
    username: 'LoggerBot',
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(), // Add a timestamp to Slack logs
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
      }),
    ),
  })
  
  /* new winstonMongoDB.MongoDB({
    level: 'info',
    db: 'mongodb://localhost:27017/your-database-name',
    options: {
      useUnifiedTopology: true,
    },
    collection: 'logs',
    format: winston.format.combine(
      winston.format.timestamp(), // Add a timestamp to MongoDB logs
      winston.format.json(), // Use JSON format for MongoDB logs
    ),
  }),*/
  