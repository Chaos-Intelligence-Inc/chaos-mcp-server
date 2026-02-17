# @chaosintelligence/mcp

MCP server for [Chaos Intelligence](https://chaosintelligence.com) — access your Capture thoughts and Resonate posts from Claude, Cursor, and other AI tools.

## Quick Start

### Claude Code (Plugin)

Browse plugins → **Add marketplace from GitHub** → `chaosintelligence/chaos-mcp-server`

You'll be prompted to set your `CHAOS_API_KEY`.

### Claude Code (Manual)

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "chaos": {
      "command": "npx",
      "args": ["-y", "@chaosintelligence/mcp"],
      "env": {
        "CHAOS_API_KEY": "chaos_your_key_here"
      }
    }
  }
}
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "chaos": {
      "command": "npx",
      "args": ["-y", "@chaosintelligence/mcp"],
      "env": {
        "CHAOS_API_KEY": "chaos_your_key_here"
      }
    }
  }
}
```

## Getting an API Key

1. Sign up at [chaosintelligence.com](https://chaosintelligence.com)
2. Subscribe to Level 1
3. Go to **Settings → API Keys** and generate a key
4. Your key will look like `chaos_` followed by 32 characters

## Available Tools

### Capture (Thoughts)

| Tool | Description |
|------|-------------|
| `list_thoughts` | List thoughts with filters (stream, category, date, search) |
| `get_thought` | Get a thought by ID with all content blocks |
| `search_similar` | Semantic search for similar thoughts |
| `search_thoughts` | Semantic search with structured filters |
| `list_streams` | List streams (folders for organizing thoughts) |
| `get_stream` | Get a stream with its thoughts |
| `search_streams` | Search streams by name/description |
| `get_stats` | Summary statistics for your thoughts |
| `list_recent_thoughts` | Quick access to recent thoughts |
| `create_thought` | Capture a new thought (text, images, links) |

### Pages

| Tool | Description |
|------|-------------|
| `list_pages` | List generated pages with filters |
| `get_page` | Get a page with full content |
| `update_page` | Edit a page's title, content, or description |
| `search_pages` | Search pages by title or content |

### Resonate (Posts)

| Tool | Description |
|------|-------------|
| `search_posts` | Semantic search for public posts |
| `list_posts` | Browse posts with filters and sorting |
| `get_post` | Get post details with votes and reactions |
| `get_post_demographics` | Demographic voting breakdown |
| `get_topic_clusters` | Trending topics with heat scores |
| `get_my_votes` | Your voting history |
| `get_my_post_performance` | Performance data for your posts |

### Utility

| Tool | Description |
|------|-------------|
| `get_usage` | API usage stats and rate limits |
| `get_reactions` | Available reaction types |
| `get_classifications` | Thought classification types |
| `get_categories` | Available categories |

## Development

```bash
git clone https://github.com/chaosintelligence/chaos-mcp-server.git
cd chaos-mcp-server
npm install --ignore-scripts
npm run build
```

Test with the MCP Inspector:

```bash
CHAOS_API_KEY=chaos_yourkey npx @modelcontextprotocol/inspector node dist/index.js
```

## License

MIT
