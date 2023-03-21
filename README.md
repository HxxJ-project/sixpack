# 최종프로젝트 [Six Pack]

## **프로젝트 소개**

```
💡전국의 운동할 수 있는 시설을(헬스장, 필라테스 등) 중개하는 ‘식스팩‘ 이라는 플랫폼 서비스를 개발
```

## **서비스 기획 배경**

❓ 우리가 제공하고자 하는 ‘식스팩’ 서비스는

내 현재 위치에서 쉽게 운동하러 갈 수 있는 공간을 중개하는 플랫폼입니다.

많은 분들이 공감하실 텐데 여행이나 출장 등 타 지역에 갔을 때 헬스장 당일권 외에는 운동할 수단이 마땅치 않습니다. 운동은 하고 싶지만 당일권을 사기엔 부담이 됩니다. ‘식스팩’은 이러한 고민을 완전히 해소해 줍니다.

그리고 내 활동 반경 안에 여러 개의 헬스장을 이용할 수 있다는 건 생각보다 굉장한 만족감과 편안함을 줍니다. 식스팩은 전국 각지에 있는 하이 퀄리티 체육관들과 제휴하고 있고, 구독만 한다면 당신이 어디에 있든 당신과 가장 가까운 체육관에 가서 운동할 수 있습니다.

또한 우리 동네 어느 체육관을 다녀야 할지 고민된다면 주저 말고 한 달만 구독해보세요!

직접 가서 체험해보시고 선택해도 늦지 않습니다.

게다가 전국 헬스장 어디와 비교해도 합리적인 가격대를 자랑합니다.

지금 당장 신청해 보세요!

### **서비스 기획 아이데이션**

<img src=./public/images/ideation.png>

<br>

### ✨프로젝트 핵심 기능

| 기능                  | 기술 스택 (내용)                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 로그인, 로그아웃      | JWT(AccessToken, RefreshToken), Redis                                                                                             |
| 회원가입              | 로컬로그인, 소셜로그인(카카오)                                                                                                    |
| 유저정보 CRUD         | 일반회원 마이페이지                                                                                                               |
| 가맹점 회원 정보 CRUD | 사업자회원 정보                                                                                                                   |
| 피드 CRUD             | 피드 조회. 작성, 수정, 삭제 / 피드 댓글 조회, 작성,삭제                                                                           |
| 가맹점 등록 CRUD      | 가맹점 조회, 등록, 수정, 삭제                                                                                                     |
| 지도 연동             | 카카오 맵 연동                                                                                                                    |
| 리뷰 CRUD             | 리뷰 조회, 작성, 수정, 삭제                                                                                                       |
| 구독 결제             | 결제, 결제 상태, 스케줄링, 빌링키 사용 자동결제, 멤버십 별 권한 부여                                                              |
| QR코드                | QR코드로 입장처리                                                                                                                 |
| 돈 정산하기           | 한 달 단위로 돈 정산                                                                                                              |
| 페이지네이션          | 무한 스크롤                                                                                                                       |
| 어드민 페이지         | 멤버십 별 현 회원 안내, 제휴 업종별 가맹점 안내, 카테고리별 가맹점 순위 리스트, 월별 순위표, 월별 매출, 누적매출, 제휴가맹점 승인 |

<br>

### 📌역할분담

- **한정훈(팀장)**
  - 기획
  - 디자인
  - 구독결제
  - 어드민 페이지 가맹점순위 카테고리
  - 가맹점 별 월 정산 로직
- **김승일(부팀장)**
  - 로그인, 로그아웃
  - 회원가입
  - Cache-aside-pattern 적용
  - Elasticsearch 적용
  - 리뷰 CRUD
  - 카카오 맵 API 연동
- **이효원**
  - 페이지 별 테스트
  - 문서작업
- **정호준**
  - QR-code 입장처리
  - 체육관 CRUD
  - 피드 & 댓글 CRUD
  - 카카오 맵 API 연동
  - 무한 스크롤
- **주현진**
  - 유저정보 CRUD
  - 업체 회원 정보 CRUD
  - 수정/삭제 유저 검증

<br>

### ✅Swagger

