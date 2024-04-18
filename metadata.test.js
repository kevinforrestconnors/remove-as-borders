import { expect, test } from "bun:test";
import metadata from "./metadata.json";

import { hasTrait, forAllScorpions, getIdsWithTrait, scorpions } from "./metadata";

test("count of outline_type = black", () => {
  let count = 0;
  forAllScorpions((entry) => {
    if (hasTrait(entry, "outline_type", "black")) {
      count++;
    }
  });

  expect(count).toBe(metadata.attribute_stats.outline_type.black.occurances);
});

test("all matches have claw_left", () => {
  expect(scorpions.has_matches.true).toEqual(scorpions.has_matches.true.intersection(scorpions.claw_left.regular).intersection(scorpions.claw_right.regular));
});

test("bloody tail is only regular or fat", () => {
  const regularOrFat = scorpions.tail.normal.union(scorpions.tail.fat).intersection(scorpions.bloody_tail.true);
  const allTails = scorpions.tail.normal.union(scorpions.tail.syringe).union(scorpions.tail.fat).union(scorpions.tail.ball).union(scorpions.tail.missing).intersection(scorpions.bloody_tail.true);

  expect(regularOrFat).toEqual(allTails);
});
