'use client';

import { Temporal } from '@js-temporal/polyfill';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const COL_WIDTH = 40;
const ROW_HEIGHT = 32;
const ROW_GAP = 12;
const HEADER_HEIGHT = 72;
const PADDING_DAYS = 40;

const DAY_ABBRS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_ABBRS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// 목데이터 타입
interface GameEvent {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
}

// 목데이터
const MOCK_EVENTS: GameEvent[] = [
  {
    id: 1,
    title: '낚싯대에 걸려온 어딘가 엉뚱한 보물 물고기',
    startDate: '2026-03-20',
    endDate: '2026-04-07',
    color: '#2fa86a',
  },
  {
    id: 2,
    title: '거짓말 같은 스페셜 접속 보상',
    startDate: '2026-03-20',
    endDate: '2026-04-13',
    color: '#4a8fd0',
  },
  {
    id: 3,
    title: '전이 로테이션 : 두 개의 어둠',
    startDate: '2026-03-20',
    endDate: '2026-04-14',
    color: '#c44040',
  },
  {
    id: 4,
    title: '설렘 가득한 날씨와 함께, 일일 접속 보상',
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    color: '#c8a020',
  },
  {
    id: 5,
    title: '파트리지오의 비밀 상자와 함께, 특별한 상점 OPEN',
    startDate: '2026-03-22',
    endDate: '2026-03-31',
    color: '#7b4fbf',
  },
  {
    id: 6,
    title: '협동 아토락시온에 도전하고, 추가 보상을 쟁취하라.',
    startDate: '2026-03-24',
    endDate: '2026-03-31',
    color: '#b857a0',
  },
  {
    id: 7,
    title: '크론 왕국 최후의 왕태자 그 흔적을 찾아서',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    color: '#c47a30',
  },
  {
    id: 8,
    title: '3월, 매일 찾아오는 접속 보상',
    startDate: '2026-03-01',
    endDate: '2026-03-30',
    color: '#4a90c0',
  },
  {
    id: 9,
    title: '매일 받아가는 특별 보상, 달콤한 데일리 스페셜 패스',
    startDate: '2026-03-20',
    endDate: '2026-04-07',
    color: '#b89020',
  },
  {
    id: 10,
    title: '[기간 연장] 올비아 아카데미 OPEN, 입학 기념 도전과제',
    startDate: '2026-03-20',
    endDate: '2026-04-07',
    color: '#d44f8a',
  },
  {
    id: 11,
    title: '올비아 아카데미 개교, 아카데미 패스 (최종 수정 : 2025-01-28 14:55)',
    startDate: '2026-02-15',
    endDate: '2026-04-14',
    color: '#d4703a',
  },
];

export default function EventPeriodChart() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Temporal.ZonedDateTime | null>(null);

  const today = Temporal.Now.plainDateISO();
  const rangeStart = today.subtract({ days: PADDING_DAYS });
  const rangeEnd = today.add({ days: PADDING_DAYS });
  const totalDays = PADDING_DAYS * 2 + 1;
  const totalWidth = totalDays * COL_WIDTH;
  const chartHeight = HEADER_HEIGHT + MOCK_EVENTS.length * (ROW_HEIGHT + ROW_GAP) + 8;

  const dates = Array.from({ length: totalDays }, (_, i) => rangeStart.add({ days: i }));

  const getX = (date: Temporal.PlainDate): number => rangeStart.until(date, { largestUnit: 'day' }).days * COL_WIDTH;

  const todayX = getX(today);
  const nowX = now ? ((now.hour * 3600 + now.minute * 60 + now.second) / 86400) * COL_WIDTH : COL_WIDTH / 2;

  useEffect(() => {
    const interval = setInterval(() => setNow(Temporal.Now.zonedDateTimeISO()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = todayX - containerWidth / 2 + COL_WIDTH / 2;
    }
  }, [todayX]);

  const timeStr = now
    ? `${String(now.hour).padStart(2, '0')}:${String(now.minute).padStart(2, '0')}:${String(now.second).padStart(2, '0')}`
    : '--:--:--';

  return (
    <div className="max-w-[1250px] flex flex-col gap-[8px] bg-[#121316] text-white select-none mt-[36px] mx-auto">
      {/* Top bar */}
      <div className="flex items-center">
        <h2 className="text-2xl font-bold pl-4 xl:pl-0">진행 중 이벤트</h2>
      </div>

      {/* Horizontal scroll container */}
      <div ref={scrollRef} className="overflow-x-auto pt-5 pb-1 scrollbar-custom">
        <div className="relative" style={{ width: totalWidth, height: chartHeight }}>
          {/* 현재 시간 뱃지 & 세로선 실시간으로 이동 */}
          <div className="absolute z-30 h-full" style={{ left: todayX + nowX + COL_WIDTH / 2 }}>
            <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border bg-white/80 px-2.5 text-[16px] text-black">
              {timeStr}
            </div>
            <div className="absolute top-[8px] bottom-[5px] left-1/2 -translate-x-1/2 w-[2px] bg-white" />
          </div>

          {/* Date header */}
          <div className="sticky top-0 z-20 bg-custom-bg" style={{ height: HEADER_HEIGHT }}>
            {dates.map((date, i) => {
              const isFirstOfMonth = date.day === 1;
              const dayName = DAY_ABBRS[date.dayOfWeek % 7];
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

          {/* Column dividers */}
          {dates.map((_, i) => (
            <div
              key={`col-${i}`}
              className="absolute top-0 bottom-0 w-px bg-[#32353a]"
              style={{ left: i * COL_WIDTH + COL_WIDTH / 2 }}
            />
          ))}

          {/* Event bars */}
          {MOCK_EVENTS.map((event, rowIndex) => {
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
              <div
                key={event.id}
                className="absolute flex items-center border border-white bg-gray-500/50"
                style={{
                  left: startX,
                  top,
                  width,
                  height: ROW_HEIGHT,
                  borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`,
                }}>
                <div className={cn('sticky left-1 px-2', 'max-w-full min-w-0')}>
                  <span className="truncate block text-[16px] font-bold text-white">{event.title}</span>
                </div>

                {showBadge && (
                  <span className="w-[65px] h-[22px] absolute left-full flex justify-center items-center ml-2 mr-2 rounded-full bg-white/80 text-[14px] text-gray-800 font-bold">
                    {remainingDays}d 18H
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
