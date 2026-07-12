import { createClient } from '@/lib/supabase/client'

type Settings = Record<string, string>

export async function getSiteSettings(keys: string[]): Promise<Settings> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', keys)
    const result: Settings = {}
    for (const row of (data ?? []) as { key: string; value: string }[]) {
      result[row.key] = row.value
    }
    return result
  } catch {
    return {}
  }
}
