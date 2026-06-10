import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListPromptsRequestSchema, GetPromptRequestSchema } from "@modelcontextprotocol/sdk/types.js";
export function setupPrompts(server) {
    server.setRequestHandler(ListPromptsRequestSchema, async () => {
        return {
            prompts: [
                {
                    name: "test-planning",
                    description: "Generates a comprehensive test plan and thought process for given source code.",
                    arguments: [
                        {
                            name: "sourceCode",
                            description: "The source code to test.",
                            required: true,
                        },
                        {
                            name: "language",
                            description: "The programming language of the source code.",
                            required: true,
                        },
                    ],
                },
            ],
        };
    });
    server.setRequestHandler(GetPromptRequestSchema, async (request) => {
        if (request.params.name === "test-planning") {
            const sourceCode = request.params.arguments?.sourceCode || "";
            const language = request.params.arguments?.language || "";
            return {
                description: "Test Planning Prompt",
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `你现在是跨语言测试架构专家。请针对以下 ${language} 源代码进行深度分析：
\`\`\`
${sourceCode}
\`\`\`
在编写测试代码前，必须输出一份 <test_thought_process> 报告：
1. 识别不变量：无论输入如何变化，该函数/类必须始终满足的业务逻辑不变量。
2. 边界条件：针对 ${language} 语言特性的边界（如空指针、溢出、零值、切片越界等）。
3. 异常路径：列出所有可能抛出的异常/错误类型，以及预期的错误处理逻辑。
4. 拟采用的测试库和断言设计（包括 AAA 结构规划）。`,
                        },
                    },
                ],
            };
        }
        throw new Error("Prompt not found");
    });
}
//# sourceMappingURL=prompts.js.map