import axios from "axios"
import * as cheerio from "cheerio"

export interface ScrapedContact {
  name?: string
  email?: string
  phone?: string
  linkedIn?: string
}

export interface ScrapedService {
  category: string
  title: string
  keywords: string[]
  description?: string
}

export interface DetectedTechStack {
  cms?: string
  hosting?: string
  cdn?: string
  tracking: string[]
  seoBasics?: string
}

export interface ScrapedData {
  url: string
  html: string
  text: string
  title: string
  description: string
  links: string[]
  meta: Record<string, string>
}

function normalizeUrl(baseUrl: string, href: string) {
  try {
    return new URL(href, baseUrl).toString()
  } catch {
    return href
  }
}

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim()
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const response = await axios.get<string>(url, {
    timeout: 15000,
    maxRedirects: 5,
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TechvisionBot/1.0)" },
  })

  const html = response.data
  const $ = cheerio.load(html)
  const title = cleanText($("title").first().text() || "")
  const description = cleanText($('meta[name="description"]').attr("content") || "")
  const links = $("a[href]")
    .map((_, el) => normalizeUrl(url, $(el).attr("href") || ""))
    .get()
    .filter(Boolean)
    .slice(0, 150)

  const meta: Record<string, string> = {}
  $("meta[name], meta[property]").each((_, el) => {
    const name = $(el).attr("name") || $(el).attr("property")
    const content = $(el).attr("content")
    if (!name || !content) return
    meta[name] = content
  })

  const text = cleanText($("body").text())
  return { url, html, text, title, description, links, meta }
}

export function extractContacts(html: string): ScrapedContact[] {
  const $ = cheerio.load(html)
  const text = $("body").text()

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi
  const phoneRegex = /(\+?\d[\d\s\-()]{6,}\d)/g
  const emails = Array.from(new Set(text.match(emailRegex) ?? [])).slice(0, 5)
  const phones = Array.from(new Set(text.match(phoneRegex) ?? [])).slice(0, 5)

  const linkedIn = $("a[href*='linkedin.com']")
    .map((_, el) => $(el).attr("href"))
    .get()
    .filter(Boolean)

  const contacts: ScrapedContact[] = []
  const max = Math.max(emails.length, phones.length, linkedIn.length, 1)
  for (let index = 0; index < max; index += 1) {
    contacts.push({
      email: emails[index],
      phone: phones[index],
      linkedIn: linkedIn[index],
    })
  }

  return contacts.filter((entry) => entry.email || entry.phone || entry.linkedIn)
}

export function extractServices(html: string): ScrapedService[] {
  const $ = cheerio.load(html)
  const headings = $("h1, h2, h3")
    .map((_, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean)
  const keywordSeed = ["beratung", "entwicklung", "marketing", "seo", "design", "automation", "strategie", "crm"]

  const services = headings.slice(0, 12).map((heading) => {
    const lower = heading.toLowerCase()
    const keywords = keywordSeed.filter((keyword) => lower.includes(keyword))
    return {
      category: keywords[0] ?? "Allgemein",
      title: heading,
      keywords,
      description: heading,
    }
  })

  return services.filter((entry) => entry.title.length >= 3)
}

export async function detectTechStack(url: string): Promise<DetectedTechStack> {
  const response = await axios.get<string>(url, {
    timeout: 15000,
    maxRedirects: 5,
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TechvisionBot/1.0)" },
  })

  const html = response.data.toLowerCase()
  const headers = response.headers

  let cms: string | undefined
  if (html.includes("wp-content") || html.includes("wp-json")) cms = "WordPress"
  if (html.includes("shopify")) cms = "Shopify"
  if (html.includes("wix")) cms = "Wix"
  if (html.includes("webflow")) cms = "Webflow"
  if (!cms && html.includes("next/")) cms = "Custom React/Next.js"

  const tracking: string[] = []
  if (html.includes("gtag(") || html.includes("google-analytics")) tracking.push("Google Analytics")
  if (html.includes("facebook pixel") || html.includes("connect.facebook.net")) tracking.push("Meta Pixel")
  if (html.includes("googletagmanager.com")) tracking.push("Google Tag Manager")

  const cdnHeader = headers["server"] || headers["x-served-by"] || headers["cf-ray"] || headers["x-cache"]
  const cdn = Array.isArray(cdnHeader) ? cdnHeader.join(", ") : cdnHeader

  return {
    cms,
    hosting: Array.isArray(headers["server"]) ? headers["server"].join(", ") : headers["server"],
    cdn: typeof cdn === "string" ? cdn : undefined,
    tracking,
    seoBasics: html.includes('meta name="description"') ? "Meta Description erkannt" : "Meta Description fehlt",
  }
}
