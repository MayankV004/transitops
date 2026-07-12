import { getDepotSettings } from "@/actions/settings.actions";
import SettingsPage from "@/components/settings/SettingsPage";

export default async function Page() {
  const settings = await getDepotSettings();

  return (
    <SettingsPage initialSettings={settings} />
  );
}
