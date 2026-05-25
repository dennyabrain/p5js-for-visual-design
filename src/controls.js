import * as dat from "dat.gui";

export const params = {
  cp1x: 150,
  cp1y: 50,
  cp2x: 650,
  cp2y: 550,
};

const gui = new dat.GUI();

const cp1 = gui.addFolder("Control Point 1");
cp1.add(params, "cp1x", 0, 800).name("X");
cp1.add(params, "cp1y", 0, 600).name("Y");
cp1.open();

const cp2 = gui.addFolder("Control Point 2");
cp2.add(params, "cp2x", 0, 800).name("X");
cp2.add(params, "cp2y", 0, 600).name("Y");
cp2.open();
