// Tool definitions — registers all 26 tools with Zod schemas
// Schemas match the deployed edge function at chaos-mcp-server/tools/index.ts

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ChaosApiClient } from './client.js';

export function registerAllTools(server: McpServer, client: ChaosApiClient): void {
  // ---------------------------------------------------------------------------
  // Capture Read Tools
  // ---------------------------------------------------------------------------

  server.registerTool('list_thoughts', {
    description:
      'List your captured thoughts with optional filtering by stream, classification, category, date range, or text search. Returns paginated results.',
    inputSchema: {
      page: z.number().int().min(1).default(1).optional().describe('Page number (default: 1)'),
      per_page: z.number().int().min(1).max(100).default(50).optional().describe('Items per page (default: 50, max: 100)'),
      stream_id: z.string().uuid().optional().describe('Filter by stream ID'),
      stream: z.string().optional().describe('Filter by stream name (case-insensitive)'),
      classification_id: z.string().uuid().optional().describe('Filter by thought type/classification ID'),
      classification: z.string().optional().describe('Filter by classification name (e.g., "task", "idea", "theory"). Case-insensitive.'),
      category_id: z.string().uuid().optional().describe('Filter by category ID'),
      category: z.string().optional().describe('Filter by category name (e.g., "Technology", "Business"). Case-insensitive.'),
      created_after: z.string().datetime().optional().describe('Filter thoughts created after this date (ISO 8601)'),
      created_before: z.string().datetime().optional().describe('Filter thoughts created before this date (ISO 8601)'),
      search: z.string().optional().describe('Search thoughts by content text'),
    },
  }, async (args) => {
    return await client.callTool('list_thoughts', args);
  });

  server.registerTool('get_thought', {
    description:
      'Get a specific thought by ID with all content blocks, classification, category, and streams.',
    inputSchema: {
      thought_id: z.string().uuid().describe('The thought ID to retrieve'),
    },
  }, async (args) => {
    return await client.callTool('get_thought', args);
  });

  server.registerTool('search_similar', {
    description:
      'Find thoughts semantically similar to a text query using AI embeddings. Great for finding related ideas and concepts.',
    inputSchema: {
      text: z.string().describe('Text to find similar thoughts for'),
      limit: z.number().int().min(1).max(50).default(10).optional().describe('Maximum number of results (default: 10, max: 50)'),
      min_score: z.number().min(0).max(1).default(0.5).optional().describe('Minimum similarity score 0-1 (default: 0.5)'),
    },
  }, async (args) => {
    return await client.callTool('search_similar', args);
  });

  server.registerTool('search_thoughts', {
    description:
      'Search your thoughts using semantic similarity combined with structured filters. Finds thoughts that match the meaning of your query, optionally filtered by stream, category, classification, or date range.',
    inputSchema: {
      text: z.string().describe('Text to search for semantically'),
      stream_id: z.string().uuid().optional().describe('Filter by stream ID'),
      stream: z.string().optional().describe('Filter by stream name (case-insensitive)'),
      classification_id: z.string().uuid().optional().describe('Filter by classification ID'),
      classification: z.string().optional().describe('Filter by classification name (e.g., "task", "idea"). Case-insensitive.'),
      category_id: z.string().uuid().optional().describe('Filter by category ID'),
      category: z.string().optional().describe('Filter by category name (e.g., "Technology"). Case-insensitive.'),
      created_after: z.string().datetime().optional().describe('Filter thoughts created after this date (ISO 8601)'),
      created_before: z.string().datetime().optional().describe('Filter thoughts created before this date (ISO 8601)'),
      limit: z.number().int().min(1).max(50).default(50).optional().describe('Maximum results (default: 50, max: 50)'),
      min_score: z.number().min(0).max(1).default(0.5).optional().describe('Minimum similarity score 0-1 (default: 0.5)'),
    },
  }, async (args) => {
    return await client.callTool('search_thoughts', args);
  });

  server.registerTool('list_streams', {
    description:
      'List your streams (collections/folders for organizing thoughts). Streams can be nested hierarchically.',
    inputSchema: {
      page: z.number().int().min(1).default(1).optional().describe('Page number (default: 1)'),
      per_page: z.number().int().min(1).max(100).default(50).optional().describe('Items per page (default: 50, max: 100)'),
      parent_id: z.string().optional().describe('Filter by parent stream ID. Use "null" for root-level streams only.'),
      include_thought_count: z.boolean().default(false).optional().describe('Include count of thoughts in each stream'),
      search: z.string().optional().describe('Search streams by name or description (case-insensitive)'),
    },
  }, async (args) => {
    return await client.callTool('list_streams', args);
  });

  server.registerTool('get_stream', {
    description:
      'Get a stream by ID with its thoughts and child streams.',
    inputSchema: {
      stream_id: z.string().uuid().describe('The stream ID to retrieve'),
      include_thoughts: z.boolean().default(true).optional().describe('Include thoughts in this stream (default: true)'),
      thoughts_page: z.number().int().min(1).default(1).optional().describe('Page number for thoughts (default: 1)'),
      thoughts_per_page: z.number().int().min(1).max(100).default(20).optional().describe('Thoughts per page (default: 20, max: 100)'),
    },
  }, async (args) => {
    return await client.callTool('get_stream', args);
  });

  server.registerTool('search_streams', {
    description:
      'Search your streams by name or description. Returns matching streams.',
    inputSchema: {
      query: z.string().describe('Search query to match against stream name and description'),
      limit: z.number().int().min(1).max(100).default(20).optional().describe('Maximum number of results (default: 20, max: 100)'),
    },
  }, async (args) => {
    return await client.callTool('search_streams', args);
  });

  server.registerTool('get_stats', {
    description:
      'Get summary statistics about your captured thoughts: total count, breakdown by classification and category, date range, and stream count.',
    inputSchema: {},
  }, async (args) => {
    return await client.callTool('get_stats', args);
  });

  server.registerTool('list_recent_thoughts', {
    description:
      'Quickly get your most recently captured thoughts. A simpler alternative to list_thoughts when you just want to see recent activity.',
    inputSchema: {
      limit: z.number().int().min(1).max(50).default(10).optional().describe('Number of recent thoughts to return (default: 10, max: 50)'),
    },
  }, async (args) => {
    return await client.callTool('list_recent_thoughts', args);
  });

  // ---------------------------------------------------------------------------
  // Capture Write Tools
  // ---------------------------------------------------------------------------

  server.registerTool('create_thought', {
    description:
      'Capture a new thought with text, images, and/or links. At least one content type is required. Thoughts are automatically enriched with AI classification, categorization, entity extraction, and embeddings in the background.',
    inputSchema: {
      text: z.string().optional().describe('Text content for the thought (max 3000 characters). If longer, split into multiple thoughts.'),
      image_urls: z.array(z.string()).max(5).optional().describe('Array of image URLs to attach (max 5). If more, split across multiple thoughts.'),
      link_urls: z.array(z.string()).max(5).optional().describe('Array of link URLs to attach (max 5). If more, split across multiple thoughts.'),
      stream: z.string().optional().describe('Assign to a stream by name (case-insensitive). The stream must already exist.'),
      stream_id: z.string().uuid().optional().describe('Assign to a stream by ID. Takes precedence over stream name.'),
    },
  }, async (args) => {
    return await client.callTool('create_thought', args);
  });

  // ---------------------------------------------------------------------------
  // Page Tools
  // ---------------------------------------------------------------------------

  server.registerTool('list_pages', {
    description:
      'List your generated pages (documents created from thoughts) with optional filters for status, pinned state, and pagination. Returns page metadata without full content.',
    inputSchema: {
      page: z.number().int().min(1).default(1).optional().describe('Page number (default: 1)'),
      per_page: z.number().int().min(1).max(50).default(20).optional().describe('Items per page (default: 20, max: 50)'),
      status: z.enum(['generating', 'complete', 'failed', 'updating']).optional().describe('Filter by page status'),
      is_pinned: z.boolean().optional().describe('Filter by pinned state'),
      sort_by: z.enum(['newest', 'oldest', 'recently_updated']).optional().describe('Sort order (default: newest)'),
    },
  }, async (args) => {
    return await client.callTool('list_pages', args);
  });

  server.registerTool('get_page', {
    description:
      'Get a single page by ID with full content, metadata, and source thought IDs.',
    inputSchema: {
      page_id: z.string().uuid().describe('The page ID to retrieve'),
    },
  }, async (args) => {
    return await client.callTool('get_page', args);
  });

  server.registerTool('update_page', {
    description:
      "Update a page's title, content, and/or short description directly. This performs a direct edit without AI regeneration. Provide at least one of title, content, or short_description.",
    inputSchema: {
      page_id: z.string().uuid().describe('The page ID to update'),
      title: z.string().optional().describe('New title for the page'),
      content: z.string().optional().describe('New full markdown content for the page'),
      short_description: z.string().optional().describe('Short description/summary of the page (max 250 characters)'),
    },
  }, async (args) => {
    return await client.callTool('update_page', args);
  });

  server.registerTool('search_pages', {
    description:
      'Search pages by title keywords or content text. Returns matching pages with content previews.',
    inputSchema: {
      query: z.string().describe('Search query to match against page titles and content (case-insensitive)'),
      status: z.enum(['generating', 'complete', 'failed', 'updating']).optional().describe('Filter by page status (default: complete)'),
      limit: z.number().int().min(1).max(25).default(10).optional().describe('Maximum number of results (default: 10, max: 25)'),
    },
  }, async (args) => {
    return await client.callTool('search_pages', args);
  });

  // ---------------------------------------------------------------------------
  // Resonate Read Tools
  // ---------------------------------------------------------------------------

  server.registerTool('search_posts', {
    description:
      'Search public Resonate posts using semantic similarity. Find posts about any topic by describing what you are looking for.',
    inputSchema: {
      text: z.string().describe('Text to search for semantically'),
      limit: z.number().int().min(1).max(50).default(20).optional().describe('Maximum results (default: 20, max: 50)'),
      min_score: z.number().min(0).max(1).default(0.5).optional().describe('Minimum similarity score 0-1 (default: 0.5)'),
    },
  }, async (args) => {
    return await client.callTool('search_posts', args);
  });

  server.registerTool('list_posts', {
    description:
      'Browse public Resonate posts with filters and sorting. Use this to find trending, recent, or popular posts.',
    inputSchema: {
      page: z.number().int().min(1).default(1).optional().describe('Page number (default: 1)'),
      per_page: z.number().int().min(1).max(100).default(25).optional().describe('Items per page (default: 25, max: 100)'),
      category: z.string().optional().describe('Filter by category name (e.g., "Technology"). Case-insensitive.'),
      category_id: z.string().uuid().optional().describe('Filter by category ID'),
      classification: z.string().optional().describe('Filter by classification name. Case-insensitive.'),
      classification_id: z.string().uuid().optional().describe('Filter by classification ID'),
      sort_by: z.enum(['newest', 'oldest', 'most_upvoted', 'most_downvoted']).optional().describe('Sort order (default: newest)'),
      created_after: z.string().datetime().optional().describe('Filter posts created after this date (ISO 8601)'),
      created_before: z.string().datetime().optional().describe('Filter posts created before this date (ISO 8601)'),
      search: z.string().optional().describe('Text search in post content (case-insensitive substring match)'),
    },
  }, async (args) => {
    return await client.callTool('list_posts', args);
  });

  server.registerTool('get_post', {
    description:
      'Get full details for a single Resonate post including votes, reactions breakdown, topic cluster, and entities.',
    inputSchema: {
      post_id: z.string().uuid().describe('The post ID to retrieve'),
    },
  }, async (args) => {
    return await client.callTool('get_post', args);
  });

  server.registerTool('get_post_demographics', {
    description:
      'Get demographic voting breakdown for a Resonate post. Shows how different age groups, sexes, regions, and locations voted.',
    inputSchema: {
      post_id: z.string().uuid().describe('The post ID to get demographics for'),
      dimension: z.enum(['age', 'sex', 'country', 'state', 'region', 'zip']).optional().describe('Filter to a specific demographic dimension (optional, returns all if omitted)'),
    },
  }, async (args) => {
    return await client.callTool('get_post_demographics', args);
  });

  server.registerTool('get_topic_clusters', {
    description:
      'Get trending and active topic clusters from Resonate. Shows what topics people are posting and voting about, with heat scores and sentiment.',
    inputSchema: {
      status: z.enum(['emerging', 'trending', 'active', 'cooling', 'archived']).optional().describe('Filter by lifecycle status'),
      sort_by: z.enum(['heat_score', 'post_count', 'newest']).optional().describe('Sort order (default: heat_score)'),
      limit: z.number().int().min(1).max(50).default(20).optional().describe('Maximum results (default: 20, max: 50)'),
    },
  }, async (args) => {
    return await client.callTool('get_topic_clusters', args);
  });

  server.registerTool('get_my_votes', {
    description:
      'Get your voting history on Resonate posts. Search for posts you upvoted or downvoted by content text.',
    inputSchema: {
      page: z.number().int().min(1).default(1).optional().describe('Page number (default: 1)'),
      per_page: z.number().int().min(1).max(100).default(25).optional().describe('Items per page (default: 25, max: 100)'),
      vote_type: z.enum(['upvote', 'downvote']).optional().describe('Filter by vote type'),
      search: z.string().optional().describe('Search post content text (case-insensitive)'),
      created_after: z.string().datetime().optional().describe('Filter votes created after this date (ISO 8601)'),
      created_before: z.string().datetime().optional().describe('Filter votes created before this date (ISO 8601)'),
    },
  }, async (args) => {
    return await client.callTool('get_my_votes', args);
  });

  server.registerTool('get_my_post_performance', {
    description:
      'Get performance data for posts you published to Resonate. Shows vote counts, reactions, and demographic breakdowns for your content.',
    inputSchema: {
      page: z.number().int().min(1).default(1).optional().describe('Page number (default: 1)'),
      per_page: z.number().int().min(1).max(50).default(25).optional().describe('Items per page (default: 25, max: 50)'),
      sort_by: z.enum(['newest', 'most_upvoted', 'most_downvoted']).optional().describe('Sort order (default: newest)'),
    },
  }, async (args) => {
    return await client.callTool('get_my_post_performance', args);
  });

  // ---------------------------------------------------------------------------
  // Utility Tools
  // ---------------------------------------------------------------------------

  server.registerTool('get_usage', {
    description:
      'Get your API usage statistics including current usage, rate limits, and when limits reset. Useful for monitoring your API consumption.',
    inputSchema: {},
  }, async (args) => {
    return await client.callTool('get_usage', args);
  });

  server.registerTool('get_reactions', {
    description:
      'Get all available reaction types used on Resonate posts. Reactions are nuanced labels like "Resonates", "Insightful", "Fallacious" that people attach to their votes.',
    inputSchema: {
      vote_type: z.enum(['upvote', 'downvote']).optional().describe('Filter by vote type (upvote reactions or downvote reactions)'),
    },
  }, async (args) => {
    return await client.callTool('get_reactions', args);
  });

  server.registerTool('get_classifications', {
    description:
      'Get all available thought classifications/types (e.g., task, idea, theory, question). Use this to discover classification names for filtering thoughts.',
    inputSchema: {},
  }, async (args) => {
    return await client.callTool('get_classifications', args);
  });

  server.registerTool('get_categories', {
    description:
      'Get all available categories (e.g., Technology, Business, Health). Use this to discover category names for filtering thoughts.',
    inputSchema: {},
  }, async (args) => {
    return await client.callTool('get_categories', args);
  });
}
