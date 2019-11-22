export interface CardApiResponse {
  artistName: string;
  cardSetId: number;
  cardTypeId: number;
  classId: number;
  collectible: number;
  minionTypeId: number;
  cropImage: string;
  flavorText: {
    de_DE: string;
    en_US: string;
    es_ES: string;
    es_MX: string;
    fr_FR: string;
    it_IT: string;
    ja_JP: string;
    ko_KR: string;
    pl_PL: string;
    pt_BR: string;
    ru_RU: string;
    th_TH: string;
    zh_CH: string;
    zh_TW: string;
  };
  id: number;
  image: {
    de_DE: string;
    en_US: string;
    es_ES: string;
    es_MX: string;
    fr_FR: string;
    it_IT: string;
    ja_JP: string;
    ko_KR: string;
    pl_PL: string;
    pt_BR: string;
    ru_RU: string;
    th_TH: string;
    zh_CH: string;
    zh_TW: string;
  };
  manaCost: number;
  multiClassIds: [];
  name: {
    de_DE: string;
    en_US: string;
    es_ES: string;
    es_MX: string;
    fr_FR: string;
    it_IT: string;
    ja_JP: string;
    ko_KR: string;
    pl_PL: string;
    pt_BR: string;
    ru_RU: string;
    th_TH: string;
    zh_CH: string;
    zh_TW: string;
  };
  rarityId: number;
  text: {
    de_DE: string;
    en_US: string;
    es_ES: string;
    es_MX: string;
    fr_FR: string;
    it_IT: string;
    ja_JP: string;
    ko_KR: string;
    pl_PL: string;
    pt_BR: string;
    ru_RU: string;
    th_TH: string;
    zh_CH: string;
    zh_TW: string;
  };
}
