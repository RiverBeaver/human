import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import * as Const from '../constants/human.constants';
import { Limbs } from './function/limbs';
import { Nimbus } from './function/nimbus';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { animationDance } from './function/animation-dance';
import { BodyParts } from './function/body-parts';
import { Gravity } from './function/gravity';

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

  headGroup!: Konva.Group;
  head!: Konva.Circle;
  nimbus!: Shape<ShapeConfig>[];

  body!: Konva.Line;
  shoulder!: Konva.Line;
  pelvis!: Konva.Line;

  // bodyPartsGroup!: Konva.Group;

  leftHand?: Konva.Group;
  rightHand?: Konva.Group;
  leftLeg?: Konva.Group;
  rightLeg?: Konva.Group;

  animDance?: Konva.Animation;

  isGravity = false;
  animGravity!: { anim: Konva.Animation; limb: Konva.Group }[];

  ngOnInit(): void {
    this.viewHuman();
  }

  viewHuman() {
    this.stage = new Konva.Stage({
      container: 'human',
      width: Const.WIDTH,
      height: Const.HIGHT,
    });

    this.layer = new Konva.Layer({
      draggable: true,
    });

    this.headGroup = new Konva.Group({
      x: Const.X_CENTER,
      y: Const.Y_HEAD,
    });

    this.head = BodyParts.getHead();
    this.nimbus = Nimbus.getNimbus();

    this.headGroup.add(this.head);
    this.headGroup.add(...this.nimbus);

    this.body = BodyParts.getBody();
    this.shoulder = BodyParts.getShoulder();
    this.pelvis = BodyParts.getPelvis();

    this.leftHand = Limbs.newLimb(true, true);
    this.rightHand = Limbs.newLimb(false, true);
    this.leftLeg = Limbs.newLimb(true, false);
    this.rightLeg = Limbs.newLimb(false, false);

    this.ChangeCursor();

    this.layer.add(this.headGroup);
    this.layer.add(this.body);
    this.layer.add(this.shoulder);
    this.layer.add(this.pelvis);
    this.layer.add(this.leftLeg);
    this.layer.add(this.rightLeg);
    this.layer.add(this.leftHand);
    this.layer.add(this.rightHand);

    this.stage.add(this.layer);
    this.layer.draw();
    this.animDance = animationDance(this.layer);

    const arrayCircles = this.stage.find('.nimbus');
    const zIndexHead = Nimbus.zIndexAnimation(arrayCircles as Konva.Circle[]);
    this.head.setZIndex(zIndexHead);
    Nimbus.animationNimbus(this.layer, arrayCircles as Konva.Circle[]);

    (this.layer.find('#line') as Konva.Line[]).forEach((line) => {
      line.on('mousedown mousemove', () => {
        this.layer.stopDrag();
      });
    });
  }

  startDance() {
    this.animDance?.start();
  }

  stopDance() {
    this.animDance?.stop();
  }

  gravityStart() {
    this.isGravity = true;
    this.animDance?.stop();
    this.animGravity = Gravity.startGravity(this.layer);
  }

  gravityStop() {
    this.isGravity = false;
    this.animGravity?.forEach((elem) => elem.anim.stop());
    this.animGravity?.forEach((elem) => elem.limb.off('dragstart.event1'));
    this.layer.off('dragstart.changePositions');
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
