class SchemaValidator {
  static validate(data, schema) {
    const errors = [];
    SchemaValidator._validateNode(data, schema, errors, "$");
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static _validateNode(data, schema, errors, path) {
    if (schema.nullable && data === null) {
      return;
    }

    if (schema.type) {
      const typeError = SchemaValidator._checkType(data, schema.type, path);
      if (typeError) {
        errors.push(typeError);
        return;
      }
    }

    if (schema.required && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        const fieldPath = `${path}.${field}`;
        if (data === null || data === undefined || data[field] === undefined) {
          errors.push({
            path: fieldPath,
            message: `Required field "${field}" is missing`,
            expected: "present",
            actual: "undefined",
          });
        }
      }
    }

    if (schema.properties && data && typeof data === "object") {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        const fieldPath = `${path}.${key}`;
        if (data[key] !== undefined) {
          SchemaValidator._validateNode(data[key], propSchema, errors, fieldPath);
        }
      }
    }

    if (schema.items && Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        SchemaValidator._validateNode(data[i], schema.items, errors, `${path}[${i}]`);
      }
    }

    if (schema.enum && Array.isArray(schema.enum)) {
      if (!schema.enum.includes(data)) {
        errors.push({
          path,
          message: `Value is not in the allowed enum`,
          expected: schema.enum.join(" | "),
          actual: String(data),
        });
      }
    }

    if (schema.minimum !== undefined && typeof data === "number") {
      if (data < schema.minimum) {
        errors.push({
          path,
          message: `Value is below minimum`,
          expected: `>= ${schema.minimum}`,
          actual: String(data),
        });
      }
    }

    if (schema.maximum !== undefined && typeof data === "number") {
      if (data > schema.maximum) {
        errors.push({
          path,
          message: `Value exceeds maximum`,
          expected: `<= ${schema.maximum}`,
          actual: String(data),
        });
      }
    }

    if (schema.minLength !== undefined && typeof data === "string") {
      if (data.length < schema.minLength) {
        errors.push({
          path,
          message: `String length is below minimum`,
          expected: `>= ${schema.minLength}`,
          actual: String(data.length),
        });
      }
    }

    if (schema.maxLength !== undefined && typeof data === "string") {
      if (data.length > schema.maxLength) {
        errors.push({
          path,
          message: `String length exceeds maximum`,
          expected: `<= ${schema.maxLength}`,
          actual: String(data.length),
        });
      }
    }

    if (schema.pattern && typeof data === "string") {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(data)) {
        errors.push({
          path,
          message: `String does not match pattern`,
          expected: schema.pattern,
          actual: data,
        });
      }
    }

    if (schema.minItems !== undefined && Array.isArray(data)) {
      if (data.length < schema.minItems) {
        errors.push({
          path,
          message: `Array length is below minimum`,
          expected: `>= ${schema.minItems}`,
          actual: String(data.length),
        });
      }
    }

    if (schema.maxItems !== undefined && Array.isArray(data)) {
      if (data.length > schema.maxItems) {
        errors.push({
          path,
          message: `Array length exceeds maximum`,
          expected: `<= ${schema.maxItems}`,
          actual: String(data.length),
        });
      }
    }
  }

  static _checkType(data, type, path) {
    if (type === "integer") {
      if (typeof data !== "number" || !Number.isInteger(data)) {
        return {
          path,
          message: `Expected integer`,
          expected: "integer",
          actual: typeof data,
        };
      }
      return null;
    }

    if (type === "number") {
      if (typeof data !== "number") {
        return {
          path,
          message: `Expected number`,
          expected: "number",
          actual: typeof data,
        };
      }
      return null;
    }

    if (type === "array") {
      if (!Array.isArray(data)) {
        return {
          path,
          message: `Expected array`,
          expected: "array",
          actual: typeof data,
        };
      }
      return null;
    }

    if (typeof data !== type) {
      return {
        path,
        message: `Type mismatch`,
        expected: type,
        actual: typeof data,
      };
    }

    return null;
  }

  static assertSchema(data, schema) {
    const result = SchemaValidator.validate(data, schema);
    if (!result.valid) {
      const message = result.errors
        .map(
          (e) =>
            `  [${e.path}] ${e.message} | expected: ${e.expected}, actual: ${e.actual}`
        )
        .join("\n");
      throw new Error(`Schema validation failed:\n${message}`);
    }
    return true;
  }
}

module.exports = SchemaValidator;
