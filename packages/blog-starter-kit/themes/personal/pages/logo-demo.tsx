import { useState, useCallback, useRef, useEffect } from 'react';
import Head from 'next/head';
import colors from 'tailwindcss/colors';

// Import Tailwind config directly - single source of truth for theme
// eslint-disable-next-line
const tailwindConfig = require('../tailwind.config');

// =============================================================================
// ASSET CONFIGURATION - Adjust these values to scale text within each asset
// =============================================================================

// Favicon (500x500px) - "a."
const FAVICON_CONFIG = {
  width: 500,
  height: 500,
  fontSize: 460, // Adjust to scale text
  dotMarginFactor: -0.175, // Negative = tighter spacing around dot
  offsetX: 20, // Pixels: positive = shift right
  offsetY: -15, // Pixels: negative = shift up
};

// Publication Logo (500x125px) - "abel.enekes"
const LOGO_CONFIG = {
  width: 500,
  height: 125,
  fontSize: 60, // Adjust to scale text
  dotMarginFactor: -0.175, // Negative = tighter spacing around dot
  offsetX: 0, // Pixels: positive = shift right
  offsetY: 0, // Pixels: negative = shift up
};

// Social Media Banner (800x420px) - "abel.enekes"
const BANNER_CONFIG = {
  width: 800,
  height: 420,
  fontSize: 80, // Adjust to scale text
  dotMarginFactor: -0.175, // Negative = tighter spacing around dot
  offsetX: 0, // Pixels: positive = shift right
  offsetY: 0, // Pixels: negative = shift up
};

// =============================================================================
// COLOR & FONT PALETTE - Imported from tailwind.config.js
// Change values in tailwind.config.js to update both blog theme AND logo assets
// =============================================================================
const PRIMARY_COLOR = tailwindConfig.theme.extend.colors.primary; // e.g., colors.violet

const COLORS = {
  light: {
    background: colors.white,
    text: colors.black,
    primary: PRIMARY_COLOR[500],
  },
  dark: {
    background: colors.neutral[950], // closest to #0a0a0a
    text: colors.white,
    primary: PRIMARY_COLOR[500],
  },
};

// Font family - using Courier New as the core monospace font
// This matches the blog's font-sans which starts with Courier New
const FONT_FAMILY = '"Courier New", Courier, monospace';

// =============================================================================
// CANVAS ASSET COMPONENT - Single source of truth for preview AND download
// =============================================================================

type CanvasAssetProps = {
  textBefore: string;
  dot: string;
  textAfter?: string;
  theme: 'light' | 'dark';
  fontSize: number;
  dotMarginFactor: number;
  offsetX?: number;
  offsetY?: number;
  width: number;
  height: number;
  filename: string;
};

// Shared function to draw asset on canvas
function drawAssetOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fontSize: number,
  textBefore: string,
  dot: string,
  textAfter: string | undefined,
  themeColors: { background: string; text: string; primary: string },
  dotMarginFactor: number,
  offsetX: number = 0,
  offsetY: number = 0
) {
  // Fill background
  ctx.fillStyle = themeColors.background;
  ctx.fillRect(0, 0, width, height);

  // Set font
  ctx.font = `bold ${fontSize}px ${FONT_FAMILY}`;
  ctx.textBaseline = 'middle';

  // Calculate dot adjustment for tighter spacing
  const dotAdjustment = fontSize * dotMarginFactor;

  // Measure text parts
  const beforeWidth = ctx.measureText(textBefore).width;
  const dotWidth = ctx.measureText(dot).width;
  const afterWidth = textAfter ? ctx.measureText(textAfter).width : 0;

  // Total width with adjustments (negative adjustment pulls text together)
  const totalWidth = beforeWidth + dotWidth + afterWidth + (dotAdjustment * 2);

  // Starting X position (center the whole text) + offset
  let x = (width - totalWidth) / 2 + offsetX;
  const y = height / 2 + offsetY;

  // Draw textBefore
  ctx.textAlign = 'left';
  ctx.fillStyle = themeColors.text;
  ctx.fillText(textBefore, x, y);
  x += beforeWidth + dotAdjustment;

  // Draw dot
  ctx.fillStyle = themeColors.primary;
  ctx.fillText(dot, x, y);
  x += dotWidth + dotAdjustment;

  // Draw textAfter
  if (textAfter) {
    ctx.fillStyle = themeColors.text;
    ctx.fillText(textAfter, x, y);
  }
}

