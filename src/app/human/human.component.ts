import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import * as Const from '../constants/human.constants';
import { newLimb, limitationDragFunction, updateLine } from './function/limbs';
import { animationNimbus, getNimbus, zIndexAnimation } from './function/nimbus';
import { Shape, ShapeConfig } from 'konva/lib/Shape';

@Component({
  selector: 'app-human',
  standalone: true,
  imports: [],
  templateUrl: './human.component.html',
  styleUrl: './human.component.scss',
})
export class HumanComponent implements OnInit {
  stage!: Konva.Stage;

  layer!: Konva.Layer;

  head!: Konva.Circle;
  nimbus!: Shape<ShapeConfig>[];

  body!: Konva.Line;
  pelvis!: Konva.Line;

  leftHand?: Konva.Group;
  rightHand?: Konva.Group;
  leftLeg?: Konva.Group;
  rightLeg?: Konva.Group;

  animDance?: Konva.Animation;

  ngOnInit(): void {
    this.viewHuman();
  }

  viewHuman() {
    this.stage = new Konva.Stage({
      container: 'human',
      width: Const.WIDTH,
      height: Const.HIGHT,
    });

    this.layer = new Konva.Layer();

    const group = new Konva.Group({
      x: Const.X_CENTER,
      y: Const.Y_HEAD,
    });

    this.head = new Konva.Circle({
      radius: Const.RADIUS_HEAD,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 3,
    });

    this.nimbus = getNimbus();

    group.add(this.head);
    group.add(...this.nimbus);

    this.body = new Konva.Line({
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

    this.pelvis = new Konva.Line({
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
      draggable: true,
    });

    this.leftHand = newLimb(true, true);
    this.rightHand = newLimb(false, true);
    this.leftLeg = newLimb(true, false);
    this.rightLeg = newLimb(false, false);
    this.ChangeCursor();

    this.layer.add(group);
    this.layer.add(this.body);
    this.layer.add(this.pelvis);
    this.layer.add(this.leftHand);
    this.layer.add(this.rightHand);
    this.layer.add(this.leftLeg);
    this.layer.add(this.rightLeg);

    this.stage.add(this.layer);
    this.layer.draw();
    this.animationDance();

    const arrayCircles = this.stage.find('.nimbus');
    this.head.setZIndex(zIndexAnimation(arrayCircles as Konva.Circle[]));
    animationNimbus(this.layer, arrayCircles as Konva.Circle[]);
  }

  animationDance() {
    const leftHandLine = this.layer.findOne('#leftHandLine');
    const leftHandCircle1 = this.layer.findOne('#leftHandCircle1');
    const leftHandCircle2 = this.layer.findOne('#leftHandCircle2');
    const rightHandLine = this.layer.findOne('#rightHandLine');
    const rightHandCircle1 = this.layer.findOne('#rightHandCircle1');
    const rightHandCircle2 = this.layer.findOne('#rightHandCircle2');
    const leftLegLine = this.layer.findOne('#leftLegLine');
    const leftLegCircle1 = this.layer.findOne('#leftLegCircle1');
    const leftLegCircle2 = this.layer.findOne('#leftLegCircle2');
    const rightLegLine = this.layer.findOne('#rightLegLine');
    const rightLegCircle1 = this.layer.findOne('#rightLegCircle1');
    const rightLegCircle2 = this.layer.findOne('#rightLegCircle2');

    const amplitude = Const.WRIST_LENGTH;
    const period = 1000;

    this.animDance = new Konva.Animation((frame) => {
      if (rightHandCircle2 && rightHandCircle1 && frame) {
        rightHandCircle2.x(
          amplitude * -Math.cos((frame.time * 2 * Math.PI) / -period) +
            rightHandCircle1.x()
        );
        rightHandCircle2.y(
          amplitude * Math.sin((frame.time * 2 * Math.PI) / -period) +
            rightHandCircle1.y()
        );

        limitationDragFunction(
          rightHandCircle2 as Konva.Circle,
          rightHandCircle1.x(),
          rightHandCircle1.y(),
          Const.WRIST_LENGTH
        );
        updateLine(
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

        limitationDragFunction(
          leftHandCircle2 as Konva.Circle,
          leftHandCircle1.x(),
          leftHandCircle1.y(),
          Const.WRIST_LENGTH
        );
        updateLine(
          leftHandLine as Konva.Line,
          leftHandCircle1 as Konva.Circle,
          leftHandCircle2 as Konva.Circle
        );
      }
    }, this.layer);
  }

  startDance() {
    this.animDance?.start();
  }

  stopDance() {
    this.animDance?.stop();
  }

  private ChangeCursor() {
    const array = [this.leftHand, this.rightHand, this.leftLeg, this.rightLeg];
    let stage = this.stage;
    for (let group of array) {
      if (group?.children) {
        for (let elem of group.children) {
          if (elem instanceof Konva.Circle) {
            elem.on('mouseenter', function () {
              stage.container().style.cursor = 'pointer';
            });

            elem.on('mouseleave', function () {
              stage.container().style.cursor = 'default';
            });
          }
        }
      }
    }
  }
}
