export interface MarketCode {
  all: string;
  equipmentBoxAll: number;
  avatarWeapon: number;
  avatarHead: number;
  avatarFace1: number;
  avatarFace2: number;
  avatarTop: number;
  avatarBottom: number;
  avatarSet: number;
  avatarInstrument: number;
  avatarBox: number;
  avatarMoveEffect: number;
  avatarAll: number;
  relicAll: number;
  reinforce: number;
  reinforceAdd: number;
  reinforceEtc: number;
  reinforceWeaponEvo: number;
  reinforceAll: number;
  battleItemHeal: number;
  battleItemAttack: number;
  battleItemFunction: number;
  battleItemBuff: number;
  battleItemAll: number;
  foodAll: number;
  lifePlant: number;
  lifeLumber: number;
  lifeMine: number;
  lifeHunt: number;
  lifeFish: number;
  lifeArchaeology: number;
  lifeEtc: number;
  lifeAll: number;
  adventureBook: number;
  sailingMaterial: number;
  sailingSkin: number;
  sailingMaterialBox: number;
  sailingAll: number;
  pet: number;
  petBox: number;
  petAll: number;
  mount: number;
  mountBox: number;
  mountAll: number;
  etc: number;
  gem: number;
  gemBox: number;
}
export interface Gemstone {
  grade: string;
  name: string;
  levels: number[];
}
export interface ExceptedRelic {
  itemName: string;
  itemIcon: string;
  itemCurrentMinPrice: number;
}
