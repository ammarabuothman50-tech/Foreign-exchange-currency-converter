function required(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable "${name}". Add it to the .env file.`);
  }
  return value;
}

export const environment = {
  apiUrl: required('NG_APP_API_URL', import.meta.env.NG_APP_API_URL),
  apiKey: required('NG_APP_API_KEY', import.meta.env.NG_APP_API_KEY),
} as const;
