import { prisma } from "@/lib/prisma"
import { parseJsonObject } from "@/lib/serializers"
import { PageHeader } from "@/components/common/page-header"
import { SettingsForms } from "@/components/settings/settings-forms"

export default async function SettingsPage() {
  const settings = await prisma.integrationSetting.findMany()
  const initialSettings = settings.reduce<Record<string, Record<string, string>>>((acc, item) => {
    acc[item.provider] = parseJsonObject(item.config, {})
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <PageHeader
        title="Einstellungen"
        description="Integrationen und Systemeinstellungen mit ENV-Hinweisen verwalten"
      />
      <SettingsForms initialSettings={initialSettings} />
    </div>
  )
}
