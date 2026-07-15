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
 * @param rawPath - 图片路径，如 `'src/assets/img/test_image.jpg'`
 * @returns hash URL，如 `'/_astro/test_image.C0zjAts0.jpg'`
 *
 * @example
 * ```ts
 * resolveImage('src/assets/img/test_image.jpg')
 * // → '/_astro/test_image.C0zjAts0.jpg'
 * ```
 */
export function resolveImage(rawPath: string | undefined | null): string | undefined {
  if (!rawPath) return undefined;

  const key = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
  const mod = imageGlob[key];

  return mod ? mod.default.src : rawPath;
}

/**
 * 将 `src/assets/` 下的原始图片路径解析为 `ImageMetadata` 对象，
 * 可直接用于 `<Image />` 组件的 `src` prop。
 *
 * @param rawPath - 图片路径，如 `'src/assets/img/test_image.jpg'`
 * @returns `ImageMetadata` 对象，若未匹配则返回 `undefined`
 *
 * @example
 * ```ts
 * const meta = resolveImageMeta('src/assets/img/test_image.jpg')
 * // → { src: '/_astro/test_image.C0zjAts0.jpg', width: 1920, height: 1080, ... }
 * ```
 */
export function resolveImageMeta(rawPath: string | undefined | null): ImageMetadata | undefined {
  if (!rawPath) return undefined;

  const key = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
  const mod = imageGlob[key];

  return mod?.default;
}
