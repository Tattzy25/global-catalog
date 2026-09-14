# Global Search Curl Calls

## Settings

- MCP endpoint: `https://globalsearch.anigok.com/mcp`
- Method: `POST`
- Header: `Content-Type: application/json`
- Header: `Accept: application/json, text/event-stream`
- Transport requirement: the current MCP handler requires both `application/json` and `text/event-stream` in the `Accept` header

## search_catalog

```bash
curl -X POST https://globalsearch.anigok.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_catalog",
      "arguments": {
        "meta": {
          "ucp-agent": {
            "profile": "https://example.com/.well-known/ucp"
          }
        },
        "catalog": {
          "query": "trail running shoes",
          "context": {
            "address_country": "US",
            "address_region": "NY",
            "postal_code": "10001",
            "language": "en-US",
            "currency": "USD",
            "intent": "Buyer is looking for trail running shoes under $150"
          },
          "filters": {
            "available": true,
            "ships_to": {
              "country": "US"
            },
            "condition": ["new"],
            "price": {
              "min": 5000,
              "max": 15000
            },
            "price_tier": ["low", "medium"]
          },
          "pagination": {
            "limit": 10
          }
        }
      }
    }
  }'
```

## search_catalog with saved catalog

```bash
curl -X POST https://globalsearch.anigok.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_catalog",
      "arguments": {
        "meta": {
          "ucp-agent": {
            "profile": "https://example.com/.well-known/ucp"
          }
        },
        "catalog": {
          "catalog_id": "gid://shopify/CatalogConfiguration/123456",
          "query": "organic coffee beans",
          "view": "offer",
          "pagination": {
            "limit": 20
          }
        }
      }
    }
  }'
```

## lookup_catalog

```bash
curl -X POST https://globalsearch.anigok.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "lookup_catalog",
      "arguments": {
        "meta": {
          "ucp-agent": {
            "profile": "https://shopify.dev/ucp/agent-profiles/2026-08-25/valid-with-capabilities.json"
          }
        },
        "catalog": {
          "ids": [
            "gid://shopify/p/7f3a2b8c1d9e",
            "gid://shopify/ProductVariant/87654321",
            "https://example-running.myshopify.com/products/trail-runner-pro"
          ],
          "context": {
            "address_country": "US"
          }
        }
      }
    }
  }'
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "structuredContent": {
      "ucp": {
        "version": "2026-08-25",
        "capabilities": {
          "dev.ucp.shopping.catalog.lookup": [{"version": "2026-08-25"}],
          "dev.shopify.catalog.global": [{"version": "2026-08-25"}]
        }
      },
      "products": [
        {
          "id": "gid://shopify/p/7f3a2b8c1d9e",
          "title": "Trail Runner Pro",
          "description": {
            "html": "Lightweight trail running shoe designed for road and light trail."
          },
          "price_range": {
            "min": {"amount": 8999, "currency": "USD"},
            "max": {"amount": 12999, "currency": "USD"}
          },
          "variants": [
            {
              "id": "gid://shopify/ProductVariant/12345678",
              "sku": "TRP-BLK-10",
              "title": "Black / Size 10",
              "price": {"amount": 8999, "currency": "USD"},
              "checkout_url": "https://example-running.myshopify.com/cart/12345678:1",
              "condition": ["new"],
              "eligible": {"native_checkout": true},
              "availability": {"available": true, "status": "in_stock", "running_low": false},
              "requires": {"shipping": true, "selling_plan": false, "components": false},
              "inputs": [
                {"id": "gid://shopify/p/7f3a2b8c1d9e", "match": "featured"}
              ],
              "seller": {
                "name": "Example Running",
                "id": "gid://shopify/Shop/987654321",
                "domain": "example-running.myshopify.com",
                "url": "https://example-running.myshopify.com",
                "links": [
                  {
                    "type": "refund_policy",
                    "url": "https://example-running.myshopify.com/policies/refunds"
                  }
                ]
              }
            }
          ]
        }
      ],
      "messages": [
        {
          "type": "info",
          "code": "not_found",
          "content": "gid://shopify/ProductVariant/87654321"
        }
      ]
    }
  }
}
```

## get_product

