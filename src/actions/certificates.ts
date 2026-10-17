import { authApi, publicApi } from "@/lib/api";
import type { ApiEnvelope, Certificate } from "@/types/api";

import { unwrapData } from "./utils";

export async function getMyCertificates(): Promise<Certificate[]> {
  const res = await authApi.get<ApiEnvelope<Certificate[]>>(
    "/talent/certificates",
  );
  return unwrapData(res);
}

export async function getPublicCertificate(code: string): Promise<Certificate> {
  const res = await publicApi.get<ApiEnvelope<Certificate>>(
    `/certificates/${encodeURIComponent(code)}`,
  );
  return unwrapData(res);
}
