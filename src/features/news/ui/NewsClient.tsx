'use client';

import type { NewsView } from '../types/news';
import NewsList from './NewsList';

type Props = {
  news: NewsView[];
  lastUpdated: string;
};

export default function NewsClient({ news, lastUpdated }: Props) {
  return (
    <>
      <section className="max-w-[1250px] flex flex-col gap-[8px] bg-custom-bg select-none mt-[70px] mx-auto">
        <h2 className="text-2xl text-main-white font-bold pl-4 xl:pl-0">News</h2>
        <p className="text-sm text-sub-white pl-4 xl:pl-0">last update : {lastUpdated}</p>
      </section>
      <NewsList news={news} />
    </>
  );
}
