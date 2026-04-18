@package.json

# Project Context

이 프로젝트는 Next.js(App Router 우선), pnpm, Tailwind CSS를 기본 스택으로 사용한다.
현재 구조는 서버 컴포넌트에서 데이터 조회와 가공을 담당하고, feature 단위 클라이언트 컴포넌트가 정렬·선택·모달 같은 상호작용을 맡는 형태다.
기존 패턴과 디렉터리 구조를 먼저 따르고, 새로운 추상화나 의존성 추가는 마지막 수단으로 한다.

## Environment

- WSL2 Ubuntu — Linux 경로 사용 (`/home/user/...`)
- Windows 경로(`C:\\...`) 또는 WSL 마운트 경로(`/mnt/c/...`) 사용 금지
- Shell: bash

## Working Style

- 큰 변경 전에는 접근 방식과 영향 범위를 짧게 정리한다.
- 요청 범위를 벗어나는 리팩터링은 하지 않는다.
- 같은 목적이면 새 파일 추가보다 기존 파일 수정 우선으로 판단한다.
- 기존 ESLint, TypeScript, 테스트 규칙이 있으면 그것을 우선 따른다.
- 패키지 매니저는 항상 pnpm만 사용한다. npm, yarn, bun 명령은 사용하지 않는다.
- 스크립트 이름은 추정하지 말고 `package.json`을 확인한다.
- 새로운 라이브러리를 추가할 때는 기존 도구로 해결할 수 없는 이유가 분명해야 한다.

## Commands

- install: `pnpm install`
- dev: `pnpm dev`
- build: `pnpm build`
- lint: `pnpm lint`
- test: `package.json`에 있을 때만 `pnpm test`
- typecheck: `package.json`에 있을 때만 `pnpm typecheck`
- monorepo인 경우 필요한 패키지에만 `pnpm --filter <package>`를 사용한다.
- workspace 내부 패키지를 참조할 때는 가능하면 `workspace:` protocol을 우선한다.

## Output Expectations

변경 후에는 아래를 간단히 보고한다.

1. 무엇을 바꿨는지
2. 왜 그렇게 바꿨는지
3. 실행한 검증 명령
4. 남아 있는 리스크 또는 추가 확인 포인트

## Architecture Rules

- Next.js App Router 기준으로 설계한다.
- 새 라우트는 `app/` 기준으로 추가하고, Pages Router 패턴을 새로 도입하지 않는다.
- 페이지와 라우트는 `app/`, 도메인 기능은 `features/`, 공통 UI는 `components/`, 범용 유틸은 `lib/`, 상수는 `constants/`를 우선 고려한다.
- `features/` 안에서는 현재 구조처럼 `event`, `maintenance`, `news`, `game-version` 단위 구성을 먼저 따른다.
- 타입은 먼저 해당 feature 내부에 두고, 여러 feature가 함께 쓰는 경우에만 상위 공용 위치를 검토한다.
- 파일 배치는 기존 코드베이스 관례를 가장 우선한다.
- 새로 만든다면 네이밍은 다음을 따른다.
  - 컴포넌트: `PascalCase`
  - hooks: `useXxx`
  - 서버 액션: 동사형 `camelCase`
  - 유틸 함수: `camelCase`

## Next.js

- 기본값은 Server Component라고 생각하고 시작한다.
- `use client`는 state, effect, event handler, browser API가 실제로 필요할 때만 붙인다.
- Client Component는 가능한 얇게 유지하고, 데이터 조회와 가공은 Server Component에서 먼저 처리한다.
- Client Component를 `async` 함수로 만들지 않는다.
- 서버 전용 로직과 비밀값 접근은 서버에서만 처리한다.
- 새 페이지나 레이아웃에서는 가능하면 `metadata` export 또는 `generateMetadata`를 사용한다.
- 쿠키, `connection()`, Route Handler, Server Action은 현재 코드베이스 패턴과 일관되게 사용한다.
- 내부 이동은 `next/link`를 우선 사용한다.
- 이미지 최적화 이점이 있으면 `next/image`를 우선 검토한다.
- 로딩, 에러, empty 상태를 명시적으로 다룬다.

## Data Fetching / Mutation

- 서버에서 해결 가능한 데이터는 서버에서 가져온다.
- Supabase 조회는 현재처럼 feature의 `model/` 또는 서버 경계 가까이에 둔다.
- 캐시 가능한 조회라면 기존 fetch 함수처럼 `'use cache'`, `cacheTag`, `cacheLife` 패턴을 먼저 검토한다.
- 게임 버전 필터링은 `game-version` 모델의 `parseGameVersion`, `filterByGameVersion` 같은 기존 헬퍼를 우선 재사용한다.
- mutation은 현재 코드베이스 패턴을 따른다.
- App Router에서 새 패턴이 필요하면 Server Action 또는 Route Handler를 검토하되, 기존 방식과의 일관성을 우선한다.
- 요청 경계에서 입력값 검증과 에러 처리를 분명히 둔다.