```bash
curl -X POST https://globalsearch.anigok.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "get_product",
      "arguments": {
        "meta": {
          "ucp-agent": {
            "profile": "https://shopify.dev/ucp/agent-profiles/2026-08-25/valid-with-capabilities.json"
          }
        },
        "catalog": {
          "id": "gid://shopify/p/7f3a2b8c1d9e",
          "selected": [
            {"name": "Color", "label": "Black"}
          ],
          "context": {
            "address_country": "US"
          }
        }
      }
    }
  }'
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "structuredContent": {
      "ucp": {
        "version": "2026-08-25",
        "capabilities": {
          "dev.ucp.shopping.catalog.lookup": [{"version": "2026-08-25"}],
          "dev.shopify.catalog.global": [{"version": "2026-08-25"}]
        }
      },
      "product": {
        "id": "gid://shopify/p/7f3a2b8c1d9e",
        "title": "Trail Runner Pro",
        "description": {
          "html": "Lightweight trail running shoe designed for road and light trail."
        },
        "url": "https://example-running.myshopify.com/products/trail-runner-pro",
        "price_range": {
          "min": {"amount": 8999, "currency": "USD"},
          "max": {"amount": 12999, "currency": "USD"}
        },
        "media": [
          {
            "type": "image",
            "url": "https://cdn.shopify.com/products/trail-runner-pro-black.jpg",
            "alt_text": "Trail Runner Pro in Black"
          }
        ],
        "options": [
          {
            "name": "Color",
            "values": [
              {"label": "Black", "available": true, "exists": true},
              {"label": "Blue", "available": true, "exists": true}
            ]
          },
          {
            "name": "Size",
            "values": [
              {"label": "8", "available": true, "exists": true},
              {"label": "9", "available": true, "exists": true},
              {"label": "10", "available": true, "exists": true},
              {"label": "11", "available": false, "exists": true},
              {"label": "12", "available": true, "exists": true}
            ]
          }
        ],
        "selected": [
          {"name": "Color", "label": "Black"}
        ],
        "variants": [
          {
            "id": "gid://shopify/ProductVariant/12345678",
            "sku": "TRP-BLK-10",
            "title": "Black / Size 10",
            "description": {"plain": "Black, Size 10"},
            "price": {"amount": 8999, "currency": "USD"},
            "checkout_url": "https://example-running.myshopify.com/cart/12345678:1",
            "condition": ["new"],
            "eligible": {"native_checkout": true},
            "availability": {"available": true, "status": "in_stock", "running_low": false},
            "requires": {"shipping": true, "selling_plan": false, "components": false},
            "options": [
              {"name": "Color", "label": "Black"},
              {"name": "Size", "label": "10"}
            ],
            "seller": {
              "name": "Example Running",
              "id": "gid://shopify/Shop/987654321",
              "domain": "example-running.myshopify.com",
              "url": "https://example-running.myshopify.com",
              "links": [
                {
                  "type": "refund_policy",
                  "url": "https://example-running.myshopify.com/policies/refunds"
                }
              ]
            }
          }
        ],
        "rating": {
          "value": 4.5,
          "scale_max": 5,
          "count": 120
        }
      }
    }
  }
}
```

## Global Catalog extension

The Global Catalog extension adds Shopify-specific fields to the base UCP catalog tools. This server implements the `dev.shopify.catalog.global` extension (version `2026-08-25`), which extends `dev.ucp.shopping.catalog.search` and `dev.ucp.shopping.catalog.lookup`. It is scoped to the global catalog — products from across all Shopify merchants.

### Filters

All three tools (`search_catalog`, `lookup_catalog`, and `get_product`) accept a `catalog.filters` object with the following Shopify-specific fields:

| Field | Type | Default | Description |
| - | - | - | - |
| `available` | boolean | `true` | When `true` (default), only sale-ready items are returned. Set to `false` to include unavailable items. |
| `condition` | array | — | Product condition filter. Known values: `"new"`, `"secondhand"`. Multiple values use OR logic. Absent means no condition filter. |
| `ships_to` | object | — | Filter to products that ship to a given location. When country matches `context.address_country`, the implementation might enrich with context region and postal code. Accepts `country` (required, ISO 3166-1 alpha-2), `region`, and `postal_code`. |
| `ships_from` | array | — | Filter by merchant origin country. Each entry accepts `country` (required, ISO 3166-1 alpha-2). Multiple entries use OR logic. Digital products that don't require shipping can still match this filter. |
| `shops` | array | — | Restrict results to specific shops by GID. You can pass up to 1000 shop IDs per request. |

`search_catalog` also accepts these additional filters:

