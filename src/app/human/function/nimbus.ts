import Konva from 'konva';
import * as Const from '../../constants/human.constants';
import { Shape, ShapeConfig } from 'konva/lib/Shape';

const dimeterHead = Const.RADIUS_HEAD * 2;
const height = 8;

export class Nimbus {
  static getNimbus() {
    const nimbus = new Konva.Group({});
    const positions = [];

    for (let i = 5; i < dimeterHead * 2; i += 10) {
      if (i < dimeterHead) {
        positions.push([
          i,
          Math.sin((i * 2 * Math.PI) / dimeterHead / 2) * 16 +
            (dimeterHead / 2) * 0.5,
        ]);
      } else {
        positions.push([
          dimeterHead * 2 - i,
          -Math.sin(((dimeterHead * 2 - i) * 2 * Math.PI) / dimeterHead / 2) *
            16 +
            (dimeterHead / 2) * 0.5,
        ]);
      }
    }

    for (const position of positions) {
      const circle = new Konva.Circle({
        x: position[0] - Const.RADIUS_HEAD,
        y: position[1] - Const.RADIUS_HEAD - height,
        radius: 5,
        name: 'nimbus',
        fill: 'grin',
      });
      nimbus.add(circle);
    }

    return nimbus.children as Shape<ShapeConfig>[];
  }

  static zIndexAnimation(arrayCircles: Konva.Circle[]) {
    let lower = 0;
    let upper = arrayCircles.length;

    for (const circle of arrayCircles) {
      if (circle.y() < (dimeterHead / 2) * 0.5 - Const.RADIUS_HEAD - height) {
        circle.setZIndex(lower);
        lower++;
      } else {
        circle.setZIndex(upper);
        upper--;
      }
    }

    return lower + 1;
  }

  static animationNimbus(layer: Konva.Layer, arrayCircles: Konva.Circle[]) {
    const lengthArray = arrayCircles.length;
    const positions = arrayCircles.map((circle) => [circle.x(), circle.y()]);
    let nextPositions: number[][] = [];

    const frequency = 300;
    const freq = 10;
    let count = 0;
    let start = false;

    const anim = new Konva.Animation((frame) => {
      if (!frame) return;

      let time = (Math.round(frame.time / freq) * freq * 100) / 100;
      if (!start) {
        time = 0;
        start = true;
      }

      if (time % frequency === 0) {
        nextPositions = [];

        for (let i = 0; i < lengthArray; i++) {
          if (i != lengthArray - 1) {
            nextPositions.push([
              positions[(i + count + 1) % lengthArray][0],
              positions[(i + count + 1) % lengthArray][1],
            ]);
          } else {
            nextPositions.push([
              positions[count % lengthArray][0],
              positions[count % lengthArray][1],
            ]);
          }
        }
        count++;
      }

      for (let i = 0; i < lengthArray; i++) {
        let nextI = i - 1;
        if (nextI < 0) {
          nextI = lengthArray - 1;
        }
        const distanceX = nextPositions[i][0] - nextPositions[nextI][0];
        const distanceY = nextPositions[i][1] - nextPositions[nextI][1];

        arrayCircles[i].x(
          nextPositions[nextI][0] + distanceX * ((time % frequency) / frequency)
        );

        arrayCircles[i].y(
          nextPositions[nextI][1] + distanceY * ((time % frequency) / frequency)
        );
      }

      Nimbus.zIndexAnimation(arrayCircles);
    }, layer);

    anim.start();
  }
}
