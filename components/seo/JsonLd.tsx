// Tiny wrapper so every page injects structured data the same way instead
// of hand-rolling <script type="application/ld+json"> + JSON.stringify
// inline. Accepts one schema object or an array (rendered as multiple
// script tags — @graph would also work, but separate tags are easier to
// debug in Rich Results Test / view-source).
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
    </>
  );
}
