import { buildInflection, gather } from "graphile-build";
import { resolvePresets } from "graphile-config";
import { exportValueAsString } from "graphile-export";
import { writeFile } from "node:fs/promises";
import { preset } from "../preset.mjs";

const resolvedPreset = resolvePresets([preset]);
const inflection = buildInflection(resolvedPreset);
const input = await gather(resolvedPreset, { inflection });
const exportResult = await exportValueAsString("pgRegistry", input.pgRegistry, {
  mode: "graphql-js",
  prettier: true,
});
const v = process.versions.node.split(".").map((p) => parseInt(p, 10));
if (v[0] < 20 || (v[0] === 20 && v[1] < 11) || (v[0] === 21 && v[1] < 2)) {
  throw new Error(`import.meta.dirname requires Node v20.11+ or v21.2+`);
}
// Using null prototypes everywhere causes TypeScript to fail to infer the types, so get rid of that
const code = "// @ts-check\n" + exportResult.code;
await writeFile(`${import.meta.dirname}/../registry.mjs`, code);

await preset.pgServices?.[0].release?.();
console.log(`Registry written`);
