import {IMatch} from 'interfaces/i-match';
import {ITeam} from 'interfaces/i-team';
import {IPoint} from 'interfaces/i-point';
import TeamView from 'views/team-view';

/**
 * ChampionView displays the results of the championship game
 */
export default class ChampionView {

  /**
   * X position of the view
   */
  public x: number;

  /**
   * Y position of the view
   */
  public y: number;

  /**
   * Width of the view
   */
  public width: number;

  /**
   * height of the view
   */
  public height: number = 1;

  /**
   * Rendering context
   */
  private ctx: CanvasRenderingContext2D;

  /**
   * Championship match
   */
  private _match: IMatch;
  get match(): IMatch {
    return this._match;
  }
  set match(value: IMatch) {
    if (value !== this._match) {
      this._match = value;
      this._match.on('change', () => {
        this.clear();
        this.draw(this.ctx);
      });
    }
  }

  /**
   * clear the view
   */
  public clear(): void {
    this.ctx.clearRect(this.x, this.y, this.width, this.y + this.height);
  }

  /**
   * Draw the view
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    let x: number = this.x;
    let y: number = this.y;
    let width: number = this.width;
    let height: number = this.height;
    let fontSize: number = 12;

    this.ctx = ctx;
    ctx.font = `${fontSize}px sans-serif`;

    if (this.match.victor) {
      let team0: TeamView = new TeamView(this.match.victor, width - 5);
      team0.x = x + 5;
      team0.y = y + fontSize;
      team0.draw(ctx);
    }

    y += fontSize + 2;
    ctx.strokeStyle = "rgba(100, 100, 100, 1)";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
  }
}