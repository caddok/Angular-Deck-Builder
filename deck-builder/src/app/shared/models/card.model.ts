export class Card {

  constructor(
    public manaCost: number,
    public name: string,
    public image: string,
    public imageCrop: string,
    public isLegendary: boolean,
    public count?: number,
    public maxCount?: number,
    public isAdded?: boolean) { }
}
