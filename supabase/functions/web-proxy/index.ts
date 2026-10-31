const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");

    if (!target) {
      return new Response(
        JSON.stringify({ error: "Missing 'url' query parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsedTarget: URL;
    try {
      parsedTarget = new URL(target);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (parsedTarget.protocol !== "http:" && parsedTarget.protocol !== "https:") {
      return new Response(
        JSON.stringify({ error: "Only http/https URLs are allowed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the target page
    const fetchResponse = await fetch(parsedTarget.href, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    const contentType = fetchResponse.headers.get("content-type") || "";
    const finalUrl = fetchResponse.url || parsedTarget.href;
    const finalUrlObj = new URL(finalUrl);

    // If it's HTML, rewrite links and strip frame-busting headers
    if (contentType.includes("text/html")) {
      let html = await fetchResponse.text();

      // Inject a <base> tag so relative resources resolve to the origin
      const baseTag = `<base href="${finalUrl}">`;
      if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
      } else if (/<html[^>]*>/i.test(html)) {
        html = html.replace(/<html([^>]*)>/i, `<html$1><head>${baseTag}</head>`);
      } else {
        html = `${baseTag}${html}`;
      }

      // Inject a script to intercept X-Frame-Options / frame-busting JS
      const interceptor = `<script>(function(){
        // Neutralize frame-busting scripts
        try { top = self; } catch(e) {}
        Object.defineProperty(window, 'top', { get: function() { return window; }, configurable: false });
        Object.defineProperty(window, 'self', { get: function() { return window; }, configurable: false });
        Object.defineProperty(window, 'parent', { get: function() { return window; }, configurable: false });
      })();</script>`;

      if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/<head([^>]*)>/i, `<head$1>${interceptor}`);
      }

      // Rewrite absolute resource URLs to go through the proxy
      const proxyBase = `${url.origin}/functions/v1/web-proxy?url=`;

      // Rewrite CSS/JS/img links with absolute URLs
      html = html.replace(/(href|src)=(["'])(https?:\/\/[^"']+)\2/gi, (match, attr, quote, resourceUrl) => {
        // Don't rewrite data: or blob: URLs
        if (resourceUrl.startsWith("data:") || resourceUrl.startsWith("blob:")) return match;
        // Don't rewrite same-origin relative
        return `${attr}=${quote}${proxyBase}${encodeURIComponent(resourceUrl)}${quote}`;
      });

      // Remove X-Frame-Options and CSP meta tags that prevent embedding
      html = html.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, "");
      html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, "");

      return new Response(html, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=utf-8",
          "X-Proxied-By": "Veil-Proxy",
        },
      });
    }

    // For non-HTML resources (CSS, JS, images, fonts), pass through with CORS
    const body = await fetchResponse.arrayBuffer();
    const passthroughHeaders: Record<string, string> = {
      ...corsHeaders,
      "Content-Type": contentType,
      "X-Proxied-By": "Veil-Proxy",
    };

    // Add cache headers for static resources
    if (contentType.includes("css") || contentType.includes("javascript") || contentType.includes("image") || contentType.includes("font")) {
      passthroughHeaders["Cache-Control"] = "public, max-age=3600";
    }

    return new Response(body, {
      status: 200,
      headers: passthroughHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Proxy request failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
