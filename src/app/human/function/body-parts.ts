import Konva from 'konva';
import * as Const from '../../constants/human.constants';

export class BodyParts {
  static getHead(): Konva.Circle {
    return new Konva.Circle({
      radius: Const.RADIUS_HEAD,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 3,
      name: 'head',
    });
  }

  static getBody(): Konva.Line {
    return new Konva.Line({
      points: [
        Const.X_CENTER,
        Const.Y_BODY,
        Const.X_CENTER,
        Const.Y_BODY + Const.BODY_LENGTH,
      ],
      stroke: 'black',
      strokeWidth: 6,
      lineCap: 'butt',
      lineJoin: 'round',
    });
  }

  static getShoulder(): Konva.Line {
    return new Konva.Line({
      points: [
        Const.X_CENTER - Const.SHOULDER_LENGTH / 2,
        Const.Y_BODY + Const.NECK_LENGTH,
        Const.X_CENTER + Const.SHOULDER_LENGTH / 2,
        Const.Y_BODY + Const.NECK_LENGTH,
      ],
      stroke: 'black',
      strokeWidth: 4,
      lineCap: 'round',
      lineJoin: 'round',
    });
  }

  static getPelvis(): Konva.Line {
    return new Konva.Line({
      points: [
        Const.X_CENTER - Const.PELVIS_LENGTH / 2,
        Const.Y_BODY + Const.BODY_LENGTH,
        Const.X_CENTER + Const.PELVIS_LENGTH / 2,
        Const.Y_BODY + Const.BODY_LENGTH,
      ],
      stroke: 'black',
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
    });
  }
}
