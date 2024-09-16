import Konva from 'konva';
import * as Const from '../../constants/human.constants';

export class Limbs {
  static newLimb(isLeft: boolean, isHand: boolean) {
    const limb = new Konva.Group({
      name: 'limb',
      id: (isLeft ? 'left' : 'right') + (isHand ? 'Hand' : 'Leg'),
    });
    const sign = isLeft ? 1 : -1;
    let line: Konva.Line;
    let maxLength1: number;
    let maxLength2: number;

    if (isHand) {
      line = Limbs.newHandLine(sign);
      maxLength1 = Const.HAND_LENGTH;
      maxLength2 = Const.WRIST_LENGTH;
    } else {
      line = Limbs.newLegLine(sign);
      maxLength1 = Const.LEG_LENGTH;
      maxLength2 = Const.FOOT_LENGTH;
    }

    const circle1 = Limbs.newCircle(
      line.points()[2],
      line.points()[3],
      isLeft,
      isHand,
      1
    );
    const circle2 = Limbs.newCircle(
      line.points()[4],
      line.points()[5],
      isLeft,
      isHand,
      2
    );

    circle1.on('dragmove', () => {
      Limbs.limitationDragFunction(
        circle1,
        line.points()[0],
        line.points()[1],
        maxLength1,
        true
      );
      Limbs.limitationDragFunction(
        circle2,
        circle1.x(),
        circle1.y(),
        maxLength2,
        true
      );
      Limbs.updateLine(line, circle1, circle2);
    });

    circle2.on('dragmove', () => {
      Limbs.limitationDragFunction(
        circle2,
        circle1.x(),
        circle1.y(),
        maxLength2,
        true
      );
      Limbs.updateLine(line, circle1, circle2);
    });

    limb.add(line);
    limb.add(circle1);
    limb.add(circle2);

    return limb;
  }

  static limitationDragFunction(
    circle: Konva.Circle,
    baseX: number,
    baseY: number,
    maxLength: number,
    isFixedLength: boolean = false
  ) {
    const dx = circle.x() - baseX;
    const dy = circle.y() - baseY;

    const length = Limbs.getLength(dx, dy);

    if (length > maxLength || (isFixedLength && length < maxLength)) {
      const angle = Math.atan2(dy, dx);
      circle.x(baseX + maxLength * Math.cos(angle));
      circle.y(baseY + maxLength * Math.sin(angle));
    } else {
      if (!isFixedLength) {
        circle.radius(
          Const.RADIUS_LITTLE_CIRCLE +
            (maxLength / length < 4 ? maxLength / length : 4)
        );
      }
    }
  }

  static updateLine(
    line: Konva.Line,
    circle1: Konva.Circle,
    circle2: Konva.Circle
  ) {
    const points = [
      line.points()[0],
      line.points()[1],
      circle1.x(),
      circle1.y(),
      circle2.x(),
      circle2.y(),
    ];
    line.points(points);
  }

  private static newHandLine(sign: number): Konva.Line {
    const startX = Const.X_CENTER + (Const.SHOULDER_LENGTH / 2) * sign;

    return new Konva.Line({
      points: [
        startX,
        Const.Y_BODY + Const.NECK_LENGTH,
        startX + Const.HAND_LENGTH * sign,
        Const.Y_BODY + Const.NECK_LENGTH,
        startX + (Const.HAND_LENGTH + Const.WRIST_LENGTH) * sign,
        Const.Y_BODY + Const.NECK_LENGTH,
      ],
      name: sign === 1 ? 'left' : 'right',
      stroke: 'black',
      strokeWidth: 4,
      lineCap: 'round',
      lineJoin: 'round',
      id: 'line',
    });
  }

  private static newLegLine(sign: number) {
    const baseX = Const.X_CENTER + (Const.PELVIS_LENGTH / 2) * sign;
    const baseY = Const.Y_BODY + Const.BODY_LENGTH;
    return new Konva.Line({
      points: [
        baseX,
        baseY,
        baseX,
        baseY + Const.LEG_LENGTH,
        baseX,
        baseY + Const.LEG_LENGTH + Const.FOOT_LENGTH,
      ],
      name: sign === 1 ? 'left' : 'right',
      stroke: 'black',
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
      id: 'line',
    });
  }

  private static newCircle(
    x: number,
    y: number,
    isLeft: boolean,
    isHand: boolean,
    number: number
  ): Konva.Circle {
    return new Konva.Circle({
      x: x,
      y: y,
      radius: Const.RADIUS_LITTLE_CIRCLE,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 3,
      draggable: true,
      id: 'circle' + number,
    });
  }

  private static getLength(dx: number, dy: number) {
    return Math.sqrt(dx ** 2 + dy ** 2);
  }
}
