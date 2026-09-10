# TRPG MASTER DASHBOARD v13

4~5명이 함께 즐기는 웹 기반 TRPG 진행 도구입니다.
빌드 도구 없이 동작하는 **정적 웹사이트**(HTML + CSS + ES Modules)라서 GitHub Pages에 그대로 올릴 수 있습니다.

- **마스터 화면** — 맵/캐릭터/NPC/보스/장비/아이템/상점/대장간/스킬/펌블/세력/월드 이벤트 설정
- **메인 진행 화면** — d20 판정, 턴 순서, 피해·회복·상태이상 처리, 전리품 지급, 연출 효과
- **플레이어 화면** — 캐릭터 생성/로그인, 스탯 분배, 인벤토리, 상점·대장간 이용
- **실시간 멀티플레이** — Firebase Firestore를 통해 방 코드 하나로 4~5명이 같은 데이터를 공유

---

## 1. 바로 실행해 보기 (로컬)

ES Module을 쓰기 때문에 `index.html`을 더블클릭하면 동작하지 않습니다. 반드시 웹 서버로 열어주세요.

```bash
python3 -m http.server 8000
```

그 다음 브라우저에서 <http://localhost:8000> 로 접속합니다.

이 상태에서도 혼자서는 모든 기능을 쓸 수 있습니다. 데이터는 브라우저 `localStorage`에 저장됩니다.

---

## 2. GitHub Pages로 배포하기

1. 이 저장소를 GitHub에 `push` 합니다.
2. 저장소 **Settings → Pages** 로 이동합니다.
3. **Build and deployment → Source** 를 **GitHub Actions** 로 선택합니다.
4. `main` 브랜치에 push하면 `.github/workflows/pages.yml` 이 자동으로 배포합니다.
5. 몇 분 뒤 `https://<사용자명>.github.io/<저장소명>/` 에서 접속할 수 있습니다.

---

## 3. 실시간 멀티플레이 켜기 (Firebase 설정)

여기까지만 하면 각자의 브라우저에 따로 저장되는 "로컬 단독 플레이"입니다.
4~5명이 같은 판을 공유하려면 Firebase 설정이 한 번 필요합니다. (무료 Spark 요금제로 충분합니다.)

### 3-1. Firebase 프로젝트 만들기

1. <https://console.firebase.google.com> 접속 → **프로젝트 추가**
2. 프로젝트 이름 입력 (Google 애널리틱스는 꺼도 됩니다)
3. 좌측 메뉴 **빌드 → Firestore Database → 데이터베이스 만들기**
   - 위치는 `asia-northeast3 (서울)` 권장
   - 시작 모드는 아무거나 골라도 됩니다 (3-3에서 규칙을 덮어씁니다)

### 3-2. 웹 앱 키 발급받아 넣기

1. 프로젝트 개요 옆 **⚙ 프로젝트 설정 → 내 앱 → 웹(`</>`)** 아이콘 클릭
2. 앱 닉네임 입력 후 등록하면 `firebaseConfig` 값이 나옵니다
3. 그 값을 [`js/firebase_config.js`](js/firebase_config.js) 에 그대로 붙여넣습니다

```js
export const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "my-trpg.firebaseapp.com",
  projectId: "my-trpg",
  storageBucket: "my-trpg.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```

> Firebase 웹 API 키는 **공개되어도 되는 값**입니다. 실제 접근 제어는 아래 보안 규칙이 담당합니다.
> 그래도 걱정된다면 Firebase 콘솔의 **App Check** 와 **승인된 도메인** 설정을 함께 켜세요.

### 3-3. 보안 규칙 적용하기

**Firestore Database → 규칙** 탭에 이 저장소의 [`firestore.rules`](firestore.rules) 내용을 붙여넣고 게시합니다.
로그인 없이 방 코드로만 참여하는 구조라서, `rooms` 컬렉션만 열어두고 나머지는 전부 막습니다.

### 3-4. 승인된 도메인 추가

**Authentication → Settings → 승인된 도메인** 에 GitHub Pages 주소(`<사용자명>.github.io`)를 추가합니다.

### 3-5. 다시 배포

`js/firebase_config.js` 를 수정했다면 커밋 후 push 하세요. 배포가 끝나면 멀티플레이가 켜집니다.

---

## 4. 4~5명이 같이 플레이하는 방법

1. **마스터(GM)** 가 사이트에 접속해 우측 상단 **새 방 만들기** 를 누릅니다 → 6자리 방 코드가 생성됩니다.
2. **링크 복사** 버튼으로 `...?room=ABC123` 형태의 주소를 복사해 플레이어들에게 공유합니다.
3. 플레이어는 그 링크로 접속하면 **자동으로 같은 방에 참여**합니다. (또는 방 코드를 직접 입력)
4. 상단 표시가 `● 실시간 동기화 중` 으로 바뀌면 연결된 상태입니다.
5. 마스터는 **마스터로 접속**, 플레이어는 **플레이어로 접속** 을 누릅니다.
   화면 모드·접속 권한·선택한 캐릭터는 **각자 따로** 유지되고, 게임 데이터만 공유됩니다.

### 마스터 비밀번호

마스터 화면 상단에서 비밀번호를 설정하면, 이후 **마스터로 접속** 시 비밀번호를 묻습니다.
플레이어가 실수로 마스터 설정을 건드리는 것을 막는 용도입니다.

---

## 5. 알아두면 좋은 제약

| 항목 | 내용 |
| --- | --- |
| 문서 크기 | Firestore 문서 1개는 최대 **1MB** 입니다. 초상화·맵 이미지는 base64로 저장되므로 큰 이미지를 여러 장 올리면 한도를 넘습니다. 900KB를 넘으면 콘솔과 알림으로 경고합니다. |
| 이미지 권장 크기 | 초상화는 300×300 이하, 맵 이미지는 1280px 이하로 줄여서 올리세요. |
| 동시 편집 | 마지막에 저장한 사람의 데이터가 전체를 덮어씁니다. 같은 항목을 동시에 수정하지 마세요. |
| 백업 | 마스터 화면의 **백업 내보내기 / 백업 불러오기** 로 JSON 파일 저장·복원이 가능합니다. |
| 브라우저 | 최신 Chrome / Edge / Safari 기준입니다. ES Modules와 `structuredClone`을 사용합니다. |

---

## 6. 폴더 구조

```
index.html                 화면 마크업 전체
style.css                  스타일
firestore.rules            Firestore 보안 규칙 (콘솔에 붙여넣기)
.github/workflows/pages.yml GitHub Pages 자동 배포
js/
  init.js                  진입점 (DOMContentLoaded)
  constants_data.js        상수 · 기본 데이터 · 공용 상태
  main.js                  초기화 / 저장 / 로드 / 데이터 정규화
  events.js                이벤트 바인딩
  core_ui.js               data-action 클릭 위임 처리
  rendering.js             전체 렌더링 · 맵 · 장면
  crud.js                  캐릭터 / NPC / 보스 / 장비 / 아이템
  creation.js              캐릭터 생성 · 상점 · 대장간 · 로그
  combat.js                판정 · 전투 · 턴 · 보상 · 세이브 슬롯
  advanced.js              컷신 · 저주 · 던전 · 엔딩 등 확장 시스템
  sync.js                  Firebase 실시간 동기화
  firebase_config.js       Firebase 키 (직접 채워 넣기)
```
