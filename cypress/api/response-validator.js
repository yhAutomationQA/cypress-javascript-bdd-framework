class ResponseValidator {
  constructor(response) {
    this.response = response;
  }

  static from(response) {
    return new ResponseValidator(response);
  }

  status(expected) {
    expect(this.response.status).to.eq(expected);
    return this;
  }

  statusIs2xx() {
    expect(this.response.status).to.be.within(200, 299);
    return this;
  }

  statusIs3xx() {
    expect(this.response.status).to.be.within(300, 399);
    return this;
  }

  statusIs4xx() {
    expect(this.response.status).to.be.within(400, 499);
    return this;
  }

  statusIs5xx() {
    expect(this.response.status).to.be.within(500, 599);
    return this;
  }

  statusNot(expected) {
    expect(this.response.status).not.to.eq(expected);
    return this;
  }

  body(expected) {
    expect(this.response.body).to.deep.equal(expected);
    return this;
  }

  bodyContains(value) {
    if (typeof value === "object") {
      expect(this.response.body).to.deep.include(value);
    } else {
      expect(JSON.stringify(this.response.body)).to.include(value);
    }
    return this;
  }

  bodyNotContains(value) {
    if (typeof value === "object") {
      expect(this.response.body).not.to.deep.include(value);
    } else {
      expect(JSON.stringify(this.response.body)).not.to.include(value);
    }
    return this;
  }

  bodyHasField(fieldPath) {
    const value = this._getNestedValue(this.response.body, fieldPath);
    expect(value).to.not.be.undefined;
    return this;
  }

  bodyFieldEquals(fieldPath, expected) {
    const value = this._getNestedValue(this.response.body, fieldPath);
    expect(value).to.eq(expected);
    return this;
  }

  bodyFieldMatches(fieldPath, regex) {
    const value = String(this._getNestedValue(this.response.body, fieldPath));
    expect(value).to.match(regex);
    return this;
  }

  bodyFieldType(fieldPath, type) {
    const value = this._getNestedValue(this.response.body, fieldPath);
    const expectedType = type.toLowerCase();
    switch (expectedType) {
      case "string":
        expect(value).to.be.a("string");
        break;
      case "number":
      case "integer":
        expect(value).to.be.a("number");
        break;
      case "boolean":
        expect(value).to.be.a("boolean");
        break;
      case "array":
        expect(value).to.be.an("array");
        break;
      case "object":
        expect(value).to.be.an("object");
        break;
      case "null":
        expect(value).to.be.null;
        break;
      default:
        expect(value).to.be.a(type);
    }
    return this;
  }

  bodyFieldNotExists(fieldPath) {
    const value = this._getNestedValue(this.response.body, fieldPath);
    expect(value).to.be.undefined;
    return this;
  }

  bodyIsArray() {
    expect(this.response.body).to.be.an("array");
    return this;
  }

  bodyIsObject() {
    expect(this.response.body).to.be.an("object");
    return this;
  }

  bodyArrayLength(expected) {
    expect(this.response.body).to.be.an("array");
    expect(this.response.body).to.have.length(expected);
    return this;
  }

  bodyArrayMinLength(min) {
    expect(this.response.body).to.be.an("array");
    expect(this.response.body.length).to.be.at.least(min);
    return this;
  }

  bodyArrayMaxLength(max) {
    expect(this.response.body).to.be.an("array");
    expect(this.response.body.length).to.be.at.most(max);
    return this;
  }

  headerExists(name) {
    const key = this._findHeaderKey(name);
    expect(key).to.not.be.null;
    return this;
  }

  headerEquals(name, expected) {
    const key = this._findHeaderKey(name);
    expect(key).to.not.be.null;
    expect(this.response.headers[key]).to.eq(expected);
    return this;
  }

  headerContains(name, expected) {
    const key = this._findHeaderKey(name);
    expect(key).to.not.be.null;
    expect(this.response.headers[key]).to.include(expected);
    return this;
  }

  durationLessThan(ms) {
    expect(this.response.duration).to.be.lessThan(ms);
    return this;
  }

  durationGreaterThan(ms) {
    expect(this.response.duration).to.be.greaterThan(ms);
    return this;
  }

  _getNestedValue(obj, fieldPath) {
    return fieldPath.split(".").reduce((current, key) => {
      if (current === null || current === undefined) {
        return undefined;
      }
      if (Array.isArray(current)) {
        const index = parseInt(key, 10);
        return isNaN(index) ? undefined : current[index];
      }
      return current[key];
    }, obj);
  }

  _findHeaderKey(name) {
    const keys = Object.keys(this.response.headers);
    const lower = name.toLowerCase();
    return keys.find((k) => k.toLowerCase() === lower) || null;
  }
}

module.exports = ResponseValidator;
