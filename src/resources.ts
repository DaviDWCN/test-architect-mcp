import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const PHILOSOPHY_CONTENT = `# Test Architect Philosophy
- **行为级测试**：不依赖具体的语言实现特性。
- **防线构建（契约与不变量）**：如何在动态语言（Python/JS）与静态类型语言（Go/Rust/Java）中分别建立运行时或编译期的边界契约。
- **非侵入式 Mock 原则**：明确指出跨进程/跨网络 I/O 的 Mock 边界，禁止对通用逻辑进行内部 Mock。
`;

const PBT_CONTENT = `# Property-Based Testing Templates
- Python: Hypothesis
- TypeScript: fast-check
- Go: gofuzz/rapid
- Java: QuickTheories
`;

export function setupResources(server: Server) {
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "test-architect://standards/philosophy",
          name: "Test Philosophy",
          mimeType: "text/markdown",
          description: "General test philosophy including invariant building and mock boundaries.",
        },
        {
          uri: "test-architect://templates/property-based-testing",
          name: "Property Based Testing",
          mimeType: "text/markdown",
          description: "Property-based testing frameworks reference for various languages.",
        },
      ],
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === "test-architect://standards/philosophy") {
      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: "text/markdown",
            text: PHILOSOPHY_CONTENT,
          },
        ],
      };
    }

    if (request.params.uri === "test-architect://templates/property-based-testing") {
      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: "text/markdown",
            text: PBT_CONTENT,
          },
        ],
      };
    }

    throw new Error("Resource not found");
  });
}
