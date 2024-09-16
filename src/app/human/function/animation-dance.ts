import Konva from 'konva';
import { Limbs } from './limbs';
import * as Const from '../../constants/human.constants';

export function animationDance(layer: Konva.Layer) {
  const leftHand = layer.findOne('#leftHand') as Konva.Group;
  const leftHandLine = leftHand.findOne('#line');
  const leftHandCircle1 = leftHand.findOne('#circle1');
  const leftHandCircle2 = leftHand.findOne('#circle2');

  const rightHand = layer.findOne('#rightHand') as Konva.Group;
  const rightHandLine = rightHand.findOne('#line');
  const rightHandCircle1 = rightHand.findOne('#circle1');
  const rightHandCircle2 = rightHand.findOne('#circle2');

  // const leftLeg = layer.findOne('#leftLeg') as Konva.Group;
  // const leftLegLine = leftLeg.findOne('#line');
  // const leftLegCircle1 = leftLeg.findOne('#circle1');
  // const leftLegCircle2 = leftLeg.findOne('#circle2');

  // const rightLeg = layer.findOne('#rightLeg') as Konva.Group;
  // const rightLegLine = rightLeg.findOne('#line');
  // const rightLegCircle1 = rightLeg.findOne('#circle1');
  // const rightLegCircle2 = rightLeg.findOne('#circle2');

  const amplitude = Const.WRIST_LENGTH;
  const period = 1000;

  const animDance = new Konva.Animation((frame) => {
    if (!frame?.frameRate && frame != undefined) console.log('stop');

    if (rightHandCircle2 && rightHandCircle1 && frame) {
      rightHandCircle2.x(
        amplitude * -Math.cos((frame.time * 2 * Math.PI) / -period) +
          rightHandCircle1.x()
      );
      rightHandCircle2.y(
        amplitude * Math.sin((frame.time * 2 * Math.PI) / -period) +
          rightHandCircle1.y()
      );

      Limbs.limitationDragFunction(
        rightHandCircle2 as Konva.Circle,
        rightHandCircle1.x(),
        rightHandCircle1.y(),
        Const.WRIST_LENGTH
      );
      Limbs.updateLine(
        rightHandLine as Konva.Line,
        rightHandCircle1 as Konva.Circle,
        rightHandCircle2 as Konva.Circle
      );
    }

    if (leftHandCircle2 && leftHandCircle1 && frame) {
      leftHandCircle2.x(
        amplitude * Math.cos((frame.time * 2 * Math.PI) / period) +
          leftHandCircle1.x()
      );
      leftHandCircle2.y(
        amplitude * Math.sin((frame.time * 2 * Math.PI) / period) +
          leftHandCircle1.y()
      );

      Limbs.limitationDragFunction(
        leftHandCircle2 as Konva.Circle,
        leftHandCircle1.x(),
        leftHandCircle1.y(),
        Const.WRIST_LENGTH
      );
      Limbs.updateLine(
        leftHandLine as Konva.Line,
        leftHandCircle1 as Konva.Circle,
        leftHandCircle2 as Konva.Circle
      );
    }
  }, layer);

  return animDance;
}
