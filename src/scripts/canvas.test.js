import { expect, test } from "@jest/globals";
import canvas from "./canvas.js";

test("canvas loaded", () => {
  expect(document.querySelector('.canvas')).toBeDefined();
});
