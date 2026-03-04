# Custom fonts for order confirmation

Place your custom font file here so the order confirmation (preview and email) can use it.

- **File name:** `tsuyanouchi-serif.otf` **or** `tsuyanouchi-serif.ttf`  
  (Use whichever matches your file type; only one is needed. Rename your file if necessary.)
- **Supported formats:** `.otf` (OpenType) and `.ttf` (TrueType).

The template uses this font for all text and enables **lining figures** so numbers (order ID, quantities, prices) are aligned instead of old-style.

**Steps:**  
1. Copy your `.otf` or `.ttf` into this folder.  
2. Rename it to `tsuyanouchi-serif.otf` or `tsuyanouchi-serif.ttf`.  
3. Refresh the preview at `/preview/order-confirmation`.

If you don’t add a font file, the template falls back to Georgia and still uses lining figures where the client supports it.