function CanvasAsset({
  textBefore,
  dot,
  textAfter,
  theme,
  fontSize,
  dotMarginFactor,
  offsetX = 0,
  offsetY = 0,
  width,
  height,
  filename,
}: CanvasAssetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const themeColors = COLORS[theme];

  // Draw on canvas when component mounts or props change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Wait for fonts then draw
    document.fonts.ready.then(() => {
      drawAssetOnCanvas(ctx, width, height, fontSize, textBefore, dot, textAfter, themeColors, dotMarginFactor, offsetX, offsetY);
    });
  }, [width, height, fontSize, textBefore, dot, textAfter, themeColors, dotMarginFactor, offsetX, offsetY]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    try {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading image. Check console for details.');
    } finally {
      setLoading(false);
    }
  }, [filename]);

  // Scale factor for preview (so large canvases fit nicely on screen)
  const maxPreviewWidth = 400;
  const scale = width > maxPreviewWidth ? maxPreviewWidth / width : 1;

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={handleDownload}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 disabled:opacity-50 font-sans text-sm"
      >
        {loading ? 'Downloading...' : `Download ${filename} (${width}×${height})`}
      </button>
    </div>
  );
}

// Block access in production - this page is development-only
export const getStaticProps = async () => {
  if (process.env.NODE_ENV === 'production') {
    return { notFound: true };
  }
  return { props: {} };
};

