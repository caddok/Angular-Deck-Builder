import { MinionType } from '../interfaces/api-responses/minion-types';

export class Card {

  constructor(
    public manaCost: number,
    public name: string,
    public image: string,
    public imageCrop: string,
    public isLegendary: boolean,
    public text: string,
    public type: MinionType,
    public id: number,
    public count?: number,
    public maxCount?: number,
    public isAdded?: boolean) { }
}
