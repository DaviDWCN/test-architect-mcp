export async function lintTestQuality(args: any) {
  const sourceCode = args.sourceCode as string;
  const testCode = args.testCode as string;
  const language = args.language as string;

  if (!sourceCode || !testCode || !language) {
    throw new Error("Missing required arguments: sourceCode, testCode, and language");
  }

  const violations: { type: string; line: number; message: string }[] = [];
  const lines = testCode.split("\n");

  const weakAssertionPatterns = [
    /expect\(.*\)\.toBeDefined\(\)/,
    /expect\(.*\)\.not\.toBeNull\(\)/,
    /self\.assertIsNotNone\(.*\)/,
    /assert\s+.*is\s+not\s+None/,
    /assert\.NotNil\(.*\)/,
  ];

  const mockAbusePatterns = [
    /jest\.mock\(.*'\.\/.*'\)/,
    /@patch\(.*'\.\/.*'\)/,
  ];

  lines.forEach((line, index) => {
    for (const pattern of weakAssertionPatterns) {
      if (pattern.test(line)) {
        violations.push({
          type: "WEAK_ASSERTION",
          line: index + 1,
          message: "检测到仅对对象是否存在进行了断言，请补充对其核心业务字段值的断言。",
        });
      }
    }

    for (const pattern of mockAbusePatterns) {
      if (pattern.test(line)) {
        violations.push({
          type: "MOCK_ABUSE",
          line: index + 1,
          message: "发现对本地业务模块进行Mock的痕迹，请确保只对跨进程/网络 I/O 边界进行Mock。",
        });
      }
    }
  });

  const baseScore = 100;
  const score = Math.max(0, baseScore - violations.length * 15);
  const compliant = violations.length === 0;

  const result = {
    compliant,
    score,
    violations,
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
