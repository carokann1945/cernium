'use client';

import type { NewsView } from '../types/news';
import NewsLists from './NewsLists';

type Props = {
  news: NewsView[];
};

export default function NewsTrackerClient({ news }: Props) {
  return (
    <>
      <section className="max-w-[1250px] flex flex-col gap-[8px] bg-custom-bg select-none mt-[100px] mx-auto">
        <h2 className="text-2xl text-main-white font-bold pl-4 xl:pl-0">News</h2>
      </section>
      <NewsLists news={news} />
    </>
  );
}
