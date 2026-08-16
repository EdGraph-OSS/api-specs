// Strips hardcoded, environment-specific values the service emitters bake into
// the descriptions.
//
// The case that prompted this: every description declares its OAuth2 token URL
// as `http://localhost:5305/connect/token` — a developer machine address that
// ships to every environment. It is wrong in the reference, and it is wrong in
// the four SDKs generated from the same file.
//
// Per-environment `servers` are deliberately left alone. Those genuinely differ
// per environment and are the reason the descriptions are published per
// environment in the first place.
//
// Usage in redocly.yaml:
//
//   plugins:
//     - './plugins/normalize-environment.js'
//   decorators:
//     edgraph/normalize-environment:
//       tokenUrl: https://login.edgraph.com/connect/token
//
// With no `tokenUrl` configured the decorator derives one from the description's
// own server host, turning api.<host> into login.<host>. Configure it explicitly
// when the identity provider does not follow that pattern.

/** Hosts that should never appear in a published description. */
const LOCAL_HOST = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i;

/** api.edgraph.com -> login.edgraph.com */
function deriveIdentityHost(serverUrl) {
  try {
    const { protocol, host } = new URL(serverUrl);
    if (!host.startsWith('api.')) return null;
    return `${protocol}//login.${host.slice('api.'.length)}`;
  } catch {
    return null;
  }
}

function rewriteFlowUrls(flows, replacement, report) {
  for (const [flowName, flow] of Object.entries(flows ?? {})) {
    for (const field of ['tokenUrl', 'authorizationUrl', 'refreshUrl']) {
      const value = flow?.[field];
      if (typeof value !== 'string' || !LOCAL_HOST.test(value)) continue;

      // Keep the path the service declared; only the origin is wrong.
      const path = value.replace(LOCAL_HOST, '');
      flow[field] = `${replacement}${path}`;
      report.push(`${flowName}.${field}: ${value} -> ${flow[field]}`);
    }
  }
}

function normalizeEnvironment({ tokenUrl } = {}) {
  return {
    Root: {
      leave(root, ctx) {
        const schemes = root.components?.securitySchemes;
        if (!schemes) return;

        // An explicit setting wins; otherwise infer from this description's own
        // server, which is already environment-correct.
        const origin = tokenUrl
          ? tokenUrl.replace(/\/connect\/token\/?$/, '')
          : deriveIdentityHost(root.servers?.[0]?.url);

        if (!origin) return;

        const report = [];
        for (const scheme of Object.values(schemes)) {
          if (scheme?.type === 'oauth2') rewriteFlowUrls(scheme.flows, origin, report);
        }

        if (report.length > 0 && process.env.REDOCLY_DECORATOR_VERBOSE) {
          ctx.report({
            message: `normalize-environment rewrote ${report.length} URL(s): ${report.join('; ')}`,
            location: ctx.location,
            forceSeverity: 'warn',
          });
        }
      },
    },
  };
}

// Exported as a plugin-creator function. Redocly CLI 2 treats a bare object
// with an `id` as the deprecated format and logs a warning on every run.
module.exports = function edgraphPlugin() {
  return {
    id: 'edgraph',
    decorators: {
      oas3: {
        'normalize-environment': normalizeEnvironment,
      },
    },
  };
};
