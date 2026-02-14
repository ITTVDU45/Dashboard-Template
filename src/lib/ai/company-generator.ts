import OpenAI from "openai"
import type { ScrapedService } from "@/lib/scraper"

interface DescriptionInput {
  name: string
  industry?: string | null
  website?: string | null
  brandTone?: string | null
  scrapedText: string
}

interface BusinessModelInput {
  name: string
  industry?: string | null
  description?: string | null
  scrapedText: string
}

interface DescriptionOutput {
  description: string
  shortPitch: string
  usp: string[]
  positioning: string
}

interface BusinessModelOutput {
  businessModel: string
  targetMarket: string
  priceLevel: string
  marketPosition: string
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

async function callJson<T>(prompt: string): Promise<T | null> {
  if (!openai) return null
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: "Du bist ein B2B-Analyst. Antworte nur als valides JSON." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  })
  const content = completion.choices[0]?.message?.content
  if (!content) return null
  try {
    return JSON.parse(content) as T
  } catch {
    return null
  }
}

export async function generateDescription(input: DescriptionInput): Promise<DescriptionOutput> {
  const prompt = `
Erzeuge JSON mit keys: description, shortPitch, usp, positioning.
Kontext:
- Name: ${input.name}
- Branche: ${input.industry ?? "unbekannt"}
- Website: ${input.website ?? "unbekannt"}
- Tonalitat: ${input.brandTone ?? "neutral-professionell"}
- Website-Text: ${input.scrapedText.slice(0, 7000)}

Regeln:
- description: 3-6 Absatze
- shortPitch: 1 Satz
- usp: genau 3 Bullet-Statements als Array
- positioning: 1 kurzer Absatz
`
  const aiResult = await callJson<DescriptionOutput>(prompt)
  if (aiResult?.description && aiResult?.shortPitch && Array.isArray(aiResult.usp)) return aiResult

  return {
    description: `${input.name} ist ein Unternehmen aus der Branche ${input.industry ?? "Allgemein"} mit Fokus auf nachhaltige, kundennahe Ergebnisse. Basierend auf der Websiteprasenz bietet das Unternehmen ein professionelles Leistungsportfolio mit klaren Mehrwerten fur Zielkunden.`,
    shortPitch: `${input.name} liefert klare Ergebnisse mit digitaler Exzellenz und messbarer Wirkung.`,
    usp: [
      "Klare Positionierung mit nachvollziehbarem Nutzen",
      "Schnelle Umsetzung mit hoher Qualitat",
      "Kundenzentrierte Kommunikation und Beratung",
    ],
    positioning: `${input.name} positioniert sich als verlasslicher Partner mit praxisnahen Losungen und klarem Fokus auf Wertschopfung.`,
  }
}

export async function generateServices(scrapedText: string, industry?: string | null): Promise<ScrapedService[]> {
  const prompt = `
Extrahiere Leistungen aus folgendem Text als JSON mit key "services".
Jeder Eintrag: { category, title, description, keywords }.
Maximal 10 Leistungen.
Branche: ${industry ?? "unbekannt"}.
Text: ${scrapedText.slice(0, 9000)}
`
  const aiResult = await callJson<{ services: ScrapedService[] }>(prompt)
  if (Array.isArray(aiResult?.services)) return aiResult.services
  return []
}

export async function analyzeBusinessModel(input: BusinessModelInput): Promise<BusinessModelOutput> {
  const prompt = `
Analysiere das Unternehmen und gib JSON mit keys businessModel, targetMarket, priceLevel, marketPosition.
Name: ${input.name}
Branche: ${input.industry ?? "unbekannt"}
Beschreibung: ${input.description ?? "keine"}
Website-Text: ${input.scrapedText.slice(0, 6000)}
priceLevel muss eins von low|medium|high|premium sein.
marketPosition muss eins von lokal|national|global sein.
`
  const aiResult = await callJson<BusinessModelOutput>(prompt)
  if (aiResult?.businessModel) return aiResult

  return {
    businessModel: "Dienstleistungsbasiert",
    targetMarket: "KMU",
    priceLevel: "medium",
    marketPosition: "lokal",
  }
}
