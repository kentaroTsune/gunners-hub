/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEWS_API_URL: string
  readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_API_QUERY_Q: string;
  readonly VITE_API_QUERY_LANGUAGE: string;
  readonly VITE_API_QUERY_CATEGORY: string;
}
