export const isAbsoluteUrl = (url: string) => /^[a-z][a-z\d+\-.]*:/i.test(url);

export const formatUrlWithQuery = (url: string, params: { [key: string]: string }) => {
  const [base, search] = url.split('?', 2);
  const searchParams = new URLSearchParams(search);

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value);
  }

  return base + '?' + searchParams.toString();
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};
