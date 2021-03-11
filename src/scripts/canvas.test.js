import { expect, test } from "@jest/globals";
import canvas from "./canvas.js";

test("canvas loaded", () => {
  let element = document.createElement('canvas')
  element.id = 'mars'
  expect(canvas.load(element)).toBeDefined();
});
