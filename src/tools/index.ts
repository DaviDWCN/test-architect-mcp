import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// We'll import the handlers from separate files later
import { analyzeLogicAndContracts } from "./analyze_logic_and_contracts.js";
import { lintTestQuality } from "./lint_test_quality.js";
import { executeInSandbox } from "./execute_in_sandbox.js";
import { evaluateTestResilience } from "./evaluate_test_resilience.js";

export function setupTools(server: Server) {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "analyze_logic_and_contracts",
          description: "Analyze branches and boundaries in source code and suggest runtime contracts or validation strategies.",
          inputSchema: {
            type: "object",
            properties: {
              sourceCode: { type: "string", description: "Source code of the file" },
              language: { type: "string", description: "Development language, e.g., 'python', 'go', 'typescript', 'rust'" },
            },
            required: ["sourceCode", "language"],
          },
        },
        {
          name: "lint_test_quality",
          description: "Review test cases for quality (detect weak assertions and mock abuse).",
          inputSchema: {
            type: "object",
            properties: {
              sourceCode: { type: "string", description: "Source code of the file" },
              testCode: { type: "string", description: "Test code to review" },
              language: { type: "string", description: "Development language" },
            },
            required: ["sourceCode", "testCode", "language"],
          },
        },
        {
          name: "execute_in_sandbox",
          description: "Execute a given test command in a secure process sandbox.",
          inputSchema: {
            type: "object",
            properties: {
              testCommand: { type: "string", description: "Full shell command to execute the tests, e.g., 'pytest tests/', 'npm run test'" },
              workingDir: { type: "string", description: "Working directory relative path" },
              timeout: { type: "number", description: "Timeout limit in milliseconds (default 15000)" },
            },
            required: ["testCommand"],
          },
        },
        {
          name: "evaluate_test_resilience",
          description: "Perform token-based mutation testing to evaluate test resilience by temporarily mutating source code and running tests.",
          inputSchema: {
            type: "object",
            properties: {
              sourceFilePath: { type: "string", description: "Path to the tested source file" },
              testCommand: { type: "string", description: "Test running command" },
              language: { type: "string", description: "Development language" },
            },
            required: ["sourceFilePath", "testCommand", "language"],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "analyze_logic_and_contracts") {
      return analyzeLogicAndContracts(args);
    }

    if (name === "lint_test_quality") {
      return lintTestQuality(args);
    }

    if (name === "execute_in_sandbox") {
      return executeInSandbox(args);
    }

    if (name === "evaluate_test_resilience") {
      return evaluateTestResilience(args);
    }

    throw new Error(`Tool \${name} not found`);
  });
}
