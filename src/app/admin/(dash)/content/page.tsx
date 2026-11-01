import type { Metadata } from "next";
import SettingsForm from "@/components/admin/SettingsForm";
import { PageHead } from "@/components/admin/ui";
import { contentGroups } from "@/lib/settings-fields";
import { loadSettings } from "@/lib/store";

export const metadata: Metadata = { title: "Pages & content" };

export default async function ContentPage() {
  const settings = await loadSettings();
  return (
    <>
      <PageHead
        title="Pages & content"
        subtitle="Edit the text and photos on the home page, About page and policy pages. Changes go live as soon as you save."
      />
      <nav className="jump">
        {contentGroups.map((g) => (
          <a key={g.section} href={`#${g.section}`}>
            {g.title}
          </a>
        ))}
      </nav>
      {contentGroups.map((g) => (
        <SettingsForm key={g.section} group={g} values={settings[g.section] as Record<string, unknown>} />
      ))}
    </>
  );
}
