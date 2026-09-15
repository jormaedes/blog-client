/**
 * Utility functions for processing post HTML content, extracting images,
 * excerpts, formatting dates, and calculating reading times.
 */

export function extractFirstImage(content: string): string | null {
  if (!content) return null;
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1]) {
    const src = match[1].trim();
    if (src.length > 0) return src;
  }
  return null;
}

export function extractExcerpt(content: string, maxLength = 140): string {
  if (!content) return "";
  
  // Strip HTML tags
  let text = content.replace(/<[^>]*>/g, " ");
  
  // Decode common HTML entities and normalize whitespace
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

export function formatDate(timestamp: string, full = false): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";

  if (full) {
    return date.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getReadingTime(content: string): string {
  if (!content) return "1 min de leitura";
  const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min de leitura`;
}
