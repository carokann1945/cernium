import { Temporal } from '@js-temporal/polyfill';
import { toCloudinaryFetchUrl } from '@/lib/cloudinary/fetch';
import { DAY_ABBRS } from '../../../constants/time';
import type { News, NewsView } from '../types/news';

const KST = 'Asia/Seoul';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function toNewsView(news: News): NewsView {
  let liveDateKst = '-';
  let isNew = false;

  if (news.live_date) {
    try {
      const zdt = Temporal.Instant.from(news.live_date).toZonedDateTimeISO(KST);
      liveDateKst = `${zdt.year}.${pad(zdt.month)}.${pad(zdt.day)}(${DAY_ABBRS[zdt.dayOfWeek - 1]})`;

      const today = Temporal.Now.plainDateISO(KST);
      const liveDate = zdt.toPlainDate();
      const diffDays = liveDate.until(today).days;
      isNew = diffDays >= 0 && diffDays <= 6;
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
