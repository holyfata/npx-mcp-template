# @betterhyq/npx-mcp-template

<!-- automd:badges license color=yellow -->

[![npm version](https://img.shields.io/npm/v/@betterhyq/npx-mcp-template?color=yellow)](https://npmjs.com/package/@betterhyq/npx-mcp-template)
[![npm downloads](https://img.shields.io/npm/dm/@betterhyq/npx-mcp-template?color=yellow)](https://npm.chart.dev/@betterhyq/npx-mcp-template)
[![license](https://img.shields.io/github/license/betterhyq/npx-mcp-template?color=yellow)](https://github.com/betterhyq/npx-mcp-template/blob/main/LICENSE)

<!-- /automd -->

## Usage

Install the package:

<!-- automd:pm-install global auto=false -->

```sh
# npm
npm installg @betterhyq/npx-mcp-template

# yarn
yarn addg @betterhyq/npx-mcp-template

# pnpm
pnpm addg @betterhyq/npx-mcp-template

# bun
bun installg @betterhyq/npx-mcp-template

# deno
deno installg npm:@betterhyq/npx-mcp-template
```

<!-- /automd -->

### NPX Cursor Config

```json
{
  "mcpServers": {
    "npx-mcp-template": {
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

### Http Cursor Config

start the service locally

```bash
npx-mcp-template --http --port=4000
```

set the config

```json
{
  "mcpServers": {
    "npx-mcp-template": {
      "url": "http://0.0.0.0:4000/sse",
      "type": "sse",
      "transportType": "sse"
    }
  }
}
```

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/betterhyq/npx-mcp-template/blob/main/LICENSE) license.
Made by [community](https://github.com/betterhyq/npx-mcp-template/graphs/contributors) 💛
<br><br>
<a href="https://github.com/betterhyq/npx-mcp-template/graphs/contributors">
<img src="https://contrib.rocks/image?repo=betterhyq/npx-mcp-template" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
