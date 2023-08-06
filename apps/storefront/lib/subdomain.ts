import { invariant } from "@apollo/client/utilities/globals";

export const getSubdomain = (host: string) => {
  const hosts = host?.split(".") ?? [];
  let subdomain = "",
    API_URI = "";
  if (host) {
    subdomain = hosts[0];
    const nextPublicApiUri = process.env.NEXT_PUBLIC_API_URI?.split(".") ?? [];
    invariant(nextPublicApiUri.length === 3, "Missing NEXT_PUBLIC_API_URI with subdomain");
    const envHosts = nextPublicApiUri[0].split("//");
    envHosts[1] = subdomain;
    const updatedNextPublicApiUri = [envHosts.join("//"), ...nextPublicApiUri.slice(1)].join(".");

    process.env.API_URI = API_URI = updatedNextPublicApiUri;
  }
  return { subdomain, API_URI };
};