| Filter | Type | Default | Description |
| - | - | - | - |
| `categories` | array | — | Filter by product category. Each item is a taxonomy category GID (for example, `"gid://shopify/TaxonomyCategory/123"`). Multiple values use OR logic. |
| `attributes` | array | — | Filter by Shopify taxonomy attributes. Supported names are `Color`, `Size`, and `Target gender`. Entries combine with AND logic. Values within one entry combine with OR logic. Unsupported attribute names are ignored and returned in `messages`. |
| `rating` | object | — | Filter by variant rating. Accepts `variant`, which matches products with at least one variant whose rating meets the given thresholds. `variant.min` sets the minimum rating value (0–5 scale) and `variant.min_count` sets the minimum number of reviews. |
| `price_tier` | array | — | Filter by relative price tier within each product's category. Supported values are `low`, `medium`, and `high`. Multiple values use OR logic. Unsupported values are ignored and returned in `messages`. |

```json
{
  "catalog": {
    "query": "running shoes",
    "filters": {
      "available": true,
      "condition": ["new"],
      "ships_to": {"country": "US"},
      "ships_from": [{"country": "US"}],
      "attributes": [
        {"name": "Color", "values": ["Black", "Blue"]},
        {"name": "Size", "values": ["10"]},
        {"name": "Target gender", "values": ["Unisex"]}
      ],
      "rating": {"variant": {"min": 4.5, "min_count": 10}},
      "price_tier": ["low", "medium"]
    }
  }
}
```

### Similarity search

Use `catalog.like` in a `search_catalog` request to find products similar to a reference product, variant, or image. Pass one item as one of:

- **Item reference:** A product or variant GID. For example, `{"id": "gid://shopify/p/..."}`, `{"id": "gid://shopify/Product/..."}`, or `{"id": "gid://shopify/ProductVariant/..."}`.
- **Image content:** A base64-encoded image with its MIME type. For example, `{"image": {"content_type": "image/jpeg", "data": "<base64>"}}`.

You can combine `like` with `query` in a single request to narrow similarity results by keyword. When `like` contains an image and `query` is present, Global Catalog uses multimodal search. Multimodal search uses the text query to describe what the agent is looking for and the image to provide visual context, such as style, shape, or pattern. When `like` contains only an image, Global Catalog uses visual similarity search, which returns items that visually resemble the image without additional text intent.

```json
{
  "catalog": {
    "query": "trail running shoes",
    "like": [
      {"id": "gid://shopify/p/7f3a2b8c1d9e"}
    ],
    "filters": {
      "ships_to": {"country": "US"}
    }
  }
}
```

### Inferred product fields

All three tool responses can include fields inferred or enriched by Shopify. These fields might not always be present or might vary in accuracy depending on available product data. Treat them as discovery and merchandising signals, not as merchant-authored source text.

| Field | Type | Tag | Description |
| - | - | - | - |
| `description` | object | `Inferred` | Product description generated or enriched by Shopify. |
| `options` | Array\[ProductOption] | `Inferred` | Product options normalized for catalog discovery and variant selection. |
| `metadata.attributes` | Array\[Attribute] | `Inferred` | Product attributes such as material, style, and occasion. |
| `metadata.tech_specs` | Array\[string] | `Inferred` | Technical specifications. |
| `metadata.top_features` | Array\[string] | `Inferred` | Top product features. |
| `metadata.unique_selling_points` | Array\[string] | `Inferred` | Unique selling propositions. |
| `variants[].condition` | Array\[string] | `Inferred` | Product condition labels for this variant. Known values are `"new"` and `"secondhand"`. |

### Variant fields

Variants include checkout URLs, purchase requirements, inventory signals, and seller identity:

| Field | Type | Description |
| - | - | - |
| `checkout_url` | string | Direct checkout URL for this variant. |
| `requires.shipping` | boolean | Whether a shipping address is needed. When `false`, checkout can skip address collection. |
| `requires.components` | boolean | Whether the variant requires bundle components. When `true`, the variant can only be purchased as a parent bundle. |
| `condition` | Array\[string] | Product condition labels for this variant. Known values: `"new"`, `"secondhand"`. |
| `eligible.native_checkout` | boolean | Whether this variant supports native (non-redirect) checkout. Default `false`. |
| `availability.running_low` | boolean | Whether inventory is limited. Only meaningful when `available` is `true`. |
| `seller.id` | string | The shop GID. |
| `seller.url` | string | The storefront URL. |
| `seller.domain` | string | The primary domain of the shop. |