export default function LogoDemo() {
  // Extra safety: hide content in production (shouldn't reach here due to getStaticProps)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Logo & Banner Demo</title>
      </Head>
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 py-10 px-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-black dark:text-white font-sans">
            Logo & Banner Preview
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-sans">
            Preview and download assets for your Hashnode blog.
          </p>

          {/* Favicon Section - 500x500 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white font-sans">
              Favicon (500×500px)
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 font-sans text-sm">
              Square favicon with &quot;a.&quot; - use for browser tab icons.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Favicon Light */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-medium mb-4 text-black dark:text-white font-sans">
                  Light Theme Favicon
                </h3>
                <CanvasAsset
                  textBefore="a"
                  dot="."
                  theme="light"
                  fontSize={FAVICON_CONFIG.fontSize}
                  dotMarginFactor={FAVICON_CONFIG.dotMarginFactor}
                  offsetX={FAVICON_CONFIG.offsetX}
                  offsetY={FAVICON_CONFIG.offsetY}
                  width={FAVICON_CONFIG.width}
                  height={FAVICON_CONFIG.height}
                  filename="favicon-light.png"
                />
              </div>

              {/* Favicon Dark */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-medium mb-4 text-black dark:text-white font-sans">
                  Dark Theme Favicon
                </h3>
                <CanvasAsset
                  textBefore="a"
                  dot="."
                  theme="dark"
                  fontSize={FAVICON_CONFIG.fontSize}
                  dotMarginFactor={FAVICON_CONFIG.dotMarginFactor}
                  offsetX={FAVICON_CONFIG.offsetX}
                  offsetY={FAVICON_CONFIG.offsetY}
                  width={FAVICON_CONFIG.width}
                  height={FAVICON_CONFIG.height}
                  filename="favicon-dark.png"
                />
              </div>
            </div>
          </section>

          {/* Publication Logo Section - 500x125 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white font-sans">
              Publication Logo (500×125px)
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 font-sans text-sm">
              Wide logo with &quot;abel.enekes&quot; - appears in publication header.
            </p>

            <div className="grid grid-cols-1 gap-8">
              {/* Logo Light */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-medium mb-4 text-black dark:text-white font-sans">
                  Light Theme Logo
                </h3>
                <CanvasAsset
                  textBefore="abel"
                  dot="."
                  textAfter="enekes"
                  theme="light"
                  fontSize={LOGO_CONFIG.fontSize}
                  dotMarginFactor={LOGO_CONFIG.dotMarginFactor}
                  offsetX={LOGO_CONFIG.offsetX}
                  offsetY={LOGO_CONFIG.offsetY}
                  width={LOGO_CONFIG.width}
                  height={LOGO_CONFIG.height}
                  filename="logo-light.png"
                />
              </div>

              {/* Logo Dark */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-medium mb-4 text-black dark:text-white font-sans">
                  Dark Theme Logo
                </h3>
                <CanvasAsset
                  textBefore="abel"
                  dot="."
                  textAfter="enekes"
                  theme="dark"
                  fontSize={LOGO_CONFIG.fontSize}
                  dotMarginFactor={LOGO_CONFIG.dotMarginFactor}
                  offsetX={LOGO_CONFIG.offsetX}
                  offsetY={LOGO_CONFIG.offsetY}
                  width={LOGO_CONFIG.width}
                  height={LOGO_CONFIG.height}
                  filename="logo-dark.png"
                />
              </div>
            </div>
          </section>

          {/* Social Media Banner Section - 800x420 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white font-sans">
              Social Media Banner (800×420px)
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 font-sans text-sm">
              Banner with &quot;abel.enekes&quot; - use for social sharing and OG images.
            </p>

            <div className="grid grid-cols-1 gap-8">
              {/* Banner Light */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-medium mb-4 text-black dark:text-white font-sans">
                  Light Theme Banner
                </h3>
                <CanvasAsset
                  textBefore="abel"
                  dot="."
                  textAfter="enekes"
                  theme="light"
                  fontSize={BANNER_CONFIG.fontSize}
                  dotMarginFactor={BANNER_CONFIG.dotMarginFactor}
                  offsetX={BANNER_CONFIG.offsetX}
                  offsetY={BANNER_CONFIG.offsetY}
                  width={BANNER_CONFIG.width}
                  height={BANNER_CONFIG.height}
                  filename="banner-light.png"
                />
              </div>

              {/* Banner Dark */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow">
                <h3 className="text-lg font-medium mb-4 text-black dark:text-white font-sans">
                  Dark Theme Banner
                </h3>
                <CanvasAsset
                  textBefore="abel"
                  dot="."
                  textAfter="enekes"
                  theme="dark"
                  fontSize={BANNER_CONFIG.fontSize}
                  dotMarginFactor={BANNER_CONFIG.dotMarginFactor}
                  offsetX={BANNER_CONFIG.offsetX}
                  offsetY={BANNER_CONFIG.offsetY}
                  width={BANNER_CONFIG.width}
                  height={BANNER_CONFIG.height}
                  filename="banner-dark.png"
                />
              </div>
            </div>
          </section>

          {/* Color Reference */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white font-sans">
              Color Reference
            </h2>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans text-sm">
                <div>
                  <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: COLORS.light.background, border: '1px solid #e5e5e5' }} />
                  <p className="text-black dark:text-white font-medium">Light BG</p>
                  <p className="text-neutral-500">{COLORS.light.background}</p>
                </div>
                <div>
                  <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: COLORS.dark.background }} />
                  <p className="text-black dark:text-white font-medium">Dark BG</p>
                  <p className="text-neutral-500">{COLORS.dark.background}</p>
                </div>
                <div>
                  <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: COLORS.light.primary }} />
                  <p className="text-black dark:text-white font-medium">Primary (Violet)</p>
                  <p className="text-neutral-500">{COLORS.light.primary}</p>
                </div>
                <div>
                  <div className="w-full h-16 rounded mb-2 flex items-center justify-center" style={{ backgroundColor: COLORS.light.text }}>
                    <span style={{ color: COLORS.dark.text }}>Aa</span>
                  </div>
                  <p className="text-black dark:text-white font-medium">Text Colors</p>
                  <p className="text-neutral-500">Black / White</p>
                </div>
              </div>
            </div>
          </section>

          {/* Instructions */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white font-sans">
              Upload Instructions
            </h2>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow font-sans text-sm text-neutral-700 dark:text-neutral-300">
              <ol className="list-decimal list-inside space-y-2">
                <li>Download all assets using the buttons above</li>
                <li>Go to your <a href="https://hashnode.com/settings" className="text-violet-500 underline" target="_blank" rel="noopener noreferrer">Hashnode Dashboard</a> → Appearance</li>
                <li>Upload light/dark logos for respective themes</li>
                <li>Upload the favicon (dark version works well on most browser UIs)</li>
                <li>Use the banner as your publication&apos;s social sharing image</li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
