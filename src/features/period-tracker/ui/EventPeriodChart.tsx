'use client';

import { Temporal } from '@js-temporal/polyfill';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DAY_ABBRS, MONTH_ABBRS } from '@/constants/time';
import { cn } from '@/lib/utils';
import type { OngoingEventView } from '../types/event';

const COL_WIDTH = 40;
const ROW_HEIGHT = 32;
const ROW_GAP = 12;
const HEADER_HEIGHT = 72;
const PADDING_DAYS = 40;
const BADGE_HEIGHT = 22;

type Props = {
  events: OngoingEventView[];
  initialNowIso: string;
};

type EventBarLayout = {
  id: string;
  name: string;
  href: string | null;
  imageThumbnail: string | null;
  left: number;
  top: number;
  width: number;
  borderRadius: string;
  badgeLeft: number;
  badgeTop: number;
  endEpochMs: number;
  showCountdown: boolean;
};

function getDateX(rangeStart: Temporal.PlainDate, date: Temporal.PlainDate) {
  return rangeStart.until(date, { largestUnit: 'day' }).days * COL_WIDTH;
}

function getTimeOffset(value: Temporal.ZonedDateTime | Temporal.PlainDateTime) {
  return ((value.hour * 3600 + value.minute * 60 + value.second) / 86400) * COL_WIDTH;
}

function formatClock(now: Temporal.ZonedDateTime) {
  return `${String(now.hour).padStart(2, '0')}:${String(now.minute).padStart(2, '0')}:${String(now.second).padStart(2, '0')}`;
}

function formatRemainingLabel(diffMs: number) {
  if (diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}일 ${hours}시간`;
  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return `${minutes}분`;
}

export default function EventPeriodChart({ events, initialNowIso }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const initialNow = useMemo(
    () => Temporal.ZonedDateTime.from(initialNowIso).withTimeZone('Asia/Seoul'),
    [initialNowIso],
  );

  const today = useMemo(() => initialNow.toPlainDate(), [initialNow]);
  const rangeStart = useMemo(() => today.subtract({ days: PADDING_DAYS }), [today]);
  const rangeEnd = useMemo(() => today.add({ days: PADDING_DAYS }), [today]);
  const totalDays = PADDING_DAYS * 2 + 1;

  const dates = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => rangeStart.add({ days: i })),
    [rangeStart, totalDays],
  );

  const totalWidth = totalDays * COL_WIDTH;
  const chartHeight = HEADER_HEIGHT + events.length * (ROW_HEIGHT + ROW_GAP) + 8;
  const todayX = getDateX(rangeStart, today);

  const barLayouts = useMemo<EventBarLayout[]>(() => {
    return events.map((event, rowIndex) => {
      const start = Temporal.Instant.from(event.startAtIso).toZonedDateTimeISO('Asia/Seoul');
      const end = Temporal.Instant.from(event.endAtIso).toZonedDateTimeISO('Asia/Seoul');

      const startDate = start.toPlainDate();
      const endDate = end.toPlainDate();

      const startsBeforeRange = Temporal.PlainDate.compare(startDate, rangeStart) < 0;
      const endsAfterRange = Temporal.PlainDate.compare(endDate, rangeEnd) > 0;

      const startX = startsBeforeRange
        ? getDateX(rangeStart, rangeStart) + COL_WIDTH / 2
        : getDateX(rangeStart, startDate) + COL_WIDTH / 2 + getTimeOffset(start);

      const endX = endsAfterRange
        ? getDateX(rangeStart, rangeEnd) + COL_WIDTH / 2 + COL_WIDTH
        : getDateX(rangeStart, endDate) + COL_WIDTH / 2 + getTimeOffset(end);

      const top = HEADER_HEIGHT + 8 + rowIndex * (ROW_HEIGHT + ROW_GAP);

      const tl = startsBeforeRange ? 0 : 12;
      const bl = startsBeforeRange ? 0 : 12;
      const tr = endsAfterRange ? 0 : 12;
      const br = endsAfterRange ? 0 : 12;

      return {
        id: event.id,
        name: event.name,
        href: event.gms_url,
        imageThumbnail: event.image_thumbnail,
        left: startX,
        top,
        width: Math.max(endX - startX, COL_WIDTH),
        borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`,
        badgeLeft: endX + 8,
        badgeTop: top + (ROW_HEIGHT - BADGE_HEIGHT) / 2,
        endEpochMs: end.epochMilliseconds,
        showCountdown: !endsAfterRange,
      };
    });
  }, [events, rangeStart, rangeEnd]);

  useLayoutEffect(() => {
    if (!scrollRef.current) return;

    const containerWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollLeft = todayX - containerWidth / 2 + COL_WIDTH / 2;
  }, [todayX]);

  if (events.length === 0) return null;

  return (
    <div ref={scrollRef} className="overflow-x-auto pt-5 pb-1 pl-5 scrollbar-custom">
      <div className="relative" style={{ width: totalWidth, height: chartHeight }}>
        <EventPeriodLiveOverlay
          initialNowIso={initialNowIso}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          chartHeight={chartHeight}
          barLayouts={barLayouts}
        />

        <div className="sticky top-0 z-20 bg-custom-bg" style={{ height: HEADER_HEIGHT }}>
          {dates.map((date, i) => {
            const isFirstOfMonth = date.day === 1;
            const dayName = DAY_ABBRS[date.dayOfWeek - 1];
            const monthName = MONTH_ABBRS[date.month - 1];
            const x = i * COL_WIDTH;

            return (
              <div
                key={date.toString()}
                className="absolute flex flex-col items-center"
                style={{ left: x, width: COL_WIDTH, height: HEADER_HEIGHT }}>
                <div className="absolute bottom-[3px] flex flex-col items-center gap-px">
                  <span
                    className={cn('text-[16px]', isFirstOfMonth ? 'font-semibold text-emerald-400' : 'text-sub-white')}>
                    {isFirstOfMonth ? monthName : dayName}
                  </span>
                  <span className="text-[16px] text-white">{date.day}</span>
                </div>
              </div>
            );
          })}
        </div>

        {dates.map((_, i) => (
          <div
            key={`col-${i}`}
            className="absolute top-0 bottom-0 w-px bg-gray-600"
            style={{ left: i * COL_WIDTH + COL_WIDTH / 2 }}
          />
        ))}

        {barLayouts.map((bar) =>
          bar.href ? (
            <a
              key={bar.id}
              href={bar.href}
              rel="noopener noreferrer"
              target="_blank"
              className="absolute flex items-center border border-gray-600 bg-gray-500/50"
              style={{
                left: bar.left,
                top: bar.top,
                width: bar.width,
                height: ROW_HEIGHT,
                borderRadius: bar.borderRadius,
              }}>
              {bar.imageThumbnail && (
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ borderRadius: bar.borderRadius }}>
                  <div className="absolute right-0 top-0 h-full" style={{ width: 300 }}>
                    <Image
                      src={bar.imageThumbnail}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-cover"
                      style={{ objectPosition: 'center 40%' }}
                    />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to left, rgba(38,38,38,0) 0px, rgba(38,38,38,1) 200px)' }}
                  />
                </div>
              )}
              <div className={cn('sticky left-0 px-2 z-10', 'max-w-full min-w-0')}>
                <span className="font-glegoo truncate block text-[16px] font-bold">{bar.name}</span>
              </div>
            </a>
          ) : (
            <div
              key={bar.id}
              aria-disabled="true"
              className="absolute flex items-center border border-main-white bg-gray-500/50"
              style={{
                left: bar.left,
                top: bar.top,
                width: bar.width,
                height: ROW_HEIGHT,
                borderRadius: bar.borderRadius,
              }}>
              {bar.imageThumbnail && (
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ borderRadius: bar.borderRadius }}>
                  <div className="absolute right-0 top-0 h-full" style={{ width: 300 }}>
                    <Image
                      src={bar.imageThumbnail}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-cover"
                      style={{ objectPosition: 'center 40%' }}
                    />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to left, rgba(38,38,38,0) 0px, rgba(38,38,38,1) 200px)' }}
                  />
                </div>
              )}
              <div className={cn('sticky left-0 px-2 z-10', 'max-w-full min-w-0')}>
                <span className="truncate block text-[16px] font-bold text-main-white">{bar.name}</span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

