import { Temporal } from '@js-temporal/polyfill';
import { connection } from 'next/server';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MaintenanceTracker from './MaintenanceTracker';
import { getCachedMaintenances } from './model/maintenances';
import type { Maintenance } from './types/maintenance';

vi.mock('next/server', () => ({
  connection: vi.fn(),
}));

vi.mock('@/constants/time', () => ({
  DAY_ABBRS: ['월', '화', '수', '목', '금', '토', '일'],
}));

vi.mock('@/lib/utils', () => ({
  cn: (...inputs: Array<string | false | null | undefined>) => inputs.filter(Boolean).join(' '),
  pad: (n: number) => String(n).padStart(2, '0'),
}));

vi.mock('./model/maintenances', () => ({
  getCachedMaintenances: vi.fn(),
}));

function createMaintenance(overrides: Partial<Maintenance> = {}): Maintenance {
  return {
    id: 'maintenance-1',
    name: 'Scheduled Maintenance',
    live_date: '2026-04-09T00:00:00Z',
    start_at: '2026-04-10T01:00:00Z',
    end_at: '2026-04-10T05:30:00Z',
    url: 'https://www.nexon.com/maplestory/news/maintenance/1',
    ...overrides,
  };
}

async function renderTracker(): Promise<string> {
  const element = await MaintenanceTracker();
  return renderToStaticMarkup(element);
}

describe('MaintenanceTracker', () => {
  const mockedConnection = vi.mocked(connection);
  const mockedGetCachedMaintenances = vi.mocked(getCachedMaintenances);

  beforeEach(() => {
    mockedConnection.mockReset();
    mockedConnection.mockResolvedValue(undefined);
    mockedGetCachedMaintenances.mockReset();
    vi.spyOn(Temporal.Now, 'instant').mockReturnValue(Temporal.Instant.from('2026-04-10T03:00:00Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('데이터 조회 실패 시 에러 문구를 렌더링한다', async () => {
    mockedGetCachedMaintenances.mockResolvedValue(null);

    const markup = await renderTracker();

    expect(markup).toContain('점검 데이터를 불러오지 못했습니다. (500)');
    expect(mockedConnection).toHaveBeenCalledTimes(1);
  });

  it('진행 예정이거나 진행 중인 점검이 없으면 빈 상태 문구를 렌더링한다', async () => {
    mockedGetCachedMaintenances.mockResolvedValue([
      createMaintenance({
        id: 'ended-maintenance',
        name: 'Already Finished',
        start_at: '2026-04-09T23:00:00Z',
        end_at: '2026-04-10T03:00:00Z',
      }),
      createMaintenance({
        id: 'missing-start',
        name: 'Missing Start Date',
        start_at: null,
        end_at: '2026-04-10T06:00:00Z',
      }),
    ]);

    const markup = await renderTracker();

    expect(markup).toContain('진행 예정이거나 진행 중인 점검이 없습니다');
    expect(markup).not.toContain('Already Finished');
    expect(markup).not.toContain('Missing Start Date');
  });

  it('진행 중, 예정, 잘못된 날짜 문자열을 현재 동작대로 렌더링한다', async () => {
    mockedGetCachedMaintenances.mockResolvedValue([
      createMaintenance({
        id: 'ongoing-maintenance',
        name: 'Ongoing Maintenance',
        start_at: '2026-04-10T01:00:00Z',
        end_at: '2026-04-10T05:30:00Z',
        url: 'https://www.nexon.com/maplestory/news/maintenance/ongoing',
      }),
      createMaintenance({
        id: 'upcoming-maintenance',
        name: 'Upcoming Maintenance',
        start_at: '2026-04-11T00:00:00Z',
        end_at: null,
        url: 'https://www.nexon.com/maplestory/news/maintenance/upcoming',
      }),
      createMaintenance({
        id: 'invalid-maintenance',
        name: 'Invalid Maintenance',
        start_at: 'not-an-iso',
        end_at: '2026-04-12T00:00:00Z',
        url: null,
      }),
      createMaintenance({
        id: 'ended-maintenance',
        name: 'Ended Maintenance',
        start_at: '2026-04-09T00:00:00Z',
        end_at: '2026-04-10T03:00:00Z',
      }),
    ]);

    const markup = await renderTracker();

    expect(markup).toContain('Ongoing Maintenance');
    expect(markup).toContain('Upcoming Maintenance');
    expect(markup).toContain('Invalid Maintenance');
    expect(markup).not.toContain('Ended Maintenance');

    expect(markup).toContain('점검 진행중');
    expect(markup).toContain('점검 예정');
    expect(markup).toContain('04.10(금) 10:00 ~ 04.10(금) 14:30');
    expect(markup).toContain('04.11(토) 09:00 ~ 미정');
    expect(markup).toContain('기간 정보 없음');

    expect(markup).toContain('href="https://www.nexon.com/maplestory/news/maintenance/ongoing"');
    expect(markup).toContain('href="https://www.nexon.com/maplestory/news/maintenance/upcoming"');
    expect(markup).toContain('href="#"');
  });
});
