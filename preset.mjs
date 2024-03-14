// @ts-check
import { defaultPreset } from "graphile-build";
import { defaultPreset as pgPreset } from "graphile-build-pg";
import { makePgService } from "@dataplan/pg/adaptors/pg";

/** @type {GraphileConfig.Preset} */
export const preset = {
  extends: [defaultPreset, pgPreset],
  pgServices: [
    makePgService({
      connectionString: "postgres:///abecc",
      schemas: ["abecc"],
    }),
  ],
};
