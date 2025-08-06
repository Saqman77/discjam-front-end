/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_FRONTEND_ORIGIN: string
    readonly DEV: boolean
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}
