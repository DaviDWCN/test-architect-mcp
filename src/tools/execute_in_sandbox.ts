import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function executeInSandbox(args: any) {
  const testCommand = args.testCommand as string;
  const workingDir = args.workingDir as string | undefined;
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
  } catch (error: any) {
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