**Info:** `seller.name` and `seller.links` are part of the base UCP spec and always present in Global Catalog responses.

### Example response

The following example shows a `search_catalog` response with Global Catalog extension fields:

```json
{
  "result": {
    "structuredContent": {
      "ucp": {
        "version": "2026-08-25",
        "capabilities": {
          "dev.ucp.shopping.catalog.search": [{"version": "2026-08-25"}],
          "dev.shopify.catalog.global": [{"version": "2026-08-25"}]
        }
      },
      "products": [
        {
          "id": "gid://shopify/p/7f3a2b8c1d9e",
          "title": "Trail Runner Pro",
          "description": {"html": "<p>Lightweight trail running shoe for road and light trail.</p>"},
          "price_range": {
            "min": {"amount": 8999, "currency": "USD"},
            "max": {"amount": 12999, "currency": "USD"}
          },
          "metadata": {
            "top_features": ["Lightweight", "Breathable mesh upper", "Cushioned sole"],
            "unique_selling_points": ["Designed for road and light trail", "Responsive foam midsole"]
          },
          "variants": [
            {
              "id": "gid://shopify/ProductVariant/12345678",
              "title": "Black / Size 10",
              "price": {"amount": 8999, "currency": "USD"},
              "checkout_url": "https://example-running.myshopify.com/cart/12345678:1",
              "condition": ["new"],
              "eligible": {"native_checkout": true},
              "availability": {
                "available": true,
                "status": "in_stock",
                "running_low": false
              },
              "requires": {"shipping": true, "selling_plan": false, "components": false},
              "seller": {
                "name": "Example Running",
                "id": "gid://shopify/Shop/987654321",
                "domain": "example-running.myshopify.com",
                "url": "https://example-running.myshopify.com",
                "links": [
                  {"type": "refund_policy", "url": "https://example-running.myshopify.com/policies/refunds"}
                ]
              }
            }
          ]
        }
      ]
    }
  }
}
```

## Promoted placements

Promoted placements extend `search_catalog` with an optional paid-placement flow. When you pass a `catalog_id` for a saved catalog that has promoted placements enabled, Shopify blends promoted variants into the ranked results. You earn commission on attributed purchases when buyers click through using the variant `url` exactly as provided.

### How it works

- Pass `catalog.catalog_id` from an affiliate-enabled saved catalog on your `search_catalog` calls.
- Shopify determines whether to blend promoted placements into the results based on the catalog's server-managed configuration.
- Requests without an affiliate-enabled catalog return only organic variants.
- Callers who aren't approved receive organic variants and a `messages` note explaining they aren't authorized for promoted placements.

### Identifying promoted variants

Inspect each variant in the `search_catalog` response. A promoted variant includes a `placement` object. Organic variants omit it.

Promoted variant:

```json
{
  "id": "gid://shopify/ProductVariant/45012",
  "placement": {
    "type": "affiliate",
    "commission": {
      "percentage": {
        "value": 1.5
      }
    }
  }
}
```

Organic variant:

```json
{
  "id": "gid://shopify/ProductVariant/91823"
}
```

| Field | Type | Description |
| - | - | - |
| `variants[].placement` | object | Marks the variant as a promoted placement. Present only on promoted placements. |
| `variants[].placement.type` | string | The placement type. The well-known value is `"affiliate"`. |
| `variants[].placement.commission` | object | Describes a merchant-provided additional commission. Present only when a merchant offers additional commission. |
| `variants[].placement.commission.percentage.value` | number | The merchant-provided additional commission percentage, added to the base rate. |

### Preserving attribution

In an authorized response, all variant URLs include `shclid` and `shcgid` attribution parameters — whether the variant is promoted or organic. Unauthorized responses omit these parameters.

```text
https://{merchant_site}/products/{product_handle}?variant={v}&utm_source=shopify&utm_medium=catalog&shclid={click_id}&shcgid={catalog_id}
```

| Parameter | Description |
| - | - |
| `utm_source=shopify` | Identifies Shopify-sourced traffic for merchant attribution. |
| `utm_medium=catalog` | Identifies Global Catalog traffic. |
| `shclid` | Identifies the click for attribution. |
| `shcgid` | Identifies the developer's catalog for attribution and payout. |

