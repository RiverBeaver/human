import Konva from 'konva';
import * as Const from '../../constants/human.constants';
import { Nimbus } from './nimbus';
import { Limbs } from './limbs';

export class Gravity {
  static startGravity(layer: Konva.Layer) {
    const limbs = layer.find('.limb') as Konva.Group[];
    console.log(limbs);
    const leftHand = layer.findOne('#leftHand') as Konva.Group;
    const rightHand = layer.findOne('#rightHand') as Konva.Group;
    const leftLeg = layer.findOne('#leftLeg') as Konva.Group;
    const rightLeg = layer.findOne('#rightLeg') as Konva.Group;

    let speed = 0;
    const g = 9.80665;
    let isStart = false;

    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      if (!isStart) {
        frame.time = 0;
        isStart = true;
      }

      const time = (Math.round(frame.time / 10) * 1000) / 100;

      if (time % 100 === 0) {
        speed = (frame.time / 50) * g;
      }

      if (time % 20 === 0) {
        const leftHandIsEnd = Gravity.movieLimb(leftHand, speed, true);
        const rightHandIsEnd = Gravity.movieLimb(rightHand, speed, true);
        const leftLegIsEnd = Gravity.movieLimb(leftLeg, speed, false);
        const rightLegIsEnd = Gravity.movieLimb(rightLeg, speed, false);

        if (leftHandIsEnd && rightHandIsEnd && leftLegIsEnd && rightLegIsEnd) {
          console.log('end');
          speed = 0;
          frame.time = 0;
          anim.stop();
        }
      }
    }, layer);

    anim.start();

    layer.on('dragend', () => anim.start());

    return anim;
  }

  private static movieLimb(limb: Konva.Group, speed: number, isHand: boolean) {
    const line = limb.findOne('#line') as Konva.Line;
    const circle1 = limb.findOne('#circle1') as Konva.Circle;
    const circle2 = limb.findOne('#circle2') as Konva.Circle;
    const maxLength1 = isHand ? Const.HAND_LENGTH : Const.LEG_LENGTH;
    const maxLength2 = isHand ? Const.WRIST_LENGTH : Const.FOOT_LENGTH;

    const startYCircle1 = circle1.y();
    const startYCircle2 = circle2.y();

    circle1.y(circle1.y() + speed);

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

    circle2.y(circle2.y() + speed);

    Limbs.limitationDragFunction(
      circle2,
      circle1.x(),
      circle1.y(),
      maxLength2,
      true
    );
    Limbs.updateLine(line, circle1, circle2);

    if (
      startYCircle1 === circle1.y() &&
      startYCircle2 === circle2.y() &&
      speed != 0
    ) {
      return true;
    } else {
      return false;
    }
  }
}
