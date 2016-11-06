import {ITeam} from 'interfaces/i-team';
import {PendingTeam} from 'models/team';

/**
 * TeamView draws the view for a team
 */
export default class TeamView {

  /**
   * Model for view
   */
  public team: ITeam;

  /**
   * Maximum width the view can be
   */
  public maxWidth: number;

  /**
   * X position of the view
   */
  public x: number = 0;

  /**
   * Y position of the view
   */
  public y: number = 0;

  constructor(team?: ITeam, maxWidth?: number) {
    this.team = team;
    this.maxWidth = maxWidth;
  }

  /**
   * Draw team name to canvas
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.team instanceof PendingTeam) {
      ctx.fillStyle = '#BFBFBF';
    }
    else {
      ctx.fillStyle = '#000000';
    }
    ctx.fillText(this.team.name, this.x, this.y, this.maxWidth);
  }
}