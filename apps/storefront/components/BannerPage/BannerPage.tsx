import React from "react";
import { usePageBannerQuery } from "@/saleor/api";
import SearchBar from "../Header/SearchBar";

export const BannerPage = () => {
  const { data } = usePageBannerQuery({ variables: { slug: "banner_home" } });
  const page = data?.page;
  const attributes = page?.attributes ?? [];

  const getUrl = () => {
    try {
      for (const value of attributes?.[0]?.values) {
        if (value.file?.url) {
          return value.file.url;
        }
      }
    } catch (error) {
      return null;
    }
  };
  let url = getUrl();

  return (
    <>
      <div
        className="w-full block min-h-[491px] 2xl:min-h-[700px] h-full relative mb-10 bg-no-repeat bg-cover bg-center flex items-center bg-[#C4C4C4]"
        style={{ backgroundImage: `url("${url}")` }}
      >
        {page?.id && (
          <div className="w-[650px] lg:px-[100px] md:px-[16px]">
            <h2 className="text-[40px] font-bold">{page?.title}</h2>
            <button className="mt-4 w-[170px] bg-indigo-500 hover:bg-indigo-400 text-white text-base py-2 rounded-[100px] transition duration-100">
              Shop Now
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-1 px-[100px]">
        <SearchBar />
      </div>
    </>
  );
};

export default BannerPage;
