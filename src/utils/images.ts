import type { ImageMetadata } from 'astro';

/**
 * 在构建时收集 `src/assets/img/` 下所有图片。
 * `import.meta.glob` 仅在 `.astro` / `.ts` 等被 Vite 处理的模块中可用。
 *
 * 返回一个对象，key 为以 `/` 开头的项目根相对路径（如 `/src/assets/img/test_image.jpg`），
 * value 为 Astro 处理后的 `ImageMetadata` 对象。
 */
const imageGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/img/*.{jpeg,jpg,png,gif,webp}',
  { eager: true },
);

/**
 * 将 `src/assets/` 下的原始图片路径解析为 Astro 处理后的 hash URL。
 *
 * 适用于非 Content Collection 的数据（如 `notes.ts` 中手写的图片路径），
 * 使其与 Content Collection 中 `image()` schema 返回的 `ImageMetadata.src`
 * 得到相同的结果。
 *
 * @param rawPath - 图片路径，如 `'src/assets/img/test_image.jpg'`
 * @returns hash URL，如 `'/_astro/test_image.C0zjAts0.jpg'`
 *          若传入空值或未匹配到 glob，则原样返回
 *
 * @example
 * ```ts
 * resolveImage('src/assets/img/test_image.jpg')
 * // → '/_astro/test_image.C0zjAts0.jpg'
 *
 * resolveImage(undefined)
 * // → undefined
 * ```
 */
export function resolveImage(rawPath: string | undefined | null): string | undefined {
  if (!rawPath) return undefined;

  const key = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
  const mod = imageGlob[key];

  return mod ? mod.default.src : rawPath;
}
