<h1 align="center">
  <div>
    <img src="https://raw.githubusercontent.com/TodayWantLook/TWL-NextJS/a32f3cd37794bf49c0c47c7434a861d2fec8a857/public/Logo.svg" width=70/>
  </div>
  WebToon Crawler
  <br>
  <sub><sup><b>(crawler)</b></sup></sub>
  <br>
</h1>

<p align="center">
  <b>TodayWantLook</b>서비스에 사용된 <b>WebToon Cralwer</b> 입니다.</br><a herf="https://github.com/HyeokjaeLee/korea-webtoon-api">korea-webtoon-api</a> 을 참고하여 제작되었습니다.
</p>

## Usage

```dosini
//env.local

SUPABASE_URL = SUPABASE_URL
SUPABASE_ROLE_KEY = SUPABASE_ROLE_KEY

NAVER_NID_AUT = NID_AUT
NAVER_NID_SES = NID_SES
```

```bash
bun i
```

```bash
bun .
```

## Features

- **Puppeteer**

  **puppeteer**를 사용하여 웹툰의 `장르`, `줄거리`, `포스터`, `백드롭 이미지`를 가져와 저장합니다.

- **Avif Format**

  **sharp** 모듈을 사용하여 웹툰에서 불러온 사진을 `.avif` 또는 `.webp` 로 포멧 합니다.

## Developer

<b>명지전문대 AI·빅데이터</b>과 <b>캡스톤 디자인 6조</b> 그리고 <b>킹고바이오 대표</b>님의 멘토링 및 도움으로 만들어진 작품입니다.

|    이름    |                                                       역할                                                       |
| :--------: | :--------------------------------------------------------------------------------------------------------------: |
| **INIRU**  | `Leader`, `Main Developer`, `Front-End`, `Back-End`, `DataBase`, `Collaborative Filtering`, `Git Project Leader` |
| **KIMMJ**  |                  `UI/UX Design`, `UI/UX Developer`, `Idea`, `Logo Design`, `DataBase ER Model`                   |
| **HYUNW**  |                           `Server Developer`, `QA Tester`, `Media API`, `Social Login`                           |
| **이준엽** |                                                   `Mentoring`                                                    |

## 라이센스

이 앱은 <a href="https://github.com/INIRU/TodayWantLook/Crawler/blob/main/LICENSE" target="_blank">MIT 라이센스</a> 조건에 따라 라이센스가 부여됩니다. <br>
자세한 내용은 [LICENSE](LICENSE)를 참고하십시오.

## Credits

- 캡스톤 디자인 6조 - Warin
