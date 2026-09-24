# VEXTRALOOM API Architecture

## Layered Design
The Express API utilizes a clean 4-tier architecture to completely decouple HTTP logic, business logic, schema logic, and validation.

1. **Routes (\`src/routes/\`)**: Defines HTTP endpoints and mounts middlewares (Auth, Validation). No business logic. No database queries.
2. **Controllers (\`src/controllers/\`)**: Handles HTTP requests, extracts parameters/body, calls the Service layer, and formats the standard JSON response.
3. **Services (\`src/services/\`)**: Contains business logic and database interactions. Completely agnostic to HTTP objects (\`req\`, \`res\`). Can be tested independently.
4. **Models (\`src/models/\`)**: Mongoose definitions. Enforces schema integrity, constraints, and indexes.

## Standard JSON Response
All successful responses follow this format:
\`\`\`json
{
  "success": true,
  "data": { ... } // or Array
}
\`\`\`

## Centralized Error Handling
Errors are caught by \`express-async-handler\` in controllers and forwarded to \`src/middleware/error.middleware.ts\`.

**Response Format**:
\`\`\`json
{
  "success": false,
  "message": "Human readable error message",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
\`\`\`
*Note: Stack traces are only included if \`NODE_ENV === 'development'\`. Never expose raw MongoDB errors (e.g. \`11000\` duplicates are intercepted and formatted).*

## Validation Layer
Validation is decoupled from controllers using Zod (\`src/validators/\` and \`src/middleware/validate.middleware.ts\`).

**Flow**:
\`Router -> validate(zodSchema) -> Controller -> Service\`

If \`zodSchema\` fails, the validator middleware throws a \`ZodError\` which is natively formatted by the Global Error Handler into a \`400 Bad Request\`.
