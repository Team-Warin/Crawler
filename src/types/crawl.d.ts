export type UpdateDays = (
  | 'sun'
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'finished'
  | 'naverDaily'
)[];

type Singularity = ('over15' | 'free' | 'waitFree')[];

export interface WebToon {
  type: 'webtoon';
  mediaId: string;
  title: string;
  author: string;
  summary: string;
  genre: string[];
  rate?: number;
  url: string;
  img?: string | null;
  backdropImg?: string | null;
  service: 'naver' | 'kakao';
  updateDays: UpdateDays;
  additional: {
    new: boolean;
    adult: boolean;
    rest: boolean;
    up: boolean;
    singularityList: Singularity;
  };
}
