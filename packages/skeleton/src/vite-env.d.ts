/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION?: string;
  readonly VITE_AWS_COGNITO_IDENTITY_POOL_ID?: string;
  readonly VITE_AWS_S3_BUCKET?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_AI3D_API_URL?: string;
  readonly VITE_AI3D_API_KEY?: string;
  readonly VITE_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
