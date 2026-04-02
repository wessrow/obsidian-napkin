import { NapkinStyle } from "../types";

export const NAPKIN_STYLES: NapkinStyle[] = [
	// Colorful
	{ id: "CDQPRVVJCSTPRBBCD5Q6AWR",             name: "Vibrant strokes",  category: "Colorful"    },
	{ id: "CDQPRVVJCSTPRBBKDXK78",               name: "Glowful breeze",   category: "Colorful"    },
	{ id: "CDQPRVVJCSTPRBB6DHGQ8",               name: "Bold canvas",      category: "Colorful"    },
	{ id: "CDQPRVVJCSTPRBB6D5P6RSB4",            name: "Radiant blocks",   category: "Colorful"    },
	{ id: "CDQPRVVJCSTPRBB7E9GP8TB5DST0",        name: "Pragmatic shades", category: "Colorful"    },
	// Casual
	{ id: "CDGQ6XB1DGPQ6VV6EG",                 name: "Carefree mist",    category: "Casual"      },
	{ id: "CDGQ6XB1DGPPCTBCDHJP8",              name: "Lively layers",    category: "Casual"      },
	// Hand-drawn
	{ id: "D1GPWS1DCDQPRVVJCSTPR",              name: "Artistic flair",   category: "Hand-drawn"  },
	{ id: "D1GPWS1DDHMPWSBK",                   name: "Sketch notes",     category: "Hand-drawn"  },
	// Formal
	{ id: "CSQQ4VB1DGPP4V31CDNJTVKFBXK6JV3C",  name: "Elegant outline",  category: "Formal"      },
	{ id: "CSQQ4VB1DGPPRTB7D1T0",              name: "Subtle accent",    category: "Formal"      },
	{ id: "CSQQ4VB1DGPQ6TBECXP6ABB3DXP6YWG",  name: "Monochrome pro",   category: "Formal"      },
	{ id: "CSQQ4VB1DGPPTVVEDXHPGWKFDNJJTSKCC5T0", name: "Corporate clean", category: "Formal"    },
	// Monochrome
	{ id: "DNQPWVV3D1S6YVB55NK6RRBM",          name: "Minimal contrast", category: "Monochrome"  },
	{ id: "CXS62Y9DCSQP6XBK",                  name: "Silver beam",      category: "Monochrome"  },
];

export const DEFAULT_STYLE_ID: string = NAPKIN_STYLES[0]?.id ?? "CDQPRVVJCSTPRBBCD5Q6AWR";