- [Swagger-openAPI](https://www.sixpack.pro/api)

<br>

### 👨‍💻기술 스택

<div align="center">
  <p style="font-size:20px;">📚Tech Stack📚</p>
  <p>⭐ Platforms & Languages ⭐</p>
	<img src="https://img.shields.io/badge/EJS-000000?style=flat&logo=EJS&logoColor=white" />
	<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=CSS3&logoColor=white" />
	<img src="https://img.shields.io/badge/JavaScript-f7df1e?style=flat&logo=JavaScript&logoColor=white" />
	<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white" />
	<img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=Axios&5A29E4=white" />
	<img src="https://img.shields.io/badge/jQuery-0769ad?style=flat&logo=jQuery&logoColor=white" />
	<img src="https://img.shields.io/badge/.env-ecd53f?style=flat&logo=.env&logoColor=white" />
  <br/>
	<img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white" />
	<img src="https://img.shields.io/badge/MySQL-4479a1?style=flat&logo=.env&logoColor=white" />
	<img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=NestJS&logoColor=white" />
	<img src="https://img.shields.io/badge/JSON-000000?style=flat&logo=JSON&logoColor=white" />
	<img src="https://img.shields.io/badge/Elasticsearch-005571?style=flat&logo=Elasticsearch&4a154b=white" />
	<img src="https://img.shields.io/badge/TypeORM-010101?style=flat&logo=TypeORM&logoColor=white" />
	<img src="https://img.shields.io/badge/Redis-DC382D?style=flat&logo=Redis&4a154b=white" />
  <br/>
  <br/>
  <p>♻ AWS ♻</p>
	<img src="https://img.shields.io/badge/Amazon-S3-569A31?style=flat&logo=Amazon-S3&4a154b=white" />
	<img src="https://img.shields.io/badge/Amazon-EC2-FF9900?style=flat&logo=Amazon-EC2&4a154b=white" />
	<img src="https://img.shields.io/badge/Amazon-RDS-527FFF?style=flat&logo=Amazon-RDS&4a154b=white" />
  <br/>
  <br/>
  <p>🛠 Tools 🛠</p>
	<img src="https://img.shields.io/badge/Visual Studio Code-007acc?style=flat&logo=Visual Studio Code&logoColor=white" />
	<img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=GitHub&181717=white" />
	<img src="https://img.shields.io/badge/slack-4a154b?style=flat&logo=slack&4a154b=white" />
	<img src="https://img.shields.io/badge/Notion-000000?style=flat&logo=Notion&4a154b=white" />
</div>
<br>

### 🗂️폴더 구조

```
📦public
 ┣ 📂css
 ┣ 📂images
 ┗ 📂js
 📦src
 ┣ 📂domain
 ┃ ┣ 📂admin
 ┃ ┃ ┗ 📂dto
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┣ 📂guard
 ┃ ┃ ┣ 📂strategy
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┗ 📂__test__
 ┃ ┣ 📂business-user
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┗ 📂__test__
 ┃ ┣ 📂feed
 ┃ ┃ ┗ 📂dto
 ┃ ┣ 📂gym
 ┃ ┃ ┗ 📂dto
 ┃ ┣ 📂payment
 ┃ ┃ ┗ 📂dto
 ┃ ┣ 📂qrcode
 ┃ ┃ ┗ 📂__test__
 ┃ ┣ 📂review
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┗ 📂__test__
 ┃ ┗ 📂user
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┗ 📂__test__
 ┗ 📂global
   ┣ 📂common
   ┃ ┣ 📂decorator
   ┃ ┣ 📂interceptor
   ┃ ┗ 📂utils
   ┣ 📂config
   ┣ 📂entities
   ┃ ┗ 📂common
   ┣ 📂exception
   ┣ 📂logger
   ┣ 📂swagger
   ┗ 📂util
📦test
📦views
 ┣ 📂admin
 ┣ 📂auth
 ┣ 📂components
 ┣ 📂feeds
 ┣ 📂gym
 ┣ 📂main
 ┣ 📂mypage
 ┗ 📂review

```

<br>

### 🖼️ERD

<img src="./public/images/erd.png" style="width:100%" />

<br />

### 🖼️API

[API 명세서 링크](https://www.notion.so/API-f10d0029614e4b68bc74fb133560245d)

## 😊프로젝트 시작 방법

이 섹션에서는 프로젝트 시작 방법에 대해서 설명합니다

### 패키지 설치

```
npm install
```

### 환경설정 구성

```
PORT=3000
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=sixpack
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=7d
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
KAKAO_CALLBACK_URL=http://sixpack.pro/api/auth/login/kakao/callback
KAKAO_MAP_KEY=
REDIS_URL=redis://localhost:6379
IMP_CODE=imp52616317
IMP_REST_API_KEY=
IMP_REST_API_SECRET_KEY=
AWS_BUCKET_REGION=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
SIXPACK_URL=http://sixpack.pro
```

### NestJS 앱 실행

```
npm run start
```