Commissions are credited only when you send buyers through the variant `url` exactly as provided, with attribution parameters intact. Rerouting, masking the link behind your own domain, or altering parameters breaks attribution and disqualifies the conversion.

### Commission

- Base rate: 0.3% (30 bps) on attributed purchases.
- Commission applies to every item in the attributed order that's available through the Global Catalog, not only the clicked product.
- Conversions are attributed using a last-click methodology with a 7-day attribution window.
- When `placement.commission` is present, the merchant-provided percentage is added to the base rate.

### Disclosure

When you show promoted placements:

- Tell users that you may earn a commission, such as "We may earn a commission on purchases."
- Label promoted placements so users can tell them apart from organic variants.
- Don't bury the disclosure in a footer or privacy policy.
- Don't make false or misleading claims about products, prices, merchants, or Shopify.

These obligations include US FTC material-connection requirements and comparable advertising-transparency and sponsored-content rules in the EU, the UK, and other jurisdictions where you operate.


## Notes

- The caller provides `meta["ucp-agent"].profile` on every call.
- The server proxies to `https://catalog.shopify.com/api/ucp/mcp`.
- `catalog.saved_catalog_slug` is a deprecated compatibility alias for `catalog.catalog_id`. Use `catalog.catalog_id` for new integrations. If both are passed, `catalog.catalog_id` takes precedence.
- `catalog.like` accepts an item reference or image content. Pass both `catalog.query` and an image for multimodal search; pass only an image for visual similarity search.
- `catalog.filters.available` defaults to true (only sale-ready items). Set to false to include unavailable items.
- `catalog.filters.ships_to` accepts country (ISO 3166-1 alpha-2), region, and postal_code.
- `catalog.filters.ships_from` accepts an array of country codes; multiple entries use OR logic. Digital products that don't require shipping can still match.
- `catalog.filters.price` accepts min and max integers in minor currency units. Example: `{"min": 5000, "max": 20000}` = $50.00–$200.00 USD.
- `catalog.filters.condition` known values: "new", "secondhand". Multiple values use OR logic.
- `catalog.filters.shops` accepts shop GIDs, e.g. `gid://shopify/Shop/987654321`. Up to 1000 shop IDs per request.
- `catalog.filters.attributes` supports Color, Size, and Target gender. Entries combine with AND logic; values within one entry combine with OR logic. Unsupported attribute names are ignored and returned in messages.
- `catalog.filters.rating.variant.min` is a 0–5 scale; `variant.min_count` is the minimum number of reviews.
- `catalog.filters.price_tier` supported values: low, medium, high. Multiple values use OR logic. Unsupported values are ignored and returned in messages.
- `catalog.filters.categories` accepts id (required) and taxonomy (optional, defaults to Shopify's standard taxonomy). Multiple values use OR logic.
- `catalog.view` — use "offer" for comparison shopping. When absent, the server returns its default shape.
- `catalog.pagination` is cursor-based. Pass the returned `pagination.cursor` as `catalog.pagination.cursor` to request the next page. `limit` is an integer, min 1, default 10, max 50. You can paginate up to 1,000 results; beyond that depth, `has_next_page` is false regardless of how many results match.
- `total_count` in the response is an estimate of how many results match, not an exact count. Don't rely on it for precise totals or to calculate an exact number of pages.
- `lookup_catalog` requires `catalog.ids` — an array of 1 to 50 identifiers. Accepts `gid://shopify/p/{upid}`, `gid://shopify/ProductVariant/{id}`, and http/https Shopify product URLs. Multiple IDs that resolve to the same product are grouped into a single product in the response.
- `lookup_catalog` response conforms to the UCP catalog lookup response, including products with inputs correlation on each variant and `not_found` messages for unresolved identifiers.
- `get_product` requires `catalog.id` — accepts `gid://shopify/p/{upid}` or `gid://shopify/ProductVariant/{id}`.
- `get_product` accepts `catalog.selected` (option selections for variant narrowing), `catalog.preferences` (option names in relaxation priority order), and `catalog.view` — use `"summary"` for a condensed product detail view.
- `get_product` response includes `product.selected` reflecting effective option selections, option values with `available` and `exists` signals, and variants matching the selection.
- This server implements the `dev.shopify.catalog.global` extension (version `2026-08-25`), extending `dev.ucp.shopping.catalog.search` and `dev.ucp.shopping.catalog.lookup`.
- Calls to this endpoint must include `Accept: application/json, text/event-stream`.
