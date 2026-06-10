# test-architect-mcp

An MCP (Model Context Protocol) server providing a language-agnostic testing governance and quality evaluation protocol.

## Usage

You can use this MCP server directly with compatible AI tools.

### Via npx

```json
{
  "mcpServers": {
    "test-architect": {
      "command": "npx",
      "args": [
        "-y",
        "github:DaviDWCN/test-architect-mcp"
      ]
    }
  }
}
```

### Via clone and build

1. Clone this repository:
   ```bash
   git clone https://github.com/DaviDWCN/test-architect-mcp.git
   cd test-architect-mcp
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Add to your AI tool's MCP settings:
   ```json
   {
     "mcpServers": {
       "test-architect": {
         "command": "node",
         "args": [
           "/path/to/test-architect-mcp/build/index.js"
         ]
       }
     }
   }
   ```
