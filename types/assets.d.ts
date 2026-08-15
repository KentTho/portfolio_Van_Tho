// Static asset module declarations for TypeScript. Committed so `tsc --noEmit`
// (CI runs it before `next build`) can resolve image imports like
// `import img from "@/components/public/image/vantho.png"` even when the
// generated, gitignored `next-env.d.ts` is absent. Delegates to Next's own
// image types so imports keep the correct `StaticImageData` type.
/// <reference types="next/image-types/global" />
