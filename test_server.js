import { analyzeLogicAndContracts } from "./src/tools/analyze_logic_and_contracts.js";
import { lintTestQuality } from "./src/tools/lint_test_quality.js";
async function run() {
    console.log("Testing analyzeLogicAndContracts...");
    const analyzeRes = await analyzeLogicAndContracts({
        sourceCode: "function foo(amount) { if (amount == null) return; }",
        language: "typescript",
    });
    console.log(analyzeRes.content[0].text);
    console.log("\\nTesting lintTestQuality...");
    const lintRes = await lintTestQuality({
        sourceCode: "function a() {}",
        testCode: "expect(a()).toBeDefined();\\njest.mock('./a');",
        language: "typescript",
    });
    console.log(lintRes.content[0].text);
}
run().catch(console.error);
//# sourceMappingURL=test_server.js.map