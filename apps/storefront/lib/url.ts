import { AppProps } from "next/app";
import queryString from "query-string";

export type ParamBasicValue = {
  isNativeWebView: boolean;
};

const queryParamsMap = {
  refreshToken: "refreshToken",
  nativeApp: "nativeApp",
} as const;

type UnmappedQueryParam = keyof typeof queryParamsMap;

type QueryParam = typeof queryParamsMap[UnmappedQueryParam];

type RawQueryParams = Record<UnmappedQueryParam, ParamBasicValue>;

export type QueryParams = {
  isNativeWebView: boolean;
  refreshToken: string;
  nativeApp: string;
};

const defaultParams: Partial<RawQueryParams> = {};

// this is intentional, we know what we'll get from the query but
// queryString has no way to type this in such a specific way
export const getRawQueryParams = () => {
  if (typeof window === "undefined") {
    return {} as RawQueryParams;
  }
  return queryString.parse(location.search) as unknown as RawQueryParams;
};

const gWindow: any = typeof window !== "undefined" ? window : {};

export const getQueryParams = (router?: AppProps["router"]): QueryParams => {
  const params = getRawQueryParams();
  const serverQuery = router?.query ?? {};
  return Object.entries({ ...params, ...serverQuery }).reduce((result, entry) => {
    const [paramName, paramValue] = entry as [UnmappedQueryParam, ParamBasicValue];
    const mappedParamName = queryParamsMap[paramName];
    const mappedParamValue = paramValue || defaultParams[paramName];

    const isNativeWebView =
      serverQuery?.nativeApp === "true" ||
      typeof gWindow?.ReactNativeWebView?.postMessage === "function";

    return {
      ...result,
      isNativeWebView,
      [mappedParamName]: mappedParamValue,
    };
  }, {}) as QueryParams;
};

export const clearQueryParams = (...keys: QueryParam[]) => {
  const query = Object.entries(queryParamsMap).reduce((result, [unmappedParam, mappedParam]) => {
    if (!keys.includes(mappedParam)) {
      return result;
    }

    return { ...result, [unmappedParam]: undefined };
  }, {});

  replaceUrl({ query });
};

export const getUrl = ({
  url = window.location.toString(),
  query,
  replaceWholeQuery = false,
}: {
  url?: string;
  query?: Record<string, any>;
  replaceWholeQuery?: boolean;
}) => {
  const newQuery = replaceWholeQuery ? query : { ...getRawQueryParams(), ...query };
  const newUrl = queryString.stringifyUrl({ url, query: newQuery });
  return { newUrl, newQuery };
};

export const replaceUrl = ({
  url = window.location.toString(),
  query,
  replaceWholeQuery = false,
}: {
  url?: string;
  query?: Record<string, any>;
  replaceWholeQuery?: boolean;
}) => {
  const { newUrl, newQuery } = getUrl({ url, query, replaceWholeQuery });

  window.history.pushState(
    {
      ...window.history.state,
      ...newQuery,
      url: newUrl,
      as: newUrl,
    },
    "",
    newUrl
  );

  return newUrl;
};
