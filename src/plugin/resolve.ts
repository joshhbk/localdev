import { join } from "node:path";
import { resolvePackageTarget } from "../shared/package-targets.js";
import type { ResolveLinkedPackageOptions } from "../shared/types.js";

export function resolveLinkedPackage(
  options: ResolveLinkedPackageOptions,
): string | null {
  const target = resolvePackageTarget(options);
  return target ? join(options.packageDir, target.distPath) : null;
}
