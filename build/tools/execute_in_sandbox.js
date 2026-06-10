import { exec } from "node:child_process";
import { promisify } from "node:util";
const execAsync = promisify(exec);
export async function executeInSandbox(args) {
    const testCommand = args.testCommand;
    const workingDir = args.workingDir;
    const timeout = typeof args.timeout === "number" ? args.timeout : 15000;
    if (!testCommand) {
        throw new Error("Missing required argument: testCommand");
    }
    try {
        const { stdout, stderr } = await execAsync(testCommand, {
            cwd: workingDir,
            timeout: timeout,
        });
        const result = {
            exitCode: 0,
            stdout,
            stderr,
            success: true,
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
    catch (error) {
        const result = {
            exitCode: error.code || 1,
            stdout: error.stdout || "",
            stderr: error.stderr || error.message || "",
            success: false,
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
}
//# sourceMappingURL=execute_in_sandbox.js.map