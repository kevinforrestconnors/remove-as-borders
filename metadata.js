import metadata from "./metadata.json";

export function forAllScorpions(fn) {
  metadata.entries.forEach((entry) => {
    fn(entry);
  });
}

export function hasTrait(entry, trait, value) {
  return entry.attributes[trait] === value;
}

export function getIdsWithTrait(trait, value) {
  const entries = new Set();
  forAllScorpions((entry) => {
    if (hasTrait(entry, trait, value)) {
      entries.add(entry.number.toString());
    }
  });
  return entries;
}

export const scorpions = {
  outline_type: {
    black: getIdsWithTrait("outline_type", "black"),
    dark: getIdsWithTrait("outline_type", "dark"),
    light: getIdsWithTrait("outline_type", "light"),
    white: getIdsWithTrait("outline_type", "white"),
  },
  bg_style: {
    blank: getIdsWithTrait("bg_style", "blank"),
    frame: getIdsWithTrait("bg_style", "frame"),
    star: getIdsWithTrait("bg_style", "star"),
    circle: getIdsWithTrait("bg_style", "circle"),
    square: getIdsWithTrait("bg_style", "square"),
  },
  claw_left: {
    regular: getIdsWithTrait("claw_left", "regular"),
    big: getIdsWithTrait("claw_left", "big"),
    missing: getIdsWithTrait("claw_left", "missing"),
    ball: getIdsWithTrait("claw_left", "ball"),
    mushroom: getIdsWithTrait("claw_left", "mushroom"),
    scissors: getIdsWithTrait("claw_left", "scissors"),
  },
  claw_right: {
    regular: getIdsWithTrait("claw_right", "regular"),
    big: getIdsWithTrait("claw_right", "big"),
    missing: getIdsWithTrait("claw_right", "missing"),
    ball: getIdsWithTrait("claw_right", "ball"),
    mushroom: getIdsWithTrait("claw_right", "mushroom"),
    scissors: getIdsWithTrait("claw_right", "scissors"),
  },
  has_cigarette: {
    true: getIdsWithTrait("has_cigarette", true),
    false: getIdsWithTrait("has_cigarette", false),
  },
  legs: {
    stubby: getIdsWithTrait("legs", "stubby"),
    insect: getIdsWithTrait("legs", "insect"),
    skinny: getIdsWithTrait("legs", "skinny"),
    normal: getIdsWithTrait("legs", "normal"),
  },
  tail: {
    normal: getIdsWithTrait("tail", "normal"),
    syringe: getIdsWithTrait("tail", "syringe"),
    fat: getIdsWithTrait("tail", "fat"),
    ball: getIdsWithTrait("tail", "ball"),
    missing: getIdsWithTrait("tail", "missing"),
  },
  bloody_tail: {
    true: getIdsWithTrait("bloody_tail", true),
    false: getIdsWithTrait("bloody_tail", false),
  },
  has_matches: {
    true: getIdsWithTrait("has_matches", true),
    false: getIdsWithTrait("has_matches", false),
  },
  has_halo: {
    true: getIdsWithTrait("has_halo", true),
    false: getIdsWithTrait("has_halo", false),
  },
  multicolored: {
    true: getIdsWithTrait("multicolored", true),
    false: getIdsWithTrait("multicolored", false),
  },
  colored_claws: {
    true: getIdsWithTrait("colored_claws", true),
    false: getIdsWithTrait("colored_claws", false),
  },
  colored_core: {
    true: getIdsWithTrait("colored_core", true),
    false: getIdsWithTrait("colored_core", false),
  },
  colored_tail: {
    true: getIdsWithTrait("colored_tail", true),
    false: getIdsWithTrait("colored_tail", false),
  },
  multicolor_type: {
    none: getIdsWithTrait("multicolor_type", "none"),
    stripes: getIdsWithTrait("multicolor_type", "stripes"),
    solid: getIdsWithTrait("multicolor_type", "solid"),
  },
  false_face: {
    none: getIdsWithTrait("false_face", "none"),
    tepid: getIdsWithTrait("false_face", "tepid"),
    frown: getIdsWithTrait("false_face", "frown"),
    smile: getIdsWithTrait("false_face", "smile"),
  },
  evil_eye: {
    none: getIdsWithTrait("evil_eye", "none"),
    blue: getIdsWithTrait("evil_eye", "blue"),
    red: getIdsWithTrait("evil_eye", "red"),
  },
  no_eyes: {
    true: getIdsWithTrait("no_eyes", true),
    false: getIdsWithTrait("no_eyes", false),
  },
  claws_unique: {
    true: getIdsWithTrait("claws_unique", true),
    false: getIdsWithTrait("claws_unique", false),
  },
};
