'use client';

import { Temporal } from '@js-temporal/polyfill';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useEventStore } from '../model/EventStore';

// 레이아웃용 상수
const COL_WIDTH = 40;
const ROW_HEIGHT = 32;
const ROW_GAP = 12;
const HEADER_HEIGHT = 72;
const PADDING_DAYS = 40; //앞뒤로 며칠까지?
// 표시용 상수
const DAY_ABBRS = ['월', '화', '수', '목', '금', '토', '일'];
const MONTH_ABBRS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function EventPeriodChart() {
  // 실시간 시간 뱃지용 현재 시간
  const [now, setNow] = useState<Temporal.ZonedDateTime | null>(null);
  useEffect(() => {
    const interval = setInterval(() => setNow(Temporal.Now.zonedDateTimeISO()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 정제된 이벤트 데이터
  const chartEvents = useEventStore((store) => store.chartEvents);

  // 날짜 범위 계산
  const today = Temporal.Now.plainDateISO();
  const rangeStart = today.subtract({ days: PADDING_DAYS });
  const rangeEnd = today.add({ days: PADDING_DAYS });
  const totalDays = PADDING_DAYS * 2 + 1;
  const dates = Array.from({ length: totalDays }, (_, i) => rangeStart.add({ days: i }));

  // 레이아웃 계산
  const totalWidth = totalDays * COL_WIDTH;
  const chartHeight = HEADER_HEIGHT + chartEvents.length * (ROW_HEIGHT + ROW_GAP) + 8;

  // 실시간 시간 뱃지, 실시간 세로선 좌표 계산 함수
  const getX = (date: Temporal.PlainDate): number => rangeStart.until(date, { largestUnit: 'day' }).days * COL_WIDTH;
  const todayX = getX(today);
  const nowX = now ? ((now.hour * 3600 + now.minute * 60 + now.second) / 86400) * COL_WIDTH : COL_WIDTH / 2;

  // 초기 스크롤 이동
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = todayX - containerWidth / 2 + COL_WIDTH / 2;
    }
  }, [todayX]);

  // 실시간 시간 뱃지 표시용 문자열
  const timeStr = now
    ? `${String(now.hour).padStart(2, '0')}:${String(now.minute).padStart(2, '0')}:${String(now.second).padStart(2, '0')}`
    : '--:--:--';

  return (
    <section className="max-w-[1250px] flex flex-col gap-[8px] bg-[#121316] text-white select-none mt-[36px] mx-auto">
      {/* 섹션 제목 */}
      <div className="flex items-center">
        <h2 className="text-2xl font-bold pl-4 xl:pl-0">진행 중 이벤트</h2>
      </div>

      {/* 본문 */}
      <div ref={scrollRef} className="overflow-x-auto pt-5 pb-1 scrollbar-custom">
        <div className="relative" style={{ width: totalWidth, height: chartHeight }}>
          {/* 실시간 뱃지 & 실시간 세로선 */}
          <div className="absolute z-30 h-full" style={{ left: todayX + nowX + COL_WIDTH / 2 }}>
            <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border bg-white/80 px-2.5 text-[16px] text-black">
              {timeStr}
            </div>
            <div className="absolute top-[8px] bottom-[5px] left-1/2 -translate-x-1/2 w-[2px] bg-white" />
          </div>

          {/* 날짜 표시 부분 */}
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
                      className={cn(
                        'text-[16px]',
                        isFirstOfMonth ? 'font-semibold text-emerald-400' : 'text-custom-lightgray',
                      )}>
                      {isFirstOfMonth ? monthName : dayName}
                    </span>
                    <span className="text-[16px] text-white">{date.day}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 날짜 표시 밑에 흐린 세로선 */}
          {dates.map((_, i) => (
            <div
              key={`col-${i}`}
              className="absolute top-0 bottom-0 w-px bg-[#32353a]"
              style={{ left: i * COL_WIDTH + COL_WIDTH / 2 }}
            />
          ))}

          {/* 이벤트 바 */}
          {chartEvents.map((event, rowIndex) => {
            const startDate = Temporal.PlainDate.from(event.startDate);
            const endDate = Temporal.PlainDate.from(event.endDate);

            const startsBeforeRange = Temporal.PlainDate.compare(startDate, rangeStart) < 0;
            const endsAfterRange = Temporal.PlainDate.compare(endDate, rangeEnd) > 0;

            const clampedStart = startsBeforeRange ? rangeStart : startDate;
            const clampedEnd = endsAfterRange ? rangeEnd : endDate;

            const startX = getX(clampedStart) + COL_WIDTH / 2;
            const endX = getX(clampedEnd) + COL_WIDTH + COL_WIDTH / 2;
            const width = Math.max(endX - startX, COL_WIDTH);

            const top = HEADER_HEIGHT + 8 + rowIndex * (ROW_HEIGHT + ROW_GAP);

            const isActive = Temporal.PlainDate.compare(endDate, today) > 0;
            const remainingDays = isActive ? today.until(endDate, { largestUnit: 'day' }).days : null;
            const showBadge = remainingDays !== null && !endsAfterRange;

            const tl = startsBeforeRange ? 0 : 12;
            const bl = startsBeforeRange ? 0 : 12;
            const tr = endsAfterRange ? 0 : 12;
            const br = endsAfterRange ? 0 : 12;

            return (
              <a
                key={event.id}
                href={event.gms_url!}
                rel="noopener noreferrer"
                target="_blank"
                className="absolute flex items-center border border-white bg-gray-500/50"
                style={{
                  left: startX,
                  top,
                  width,
                  height: ROW_HEIGHT,
                  borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`,
                }}>
                <div className={cn('sticky left-1 px-2', 'max-w-full min-w-0')}>
                  <span className="truncate block text-[16px] font-bold text-white">{event.name}</span>
                </div>

                {showBadge && (
                  <span className="w-[45px] h-[22px] absolute left-full flex justify-center items-center ml-2 mr-2 rounded-full bg-white/80 text-[14px] text-gray-800 font-bold">
                    {remainingDays}일
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
