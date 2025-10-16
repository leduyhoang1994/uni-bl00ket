/**
 * Wrap your content and decide to show it with condition argument
 */
export default function RenderIf({
  condition,
  children
}: {
  condition: boolean | string | undefined | null;
  children: any;
}) {
  if (!condition) {
    return null;
  }

  return children;
}
