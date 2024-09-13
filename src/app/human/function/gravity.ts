import Konva from 'konva';
import * as Const from '../../constants/human.constants';
import { Limbs } from './limbs';

export class Gravity {
  private static speed: Record<string, number> = {
    leftHand: 0,
    rightHand: 0,
    leftLeg: 0,
    rightLeg: 0,
  };
  private static isStart: Record<string, boolean> = {
    leftHand: false,
    rightHand: false,
    leftLeg: false,
    rightLeg: false,
  };

  static startGravity(layer: Konva.Layer) {
    const limbs = layer.find('.limb') as Konva.Group[];

    const limbsAnim: { anim: Konva.Animation; limb: Konva.Group }[] = [];

    limbsAnim.push(
      ...limbs.map((limb) => {
        return Gravity.animLimb(layer, limb);
      })
    );

    layer.on('dragstart.changePositions', (e) => {
      if (e.target instanceof Konva.Circle) return;

      layer.on('dragmove.changePositions', (e) => {
        const moveX = e.evt.movementX;
        const moveY = e.evt.movementY;

        limbsAnim.forEach((elem) => {
          Gravity.stopAnim(elem);
        });

        limbsAnim.forEach((elem) => {
          elem.anim.start();
          if (moveX < 3 && moveX > -3 && moveY < 3 && moveY > -3) {
            elem.anim.frame.time = 400;
          }
        });

        limbs.forEach((limb) => {
          Gravity.dragLimb(limb, moveX / 2, moveY / 2);
        });
      });

      layer.on('dragend.changePositions', () => {
        layer.off('dragmove.changePositions');
        layer.off('dragend.changePositions');
      });
    });

    return limbsAnim;
  }

  private static animLimb(layer: Konva.Layer, limb: Konva.Group) {
    const g = 9.80665;
    const speedChangeFreq = 200;
    const renderingFreq = 50;

    const nameLimb = limb.id() + '';
    Gravity.isStart[nameLimb] = false;

    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      if (!Gravity.isStart[nameLimb]) {
        frame.time = 0;
        Gravity.speed[nameLimb] = 0;
        Gravity.isStart[nameLimb] = true;
      }

      const time =
        (Math.round(frame.time / renderingFreq) * renderingFreq * 100) / 100;

      if (time % speedChangeFreq === 0) {
        Gravity.speed[nameLimb] = (frame.time / 150) * g;
      }

      if (time % renderingFreq === 0) {
        const isHand = (limb.attrs.id as string).endsWith('Hand');
        const limbIsEnd = Gravity.movieLimb(
          limb,
          Gravity.speed[nameLimb],
          isHand
        );

        if (limbIsEnd) {
          console.log('end');
          Gravity.isStart[nameLimb] = false;
          anim.stop();
        }
      }
    }, layer);

    limb.on('dragstart.event1', () => {
      Gravity.stopAnim({ anim, limb });

      limb.on('dragend.event1', () => {
        anim.start();
        limb.off('dragend.event1');
      });
    });

    anim.start();

    return { anim, limb };
  }

  private static movieLimb(
    limb: Konva.Group,
    speed: number,
    isHand: boolean,
    moveX = 0,
    moveY = 0
  ) {
    const line = limb.findOne('#line') as Konva.Line;
    const circle1 = limb.findOne('#circle1') as Konva.Circle;
    const circle2 = limb.findOne('#circle2') as Konva.Circle;
    const maxLength1 = isHand ? Const.HAND_LENGTH : Const.LEG_LENGTH;
    const maxLength2 = isHand ? Const.WRIST_LENGTH : Const.FOOT_LENGTH;

    const startYCircle1 = circle1.y();
    const startYCircle2 = circle2.y();

    circle1.y(circle1.y() + speed - moveY);
    circle1.x(circle1.x() - moveX);

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

    circle2.y(circle2.y() + speed - moveY);
    circle2.x(circle2.x() - moveX);

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

  private static dragLimb(limb: Konva.Group, moveX: number, moveY: number) {
    const nameLimb = limb.id() + '';
    const isHand = (limb.attrs.id as string).endsWith('Hand');

    Gravity.movieLimb(limb, Gravity.speed[nameLimb], isHand, moveX, moveY);

    Gravity.speed[nameLimb] -= moveY;
  }

  private static stopAnim(elem: { anim: Konva.Animation; limb: Konva.Group }) {
    elem.anim.stop();
    const nameLimb = elem.limb.id() as string;

    Gravity.isStart[nameLimb] = false;
  }
}
