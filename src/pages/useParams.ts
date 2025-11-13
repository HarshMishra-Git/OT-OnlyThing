export function useParams(): { slug?: string; id?: string } {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);

  if (segments[0] === 'product' && segments[1]) {
    return { slug: segments[1] };
  }

  return {};
}
