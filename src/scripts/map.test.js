import { expect, test } from "@jest/globals";
import map from "./map.js";

const _data = {
  size: 200,
  obstacles: 100,
  pixelSize: 16,
  orientation: 0,
  max: 0,
  map: [],
  manual: false,
};
_data.center = {
  x: Math.round(_data.size / 2) + 15,
  y: Math.round(_data.size / 2) + 15,
};
_data.step = {
  x: Math.round(_data.size / 2) + 15,
  y: Math.round(_data.size / 2) + 15,
};
const _messages = {
  hit: 'You find an obstacle',
  end: 'You find the limit of the planet',
  noland: 'You can not land in this place',
  manual: 'Manual control enabled\n\nYou can control de Rover whit the arrow keys',
  auto: 'Manual control disabled'
}
const _colors = ["transparent", "rgba(200,0,0,0.4)"];

test("generate map", () => {
  expect(map.generate(_data)).toBeDefined();
});
