export const WIDTH = window.innerWidth > 450 ? window.innerWidth : 450;
export const HIGHT =
  window.innerHeight - 100 > 300 ? window.innerHeight - 100 : 300;

export const X_CENTER = WIDTH / 2;
export const Y_HEAD = HIGHT / 4;
export const RADIUS_HEAD = 50;

export const Y_BODY = Y_HEAD + RADIUS_HEAD;
export const BODY_LENGTH = 150;
export const NECK_LENGTH = 20;

export const PELVIS_LENGTH = BODY_LENGTH / 2;
export const SHOULDER_LENGTH = BODY_LENGTH / 1.4;

export const RADIUS_LITTLE_CIRCLE = 10;

export const HAND_LENGTH = BODY_LENGTH * 0.6;
export const WRIST_LENGTH = (HAND_LENGTH / 4) * 3;

export const LEG_LENGTH = BODY_LENGTH * 0.7;
export const FOOT_LENGTH = LEG_LENGTH * 0.97;
