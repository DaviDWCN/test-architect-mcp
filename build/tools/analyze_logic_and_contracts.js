export async function analyzeLogicAndContracts(args) {
    const sourceCode = args.sourceCode;
    const language = args.language;
    if (!sourceCode || !language) {
        throw new Error("Missing required arguments: sourceCode and language");
    }
    const invariants = [];
    // Heuristics to find simple invariants based on common keywords/patterns
    if (sourceCode.includes("balance") || sourceCode.includes("amount")) {
        invariants.push("Inputs for amounts or balances should likely be non-negative.");
    }
    if (sourceCode.match(/if\s*\(.*(==|===)\s*null\)/)) {
        invariants.push("Null checks indicate fields that may be absent; ensure defaults or early exits.");
    }
    if (sourceCode.includes("length") || sourceCode.match(/len\s*\(/)) {
        invariants.push("Length bounds check is required to prevent out-of-bounds access.");
    }
    let suggestion = "Consider adding entrypoint validation.";
    const langLower = language.toLowerCase();
    if (langLower === "python") {
        suggestion = "建议使用 pydantic 或 assert 语句在入口处拦截非法输入。";
    }
    else if (langLower === "go") {
        suggestion = "建议使用 custom check 并在入口处抛出 error，或者尽早 return 错误。";
    }
    else if (langLower === "typescript" || langLower === "ts" || langLower === "javascript" || langLower === "js") {
        suggestion = "建议使用 Zod 或类型守卫在入口处拦截非法输入。";
    }
    else if (langLower === "rust") {
        suggestion = "建议充分利用 Rust 的枚举系统与 Result/Option 并在入口拦截非法状态。";
    }
    else if (langLower === "java") {
        suggestion = "建议使用 javax.validation/hibernate validator 或 Preconditions 进行入参校验。";
    }
    const result = {
        invariants: invariants.length > 0 ? invariants : ["未发现明显的领域特定不变量，建议基于业务逻辑自行补充"],
        languageSpecificContracts: {
            suggestion,
        },
    };
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(result, null, 2),
            },
        ],
    };
}
//# sourceMappingURL=analyze_logic_and_contracts.js.map