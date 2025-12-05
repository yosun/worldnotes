# Troubleshooting Guide for Splat and Treat

## Current Issues and Fixes

### Issue 1: WebGL Context Disabled

**Error Message:**
```
THREE.WebGLRenderer: A WebGL context could not be created.
GL_VENDOR = Disabled, GL_RENDERER = Disabled
```

**Cause:**
WebGL is disabled in your browser, likely due to:
- Hardware acceleration being disabled
- Browser security settings
- Graphics driver issues
- Running in a sandboxed environment

**Solutions:**

1. **Enable Hardware Acceleration (Chrome/Edge):**
   - Go to `chrome://settings/system`
   - Enable "Use hardware acceleration when available"
   - Restart your browser

2. **Enable Hardware Acceleration (Firefox):**
   - Go to `about:preferences`
   - Scroll to "Performance"
   - Uncheck "Use recommended performance settings"
   - Check "Use hardware acceleration when available"
   - Restart your browser

3. **Check WebGL Status:**
   - Visit `http://localhost:5173/webgl-test.html` to test WebGL support
   - Or visit https://get.webgl.org/ to check WebGL availability

4. **Update Graphics Drivers:**
   - Update your graphics card drivers to the latest version
   - Restart your computer after updating

5. **Disable Browser Extensions:**
   - Some privacy/security extensions may block WebGL
   - Try disabling extensions temporarily

6. **Try a Different Browser:**
   - Chrome, Firefox, and Edge have the best WebGL support
   - Safari on macOS also supports WebGL

### Issue 2: WASM Loading (431 Error)

**Error Message:**
```
GET http://localhost:5173/node_modules/.vite/deps/data:application/wasm;base64,... 431 (Request Header Fields Too Large)
```

**Cause:**
The WASM file from SparkJS is being loaded as a base64 data URL, which creates very long request headers.

**Fixes Applied:**
1. Updated `vite.config.ts` to properly handle WASM files
2. Added `assetsInclude: ['**/*.wasm']` to treat WASM as assets
3. Configured worker format and optimization settings

**If issue persists:**
- Clear browser cache and reload
- Delete `node_modules/.vite` folder and restart dev server:
  ```bash
  rm -rf apps/splat-and-treat/node_modules/.vite
  pnpm --filter=splat-and-treat dev
  ```

### Issue 3: SparkJS Initialization

**What was fixed:**
- Added WebGL support detection before initialization
- Improved error messages for WebGL failures
- Added fallback error handling

## Testing Your Setup

### 1. Test WebGL Support
Visit: `http://localhost:5173/webgl-test.html`

This will show:
- ✅ If WebGL is working
- ❌ If WebGL is not available
- Detailed information about your WebGL capabilities

### 2. Test the Application
1. Start the dev server:
   ```bash
   pnpm --filter=splat-and-treat dev
   ```

2. Open `http://localhost:5173` in your browser

3. Select a world (try "Bonsai Garden" first as it's smaller)

4. If you see errors, check the browser console for specific messages

## Common Error Messages

### "WebGL is not supported in your browser"
- Follow the "Enable Hardware Acceleration" steps above
- Try a different browser

### "Failed to create WebGL renderer"
- Your graphics card may not support WebGL
- Try updating graphics drivers
- Check if running in a virtual machine (WebGL may not work)

### "Loading took too long"
- Your internet connection may be slow
- The SPZ file may be very large
- Try a smaller world first (Bonsai Garden)

### "Unable to load world"
- Check your internet connection
- The SPZ file URL may be incorrect or unavailable
- Try a different world

## Development Tips

### Clear Vite Cache
If you're experiencing strange build issues:
```bash
rm -rf apps/splat-and-treat/node_modules/.vite
rm -rf node_modules/.vite
pnpm --filter=splat-and-treat dev
```

### Check Browser Console
Always check the browser console (F12) for detailed error messages.

### Test in Different Browsers
If something doesn't work in one browser, try another:
- Chrome (recommended)
- Firefox
- Edge
- Safari (macOS)

## Getting Help

If you're still experiencing issues:

1. Check the browser console for error messages
2. Run the WebGL test page
3. Check your browser's WebGL support at https://get.webgl.org/
4. Verify hardware acceleration is enabled
5. Try a different browser

## System Requirements

**Minimum:**
- Modern browser with WebGL support
- Hardware acceleration enabled
- Stable internet connection

**Recommended:**
- Chrome 90+ or Firefox 88+ or Edge 90+
- Dedicated graphics card
- 8GB RAM
- Fast internet connection (for loading SPZ files)
