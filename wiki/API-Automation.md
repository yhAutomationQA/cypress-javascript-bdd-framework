# API Automation

## ApiClient

Reusable CRUD client at `cypress/api/api-client.js` that auto-logs every request/response.

### Methods

| Method | Description |
|--------|-------------|
| `get(path, options)` | GET request with query params |
| `post(path, body, options)` | POST with JSON body |
| `put(path, body, options)` | Full resource update |
| `patch(path, body, options)` | Partial resource update |
| `delete(path, options)` | Resource deletion |
| `send(method, path, options)` | Generic request (any HTTP method) |

All methods return Cypress chainables via `cy.wrap()`, supporting `.then()` chaining. Negative tests pass `{ failOnStatusCode: false }` to handle 4xx/5xx responses without Cypress auto-failure.

### Options

```js
{
  headers: {},              // Additional headers
  body: {},                 // Request body (POST/PUT/PATCH)
  qs: {},                   // Query string parameters
  failOnStatusCode: true    // Set false for negative tests
}
```

## ResponseValidator

Chained assertion engine at `cypress/api/response-validator.js` with 25+ methods:

```js
ResponseValidator.from(response)
  .status(200)
  .bodyHasField("id")
  .bodyFieldEquals("title", "expected")
  .bodyIsArray()
  .bodyArrayMinLength(1)
  .headerExists("Content-Type")
  .headerEquals("Content-Type", "application/json; charset=utf-8")
  .durationLessThan(3000);
```

### Available Assertions

- **Status:** `.status(code)`, `.statusCategory(type)` (2xx, 4xx, etc.)
- **Body:** `.body(expected)`, `.bodyContains(partial)`, `.bodyIsArray()`, `.bodyIsObject()`, `.bodyHasField(path)`, `.bodyFieldEquals(path, value)`, `.bodyArrayMinLength(n)`
- **Headers:** `.headerExists(name)`, `.headerEquals(name, value)`
- **Duration:** `.durationLessThan(ms)`, `.durationGreaterThan(ms)`

## SchemaValidator

Zero-dependency JSON schema validator at `cypress/api/schema-validator.js`:

```js
SchemaValidator.assertSchema(data, {
  type: "object",
  required: ["id", "title", "body"],
  properties: {
    id: { type: "integer", minimum: 1 },
    title: { type: "string", minLength: 1 },
    body: { type: "string" },
  },
});
```

### Supported Constraints

`type`, `required`, `properties`, `items`, `minLength`, `maxLength`, `minimum`, `maximum`, `enum`, `pattern`, `additionalProperties`, nested `items` validation
