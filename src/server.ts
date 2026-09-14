import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

const helloInputSchema = z.object({
  name: z.string().optional()
});

const searchCatalogInputSchema = z.object({
  meta: z
    .object({
      "ucp-agent": z.object({
        profile: z
          .string()
          .url()
          .describe("The URI to your agent's UCP profile for capability negotiation.")
      })
    })
    .describe("Request metadata. You must include ucp-agent.profile."),
  catalog: z
    .object({
      query: z
        .string()
        .describe("Free-text search query. For example, \"trail running shoes\", \"organic coffee beans\".")
        .optional(),
      catalog_id: z
        .string()
        .describe("ID of a catalog configuration saved in the Dev Dashboard. Its filters set the request boundaries: values within them narrow the results, while values outside them fall back to the saved filters. The saved query prefix is prepended to catalog.query, combining both queries. Promoted placement can be enabled for saved catalog, refer to Earn with promoted placements for setup, payouts, and disclosure details.")
        .optional(),
      saved_catalog_slug: z
        .string()
        .describe("Deprecated compatibility alias for catalog.catalog_id. Use catalog.catalog_id for new integrations. If you pass both fields, then catalog.catalog_id takes precedence.")
        .optional(),
      like: z
        .array(z.object({}).passthrough())
        .describe("Similar item to search by. Use either an item reference or image content. Pass both catalog.query and an image in catalog.like for multimodal search. Multimodal search uses the text query to describe what the agent is looking for and the image to provide visual context, such as style, shape, or pattern. Pass only an image for visual similarity search, which returns items that visually resemble the image without additional text intent.")
        .optional(),
      context: z
        .object({
          address_country: z.string().optional(),
          address_region: z.string().optional(),
          postal_code: z.string().optional(),
          language: z.string().optional(),
          currency: z.string().optional(),
          intent: z.string().optional()
        })
        .describe("Buyer signals for relevance and localization (address_country, address_region, postal_code, language, currency, and intent).")
        .optional(),
      filters: z
        .object({
          available: z
            .boolean()
            .describe("Filter by availability. Defaults to true (only sale-ready items). Set to false to include unavailable items."),
          ships_to: z
            .object({
              country: z.string().optional(),
              region: z.string().optional(),
              postal_code: z.string().optional()
            })
            .describe("Filter to products that ship to a given location. Accepts country (ISO 3166-1 alpha-2), region, and postal_code."),
          ships_from: z
            .array(
              z.object({
                country: z.string().describe("Merchant origin country (ISO 3166-1 alpha-2).")
              })
            )
            .describe("Filter by merchant origin country. Each entry accepts country (ISO 3166-1 alpha-2). Multiple entries use OR logic. Digital products that don't require shipping can still match this filter."),
          price: z
            .object({
              min: z.number().int().optional(),
              max: z.number().int().optional()
            })
            .describe("Price range in minor currency units. Accepts min and max integers. For example, {\"min\": 5000, \"max\": 20000} = $50.00–$200.00 USD."),
          condition: z
            .array(z.string())
            .describe("Product condition filter. Known values: \"new\", \"secondhand\". Multiple values use OR logic."),
          shops: z
            .array(z.string())
            .describe("Filter to specific shops. Accepts an array of shop GIDs, for example gid://shopify/Shop/987654321. You can pass up to 1000 shop IDs per request."),
          attributes: z
            .array(z.object({}).passthrough())
            .describe("Filter by Shopify taxonomy attributes. Supported names are Color, Size, and Target gender. Entries combine with AND logic. Values within one entry combine with OR logic. Unsupported attribute names are ignored and returned in messages."),
          rating: z
            .object({
              variant: z
                .object({
                  min: z.number().min(0).max(5).optional().describe("The minimum rating value (0–5 scale)."),
                  min_count: z.number().int().min(0).optional().describe("The minimum number of reviews.")
                })
            })
            .describe("Filter by variant rating. variant matches products with at least one variant whose rating meets the given thresholds. Set variant.min for the minimum rating value (0–5 scale) and variant.min_count for the minimum number of reviews."),
          price_tier: z
            .array(z.string())
            .describe("Filter by relative price tier within each product's category. Supported values are low, medium, and high. Multiple values use OR logic. Unsupported values are ignored and returned in messages."),
          categories: z
            .array(
              z.object({
                id: z.string().describe("The taxonomy ID."),
                taxonomy: z.string().optional().describe("The taxonomy source. Defaults to Shopify's standard taxonomy.")
              })
            )
            .describe("Filter by product category using taxonomy IDs. Each item accepts id (required) and taxonomy (optional, defaults to Shopify's standard taxonomy). Multiple values use OR logic.")
        })
        .optional(),
      view: z
        .string()
        .describe("Predefined output shape for the response. Use \"offer\" for comparison shopping. When absent, the server returns its default shape.")
        .optional(),
      pagination: z
        .object({
          cursor: z
            .string()
            .describe("Opaque cursor from a previous response. Pass the returned pagination.cursor as catalog.pagination.cursor to request the next page.")
            .optional(),
          limit: z
            .number()
            .int()
            .min(1)
            .max(50)
            .describe("Page size. Integer, min 1, default 10, max 50. You can paginate up to 1,000 results. Beyond that depth, has_next_page is false regardless of how many results match.")
            .optional()
        })
        .describe("Cursor-based pagination controls. The cursor carries only the next result offset, so the request's limit controls page size. The total_count field in the response is an estimate of how many results match the query, not an exact count. Don't rely on it for precise totals or to calculate an exact number of pages.")
        .optional()
    })
    .describe("The catalog object containing the search parameters. All parameters are wrapped in a catalog object. Refer to the UCP catalog search spec for the complete schema.")
});

function createServer() {
  const server = new McpServer({
    name: "catalog",
    version: "1.0.0"
  });

  server.registerTool(
    "hello",
    {
      description: "Returns a greeting message",
      inputSchema: helloInputSchema
    },
    async ({ name }: z.infer<typeof helloInputSchema>) => {
      return {
        content: [
          {
            text: `Hello, ${name ?? "World"}!`,
            type: "text"
          }
        ]
      };
    }
  );

  server.registerTool(
    "search_catalog",
    {
      description: "Searches for products across all Shopify merchants. The response conforms to the UCP catalog search response, including a UCP metadata envelope; products with title, description, price range (minor units), media, and variants. Use this when a customer asks for products matching criteria from any merchant, or wants to compare products across multiple stores. Some response fields (description, options, metadata.attributes, metadata.tech_specs, metadata.top_features, metadata.unique_selling_points, variants[].condition) are inferred by Shopify and may not always be present or may vary in accuracy. Treat them as discovery and merchandising signals, not as merchant-authored source text.",
      inputSchema: searchCatalogInputSchema
    },
    async ({ meta, catalog }: z.infer<typeof searchCatalogInputSchema>) => {
      const response = await fetch("https://catalog.shopify.com/api/ucp/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "tools/call",
          id: 2,
          params: {
            name: "search_catalog",
            arguments: {
              meta,
              catalog
            }
          }
        })
      });

      const result = await response.json() as Record<string, unknown>;

      return {
        content: [
          {
            text: JSON.stringify(result),
            type: "text"
          }
        ],
        structuredContent: result
      };
    }
  );

  return server;
}

export default {
  fetch(request, env, ctx) {
    return createMcpHandler(createServer)(request, env, ctx);
  }
} satisfies ExportedHandler;
