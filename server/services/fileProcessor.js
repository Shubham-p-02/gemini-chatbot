const pdfParse = require("pdf-parse");

/**
 * Extract text content from uploaded files.
 * Supports PDF and TXT formats.
 */
async function extractText(buffer, mimetype, filename) {
  if (mimetype === "application/pdf") {
    try {
      const data = await pdfParse(buffer);
      return data.text || "";
    } catch (err) {
      throw new Error(`Failed to parse PDF "${filename}": ${err.message}`);
    }
  }

  if (mimetype === "text/plain") {
    return buffer.toString("utf-8");
  }

  throw new Error(`Unsupported document type: ${mimetype}`);
}

module.exports = { extractText };
