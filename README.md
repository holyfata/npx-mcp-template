# NPX MCP 模版

## 使用方式

### NPM 包安装方式

- 全局装包

```bash
npm i @betterhyq/npx-mcp-template -g
```

- 配置协议

```json
{
  "mcpServers": {
    "NPX MCP TEMPLATE NPM INSTALL": {
      "autoApprove": [
        "Add Tool"
      ],
      "timeout": 180,
      "command": "npx",
      "type": "stdio",
      "transportType": "stdio",
      "args": [
        "-y",
        "npx-mcp-template"
      ]
    }
  }
}
```

### HTTP 协议传输

- 全局装包

```bash
npm i @betterhyq/npx-mcp-template -g
```

- 启动项目

```bash
npx-mcp-template --http --port=4000
```

- 配置协议

```json
{
  "mcpServers": {
    "NPX MCP TEMPLATE LOCAL HTTP": {
      "timeout": 180,
      "url": "http://0.0.0.0:4000/sse",
      "type": "sse",
      "transportType": "sse"
    }
  }
}
```
