import { prisma } from "@/lib/prisma"
import { fail, ok, parseBody } from "@/lib/api-helpers"
import { integrationSettingSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"

export async function GET() {
  const settings = await prisma.integrationSetting.findMany({
    orderBy: { provider: "asc" }
  })
  return ok(settings)
}

export async function PUT(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = integrationSettingSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid integration setting payload", 400, parsed.error.flatten())

  const setting = await prisma.integrationSetting.upsert({
    where: { provider: parsed.data.provider },
    create: {
      provider: parsed.data.provider,
      config: JSON.stringify(parsed.data.config)
    },
    update: {
      config: JSON.stringify(parsed.data.config)
    }
  })

  await createAuditLog({
    entityType: "IntegrationSetting",
    entityId: setting.id,
    action: "update",
    payload: parsed.data
  })

  return ok(setting)
}
