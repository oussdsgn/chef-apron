import type { Metadata } from "next";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import ImageField from "@/components/admin/ImageField";
import { PageHead } from "@/components/admin/ui";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Collections" };

type Row = { slug: string; name: string; title: string; blurb: string; image: string | null; sort: number; count: number };

function Fields({ c }: { c?: Row }) {
  return (
    <div className="collection-form">
      <ImageField name="image" label="Tile photo" defaultValue={c?.image ?? ""} />
      <div className="collection-form__fields">
        {c && <input type="hidden" name="original" value={c.slug} />}
        <div className="field-row">
          <label className="field">
            <span className="field__label">Menu name</span>
            <input name="name" className="input" defaultValue={c?.name} required placeholder="e.g. Aprons" />
          </label>
          <label className="field">
            <span className="field__label">Web address</span>
            <div className="input-prefix">
              <span>/collections/</span>
              <input name="slug" className="input" defaultValue={c?.slug} placeholder="auto" />
            </div>
          </label>
        </div>
        <label className="field">
          <span className="field__label">Page title</span>
          <input name="title" className="input" defaultValue={c?.title} placeholder="e.g. Apron collection" />
        </label>
        <label className="field">
          <span className="field__label">Description</span>
          <textarea name="blurb" className="input" rows={2} defaultValue={c?.blurb} />
        </label>
        <label className="field field--narrow">
          <span className="field__label">Position</span>
          <input name="sort" className="input" inputMode="numeric" defaultValue={c?.sort ?? 0} />
        </label>
      </div>
    </div>
  );
}

export default async function CollectionsPage() {
  const sql = await db();
  const rows = await sql<Row[]>`
    select c.*, (select count(*)::int from products p where p.category = c.slug) as count
    from categories c order by sort, slug`;
  return (
    <>
      <PageHead
        title="Collections"
        subtitle="Collections appear in the menu, on the home page tiles and as filters in the shop. The first one gets the big tile."
      />
      {rows.map((c) => (
        <section key={c.slug} className="panel">
          <div className="panel__head">
            <h2>{c.name}</h2>
            <span className="muted small">
              {c.count} product{c.count === 1 ? "" : "s"} ·{" "}
              <a href={`/collections/${c.slug}`} target="_blank" rel="noreferrer" className="link">
                view ↗
              </a>
            </span>
          </div>
          <ActionForm action={saveCategory} submitLabel="Save collection">
            <Fields c={c} />
          </ActionForm>
          <div className="panel__foot">
            <ConfirmButton
              action={deleteCategory.bind(null, c.slug)}
              confirm={`Delete the “${c.name}” collection?`}
              className="abtn abtn--small abtn--ghost-danger"
            >
              Delete collection
            </ConfirmButton>
          </div>
        </section>
      ))}
      <section className="panel panel--dashed">
        <h2 className="panel__title">Add a collection</h2>
        <ActionForm action={saveCategory} submitLabel="Add collection">
          <Fields />
        </ActionForm>
      </section>
    </>
  );
}