## Client State

- 전역 상태 라이브러리 도입보다 로컬 `useState`, `useTransition`, `useEffect`로 해결할 수 있는지 먼저 본다.
- 정렬 토글, 모달 열림 여부, optimistic 선택값처럼 화면 한정 상태는 해당 feature의 클라이언트 컴포넌트에 둔다.
- 브라우저 히스토리와 연결된 모달처럼 재사용 가능한 상호작용은 현재처럼 `app/hooks/` 아래 훅으로 추출할 수 있다.
- 불필요한 전역 singleton 상태는 만들지 않는다.

## Tailwind CSS

- 스타일은 Tailwind utility-first 방식으로 작성한다.
- 반복되는 UI 패턴은 긴 className 복붙보다 재사용 가능한 컴포넌트 추출을 먼저 검토한다.
- className 순서는 대체로 `layout -> spacing -> size -> typography -> color -> effect -> state` 흐름을 선호한다.
- 매직 넘버와 임의값 남발을 피하고, 반복되면 토큰, variant, 컴포넌트 추출을 검토한다.
- 전역 스타일은 최소화하고 `app/globals.css`는 reset, theme, custom utilities 정도로 제한한다.
- 조건부 class 조합은 기존 유틸이 있으면 재사용하고, 없으면 과한 추상화 없이 읽기 쉽게 작성한다.

## TypeScript

- `any`는 가능한 피한다. 꼭 필요하면 이유가 분명해야 한다.
- 공개 함수, 훅, Server Action API는 입력과 출력 타입을 분명히 둔다.
- 좁힐 수 있는 union, literal type, utility type을 우선 사용한다.
- API 응답, 폼 데이터, route params는 경계에서 검증한다.
- 타입 전용 import는 `import type`을 우선 사용한다.

## Components

- 프레젠테이셔널 컴포넌트와 상태 결합 컴포넌트를 무분별하게 섞지 않는다.
- props가 과도하게 많아지면 컴포넌트 분리나 도메인 모델 정리를 먼저 검토한다.
- 접근성을 기본값으로 둔다. `button` type, `label`, `aria-*`, keyboard navigation, focus state를 챙긴다.
- 불필요한 `useEffect`는 추가하지 않는다. 계산 가능한 값은 render, server side, 기존 헬퍼로 먼저 해결한다.

## Forms / UX

- 폼은 제출 중 상태, 에러 메시지, 성공 후 흐름까지 포함해서 완결되게 만든다.
- optimistic update를 넣을 때는 실패 시 롤백 경로도 함께 구현한다.
- 사용자에게 보이는 문자열은 기존 상수, 도메인 표현, 현재 UI 톤과 맞춘다.
- 모달을 추가할 때는 배경 스크롤 잠금, 닫기 버튼, 외부 클릭, 뒤로가기 동작까지 함께 고려한다.

## API / Security

- 비밀값은 코드에 하드코딩하지 않는다.
- 환경변수는 `process.env`를 통해 사용하고, 클라이언트 공개가 필요한 값만 공개 prefix 규칙을 따른다.
- 입력값은 신뢰하지 말고 서버에서 다시 검증한다.
- 로그에는 토큰, 쿠키, 개인정보를 남기지 않는다.

## Testing / Verification

- 변경 범위에 맞는 최소 검증을 수행한다.
- 기본 검증 순서는 다음을 따른다.
  1. 관련 파일 수준의 타입, 린트, import 오류 확인
  2. 가능하면 `pnpm lint`
  3. 변경 영향이 있으면 관련 `pnpm test`
  4. 배포 영향이 있으면 `pnpm build`
- Vitest에서 `@/` 별칭을 사용하는 구조이므로, 새 테스트 설정이나 경로 변경 시 TS 경로와 테스트 경로 해석이 같이 맞는지 확인한다.
- 검증 명령이 없거나 실행할 수 없으면 그 사실과 이유를 명확히 적는다.

## What Not To Do

- 요청 없이 대규모 폴더 이동, 파일명 변경, 라우트 변경을 하지 않는다.
- 기존 패턴을 무시하고 새로운 상태관리나 스타일링 라이브러리를 추가하지 않는다.
- server/client 경계를 흐리는 편법을 만들지 않는다.
- unrelated formatting, cleanup, rename을 한 번에 섞지 않는다.

## When Unsure

- 먼저 현재 코드베이스의 패턴을 2~3곳 확인한 뒤 가장 일관된 방식을 따른다.
- 트레이드오프가 있으면 더 단순하고 되돌리기 쉬운 구현을 우선한다.
- 프로젝트가 커지면 세부 규칙을 `.claude/rules/` 아래로 분리한다.