type LiveOverlayProps = {
  initialNowIso: string;
  rangeStart: Temporal.PlainDate;
  rangeEnd: Temporal.PlainDate;
  chartHeight: number;
  barLayouts: EventBarLayout[];
};

function EventPeriodLiveOverlay({ initialNowIso, rangeStart, rangeEnd, chartHeight, barLayouts }: LiveOverlayProps) {
  const initialNow = useMemo(
    () => Temporal.ZonedDateTime.from(initialNowIso).withTimeZone('Asia/Seoul'),
    [initialNowIso],
  );

  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    const updateNow = () => setNow(Temporal.Now.zonedDateTimeISO('Asia/Seoul'));

    updateNow();

    const interval = window.setInterval(updateNow, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const nowDate = now.toPlainDate();
  const isInRange =
    Temporal.PlainDate.compare(nowDate, rangeStart) >= 0 && Temporal.PlainDate.compare(nowDate, rangeEnd) <= 0;

  const lineLeft = isInRange ? getDateX(rangeStart, nowDate) + COL_WIDTH / 2 + getTimeOffset(now) : null;

  return (
    <>
      {lineLeft !== null && (
        <div className="absolute z-30" style={{ left: lineLeft, height: chartHeight }}>
          <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border bg-white/80 px-2.5 text-[16px] text-black">
            {formatClock(now)}
          </div>
          <div className="absolute top-[8px] left-1/2 h-[calc(100%-13px)] w-[2px] -translate-x-1/2 bg-white" />
        </div>
      )}

      {barLayouts.map((bar) => {
        if (!bar.showCountdown) return null;

        const label = formatRemainingLabel(bar.endEpochMs - now.epochMilliseconds);
        if (label === null) return null;

        return (
          <span
            key={`${bar.id}-remaining`}
            className={cn(
              'absolute flex items-center justify-center whitespace-nowrap rounded-full bg-white/80 px-1 text-[14px] font-bold text-gray-800 z-30',
            )}
            style={{ left: bar.badgeLeft, top: bar.badgeTop, height: BADGE_HEIGHT }}>
            {label}
          </span>
        );
      })}
    </>
  );
}
