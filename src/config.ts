import dotenv from 'dotenv';

import { ServerOptions } from './types/ServerOptions';

// Loading is optional; deployment environment variables keep precedence.
dotenv.config({ override: false });
const env = process.env;

function envNumber(name: string, fallback: number): number {
  const value = env[name];
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default {
  secretKey: env.SECRET_KEY || 'THISISMYSECURETOKEN',
  host: env.HOST || 'http://localhost',
  port: env.PORT || '21465',
  deviceName: 'WppConnect',
  poweredBy: 'WPPConnect-Server',
  startAllSession: true,
  tokenStoreType: env.TOKEN_STORE_TYPE || 'file',
  maxListeners: envNumber('MAX_LISTENERS', 15),
  customUserDataDir: env.CUSTOM_USER_DATA_DIR || './userDataDir/',
  webhook: {
    url: env.WEBHOOK_URL || null,
    allowedUrls: (env.WEBHOOK_ALLOWED_URLS || '')
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean),
    autoDownload: true,
    retryAttempts: envNumber('WEBHOOK_RETRY_ATTEMPTS', 3),
    retryDelay: envNumber('WEBHOOK_RETRY_DELAY', 5000),
    requestTimeout: envNumber('WEBHOOK_REQUEST_TIMEOUT', 30000),
    // Bytes; media larger than this is not inlined as base64 (0 = no limit).
    autoDownloadMaxSize: envNumber('WEBHOOK_AUTO_DOWNLOAD_MAX_SIZE', 0),
    uploadS3: false,
    readMessage: true,
    allUnreadOnStart: false,
    listenAcks: true,
    onPresenceChanged: true,
    onParticipantsChanged: true,
    onReactionMessage: true,
    onPollResponse: true,
    onRevokedMessage: true,
    onLabelUpdated: true,
    onSelfMessage: false,
    ignore: ['status@broadcast'],
  },
  websocket: {
    autoDownload: false,
    uploadS3: false,
  },
  chatwoot: {
    allowedUrls: (env.CHATWOOT_ALLOWED_URLS || '')
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean),
    sendQrCode: true,
    sendStatus: true,
  },
  archive: {
    enable: false,
    waitTime: 10,
    daysToArchive: 45,
  },
  log: {
    // Upstream ships 'silly' for bug reports; on a shared host that writes a
    // line per WhatsApp event and fills the disk. Raise it only to debug.
    level: env.LOG_LEVEL || 'info',
    logger: (env.LOG_OUTPUT || 'console')
      .split(',')
      .map((output) => output.trim())
      .filter(Boolean),
  },
  createOptions: {
    browserArgs: [
      '--disable-web-security',
      '--no-sandbox',
      '--disable-web-security',
      '--aggressive-cache-discard',
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache',
      '--disk-cache-size=0',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-translate',
      '--hide-scrollbars',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-first-run',
      '--safebrowsing-disable-auto-update',
      '--ignore-certificate-errors',
      '--ignore-ssl-errors',
      '--ignore-certificate-errors-spki-list',
    ],
    // An empty list, unlike null, keeps wa-js from falling back to its three
    // public preview servers: generating a preview sends the link a client was
    // given to a third party. Previews are then simply absent.
    // Own server: https://github.com/wppconnect-team/wa-js-api-server
    linkPreviewApiServers: [],

    // wa-js reports to the Google Analytics property of its own authors from
    // the page that holds the live WhatsApp session. The library already
    // defaults this off; set explicitly so an upstream default cannot flip it.
    disableGoogleAnalytics: true,
    googleAnalyticsId: null,

    // Startup version check reaches registry.npmjs.org for no operational gain.
    disableWelcome: true,
    updatesLog: false,

    /**
     * Set specific whatsapp version
     */
    // whatsappVersion: '2.xxxxx',
  },
  mapper: {
    enable: false,
    prefix: 'tagone-',
  },
  db: {
    mongodbDatabase: env.MONGODB_DATABASE || 'tokens',
    mongodbCollection: env.MONGODB_COLLECTION || '',
    mongodbUser: env.MONGODB_USER || '',
    mongodbPassword: env.MONGODB_PASSWORD || '',
    mongodbHost: env.MONGODB_HOST || '',
    mongoIsRemote: true,
    mongoURLRemote: env.MONGO_URL_REMOTE || '',
    mongodbPort: envNumber('MONGODB_PORT', 27017),
    redisHost: env.REDIS_HOST || 'localhost',
    redisPort: envNumber('REDIS_PORT', 6379),
    redisPassword: env.REDIS_PASSWORD || '',
    redisDb: envNumber('REDIS_DB', 0),
    redisPrefix: env.REDIS_PREFIX || 'docker',
  },
  aws_s3: {
    region: 'sa-east-1' as any,
    access_key_id: null,
    secret_key: null,
    defaultBucketName: null,
    endpoint: null,
    forcePathStyle: null,
  },
} as unknown as ServerOptions;
