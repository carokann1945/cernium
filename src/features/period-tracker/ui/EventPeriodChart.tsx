'use client';

import { Temporal } from '@js-temporal/polyfill';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const COL_WIDTH = 60;
const ROW_HEIGHT = 44;
const ROW_GAP = 6;
const HEADER_HEIGHT = 72;
const PADDING_DAYS = 30;

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
  const [now, setNow] = useState<Date | null>(null);

  const today = Temporal.Now.plainDateISO();
  const rangeStart = today.subtract({ days: PADDING_DAYS });
  const rangeEnd = today.add({ days: PADDING_DAYS });
  const totalDays = PADDING_DAYS * 2 + 1;
  const totalWidth = totalDays * COL_WIDTH;
  const chartHeight = HEADER_HEIGHT + MOCK_EVENTS.length * (ROW_HEIGHT + ROW_GAP) + 20;

  const dates = Array.from({ length: totalDays }, (_, i) => rangeStart.add({ days: i }));

  const getX = (date: Temporal.PlainDate): number => rangeStart.until(date, { largestUnit: 'day' }).days * COL_WIDTH;

  const todayX = getX(today);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = todayX - containerWidth / 2 + COL_WIDTH / 2;
    }
  }, [todayX]);

  const timeStr = now ? now.toTimeString().slice(0, 8) : '--:--:--';

  return (
    <div className="flex flex-col bg-[#121316] text-white select-none mt-[18px]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-2xl font-bold tracking-tight">Events</h2>
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white">
            Newest <span className="text-xs">▲</span>
          </button>
          <button className="text-sm text-white/60 transition-colors hover:text-white">See more</button>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div ref={scrollRef} className="overflow-x-auto">
        <div className="relative" style={{ width: totalWidth, height: chartHeight }}>
          {/* Today's vertical line */}
          <div className="absolute top-0 bottom-0 z-10 w-px bg-white/40" style={{ left: todayX + COL_WIDTH / 2 }} />

          {/* Date header */}
          <div className="sticky top-0 z-20 bg-[#121316]" style={{ height: HEADER_HEIGHT }}>
            {dates.map((date, i) => {
              const isToday = date.equals(today);
              const isFirstOfMonth = date.day === 1;
              // Temporal: 1=Mon...7=Sun → map to DAY_ABBRS index (0=Su)
              const dayName = DAY_ABBRS[date.dayOfWeek % 7];
              const monthName = MONTH_ABBRS[date.month - 1];
              const x = i * COL_WIDTH;

              return (
                <div
                  key={date.toString()}
                  className="absolute flex flex-col items-center"
                  style={{ left: x, width: COL_WIDTH, height: HEADER_HEIGHT }}>
                  {isToday ? (
                    <>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-full border border-white/25 bg-[#2a2a2a] px-2.5 py-1 font-mono text-xs text-white">
                        {timeStr}
                      </div>
                      <div className="absolute bottom-3 flex flex-col items-center gap-0.5">
                        <span className="text-xs text-white/40">{dayName}</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-[#121316]">
                          {date.day}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute bottom-3 flex flex-col items-center gap-0.5">
                      <span
                        className={cn('text-xs', isFirstOfMonth ? 'font-semibold text-emerald-400' : 'text-white/40')}>
                        {isFirstOfMonth ? monthName : dayName}
                      </span>
                      <span className="text-sm text-white/70">{date.day}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column dividers */}
          {dates.map((_, i) => (
            <div
              key={`col-${i}`}
              className="absolute top-0 bottom-0 w-px bg-white/[0.04]"
              style={{ left: i * COL_WIDTH }}
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

            const startX = getX(clampedStart);
            const endX = getX(clampedEnd) + COL_WIDTH;
            const width = Math.max(endX - startX, COL_WIDTH);

            const top = HEADER_HEIGHT + rowIndex * (ROW_HEIGHT + ROW_GAP);

            const isActive = Temporal.PlainDate.compare(endDate, today) > 0;
            const remainingDays = isActive ? today.until(endDate, { largestUnit: 'day' }).days : null;
            const showBadge = remainingDays !== null && !endsAfterRange;

            const tl = startsBeforeRange ? 0 : 9999;
            const bl = startsBeforeRange ? 0 : 9999;
            const tr = endsAfterRange ? 0 : 9999;
            const br = endsAfterRange ? 0 : 9999;

            return (
              <div
                key={event.id}
                className="absolute flex items-center overflow-hidden"
                style={{
                  left: startX,
                  top,
                  width,
                  height: ROW_HEIGHT,
                  backgroundColor: event.color,
                  borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`,
                }}>
                <span className="flex-1 truncate px-4 text-sm font-medium text-white drop-shadow">{event.title}</span>
                {showBadge && (
                  <span className="mr-2 shrink-0 rounded-full bg-black/35 px-2.5 py-0.5 text-xs font-medium text-white/90">
                    {remainingDays}d 18h
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
