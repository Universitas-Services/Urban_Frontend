import { UniversitasAPI } from '@universitas/sdk-global';

// Singleton centralizado de la API Global de Universitas.
// Importar desde aquí en todos los consumidores: import { sdkApi } from '@/lib/api/universitas.sdk';
export const sdkApi = new UniversitasAPI(process.env.NEXT_PUBLIC_UNIVERSITAS_SDK_URL!);
