import { promises as fs } from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
const execAsync = promisify(exec);
export async function evaluateTestResilience(args) {
    const sourceFilePath = args.sourceFilePath;
    const testCommand = args.testCommand;
    const language = args.language;
    if (!sourceFilePath || !testCommand || !language) {
        throw new Error("Missing required arguments: sourceFilePath, testCommand, and language");
    }
    let originalCode = "";
    try {
        originalCode = await fs.readFile(sourceFilePath, "utf8");
    }
    catch (error) {
        throw new Error(`Failed to read source file: ${error.message}`);
    }
    // Token-based mutation logic (simplified heuristic replacements)
    const mutations = [
        { original: "==", mutated: "!=" },
        { original: ">=", mutated: "<" },
        { original: "<=", mutated: ">" },
        { original: "&&", mutated: "||" },
        { original: "and", mutated: "or" },
        { original: "+", mutated: "-" },
    ];
    const survivedMutants = [];
    let totalMutants = 0;
    let killedMutants = 0;
    try {
        const lines = originalCode.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === undefined)
                continue;
            for (const { original, mutated } of mutations) {
                if (line.includes(original)) {
                    totalMutants++;
                    // Create mutant code
                    const mutatedLine = line.replace(original, mutated);
                    const mutatedCode = [...lines];
                    mutatedCode[i] = mutatedLine;
                    // Write mutant to shadow copy (temporarily override source)
                    await fs.writeFile(sourceFilePath, mutatedCode.join("\n"));
                    // Run tests
                    try {
                        await execAsync(testCommand, { timeout: 15000 });
                        // If test passes, the mutant survived!
                        survivedMutants.push({
                            line: i + 1,
                            originalOperator: original,
                            mutatedOperator: mutated,
                            context: mutatedLine.trim(),
                            message: "状态判断条件被篡改后测试依然通过，说明缺少该状态分支的测试覆盖。",
                        });
                    }
                    catch (error) {
                        // Test failed, mutant killed
                        killedMutants++;
                    }
                }
            }
        }
    }
    finally {
        // Restore original code NO MATTER WHAT
        await fs.writeFile(sourceFilePath, originalCode);
    }
    const mutationScore = totalMutants === 0 ? 100 : (killedMutants / totalMutants) * 100;
    const result = {
        mutationScore,
        totalMutants,
        killedMutants,
        survivedMutants,
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
//# sourceMappingURL=evaluate_test_resilience.js.map