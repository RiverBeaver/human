import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import * as Const from '../constants/human.constants';
import { newLimb } from './function/addLimbs';

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
  body!: Konva.Line;
  pelvis!: Konva.Line;

  leftHand?: Konva.Group;
  rightHand?: Konva.Group;
  leftLeg?: Konva.Group;
  rightLeg?: Konva.Group;

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

    this.head = new Konva.Circle({
      x: Const.X_CENTER,
      y: Const.Y_HEAD,
      radius: Const.RADIUS_HEAD,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 3,
    });

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
    console.log(this.body.points()[1]);

    this.leftHand = newLimb(true, true);
    this.rightHand = newLimb(false, true);
    this.leftLeg = newLimb(true, false);
    this.rightLeg = newLimb(false, false);
    this.ChangeCursor();

    this.layer.add(this.head);
    this.layer.add(this.body);
    this.layer.add(this.pelvis);
    this.layer.add(this.leftHand);
    this.layer.add(this.rightHand);
    this.layer.add(this.leftLeg);
    this.layer.add(this.rightLeg);

    this.stage.add(this.layer);
    this.layer.draw();
  }

  // animationDance() {
  //   const anim = new Konva.Animation((frame) => {
  //     console.log(this.layer.findOne('#leftHandLine'));
  //   });

  //   anim.start();
  // }

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
