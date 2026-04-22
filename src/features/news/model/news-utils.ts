import { Temporal } from '@js-temporal/polyfill';
import { DAY_ABBRS } from '@/constants/time';
import { toCloudinaryFetchUrl } from '@/lib/cloudinary/fetch';
import { pad } from '@/lib/utils';
import type { News, NewsView } from '../types/news';

export function toNewsView(news: News): NewsView {
  let liveDateKst = '-';
  let isNew = false;

  if (news.live_date) {
    try {
      const zdt = Temporal.Instant.from(news.live_date).toZonedDateTimeISO('Asia/Seoul');
      liveDateKst = `${zdt.year}.${pad(zdt.month)}.${pad(zdt.day)}(${DAY_ABBRS[zdt.dayOfWeek - 1]})`;

      const today = Temporal.Now.plainDateISO('Asia/Seoul');
      const liveDate = zdt.toPlainDate();
      const diffDays = liveDate.until(today).days;
      isNew = diffDays >= 0 && diffDays <= 2;
    } catch {
      liveDateKst = '-';
    }
  }

  return {
    id: news.id,
    name: news.name ?? '',
    live_date: news.live_date,
    image_thumbnail: toCloudinaryFetchUrl(news.image_thumbnail),
    url: news.url,
    translation: news.translation,
    liveDateKst,
    isNew,
  };
}
