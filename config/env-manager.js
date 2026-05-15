const dotenv = require("dotenv");
const path = require("path");

class EnvManager {
  constructor() {
    this.targetEnv = this._resolveTargetEnv();
    this._loaded = false;
    this._config = {};
  }

  _resolveTargetEnv() {
    const env = (process.env.ENV || "dev").toLowerCase();
    const valid = ["dev", "qa", "staging", "production"];
    if (!valid.includes(env)) {
      console.warn(
        `[EnvManager] Unknown ENV "${env}". Defaulting to "dev". Valid values: ${valid.join(", ")}`
      );
      return "dev";
    }
    return env;
  }

  load() {
    if (this._loaded) {
      return this._config;
    }

    const envFilePath = path.resolve(process.cwd(), `.env.${this.targetEnv}`);

    dotenv.config({ path: envFilePath });

    const result = dotenv.config({ path: envFilePath });
    if (result.error) {
      console.warn(
        `[EnvManager] File not found: ${envFilePath}. Falling back to .env.example defaults.`
      );
      dotenv.config({ path: path.resolve(process.cwd(), ".env.example") });
    }

    this._config = this._parseConfig();
    this._validateConfig();
    this._loaded = true;

    console.log(
      `[EnvManager] Loaded environment: "${this.targetEnv}" from ${envFilePath}`
    );

    return this._config;
  }

  _parseConfig() {
    return {
      baseUrl: process.env.BASE_URL,
      apiUrl: process.env.API_URL,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      apiKey: process.env.API_KEY || "",
      timeouts: {
        implicit: parseInt(process.env.IMPLICIT_TIMEOUT, 10) || 5000,
        explicit: parseInt(process.env.EXPLICIT_TIMEOUT, 10) || 10000,
        pageLoad: parseInt(process.env.PAGE_LOAD_TIMEOUT, 10) || 30000,
      },
    };
  }

  _validateConfig() {
    const required = ["baseUrl", "apiUrl", "username", "password"];
    const missing = required.filter((key) => !this._config[key]);
    if (missing.length > 0) {
      console.warn(
        `[EnvManager] Missing required config: ${missing.join(", ")}. ` +
          "Check your .env file or environment variables."
      );
    }
  }

  get(key) {
    if (!this._loaded) {
      this.load();
    }
    return this._config[key];
  }

  getAll() {
    if (!this._loaded) {
      this.load();
    }
    return { ...this._config };
  }

  isEnvironment(envName) {
    return this.targetEnv === envName.toLowerCase();
  }

  isDev() {
    return this.isEnvironment("dev");
  }

  isQA() {
    return this.isEnvironment("qa");
  }

  isStaging() {
    return this.isEnvironment("staging");
  }

  getCypressEnv() {
    const cfg = this.getAll();
    return {
      ENV: this.targetEnv,
      BASE_URL: cfg.baseUrl,
      API_URL: cfg.apiUrl,
      USERNAME: cfg.username,
      PASSWORD: cfg.password,
      API_KEY: cfg.apiKey,
      IMPLICIT_TIMEOUT: cfg.timeouts.implicit,
      EXPLICIT_TIMEOUT: cfg.timeouts.explicit,
      PAGE_LOAD_TIMEOUT: cfg.timeouts.pageLoad,
    };
  }

  buildUrl(pathname = "") {
    const base = this.get("baseUrl");
    if (!base) {
      return pathname;
    }
    const joined = [base.replace(/\/+$/, ""), pathname.replace(/^\/+/, "")];
    return joined.join("/");
  }

  buildApiUrl(pathname = "") {
    const api = this.get("apiUrl");
    if (!api) {
      return pathname;
    }
    const joined = [api.replace(/\/+$/, ""), pathname.replace(/^\/+/, "")];
    return joined.join("/");
  }

  getTimeout(name) {
    const timeouts = this.get("timeouts");
    return timeouts[name] || timeouts.explicit;
  }

  getCredentials() {
    return {
      username: this.get("username"),
      password: this.get("password"),
    };
  }

  reload() {
    this._loaded = false;
    return this.load();
  }

  toString() {
    return `EnvManager{env="${this.targetEnv}", baseUrl="${this.get("baseUrl")}"}`;
  }
}

module.exports = new EnvManager();
