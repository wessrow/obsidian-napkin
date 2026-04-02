import { NapkinStyle, NapkinVisualQueryGroup } from "../types";

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

export const NAPKIN_VISUAL_QUERY_GROUPS: NapkinVisualQueryGroup[] = [
	{ category: "Mindmap", icon: "network", keywords: ["idea", "brain", "branches", "radial"], queries: ["mindmap-horizontal", "mindmap-vertical", "mindmap-left", "mindmap-right"] },
	{ category: "Process", icon: "git-branch-plus", keywords: ["workflow", "steps", "sequence", "flow"], queries: ["flowchart", "sequence", "stairs", "journey", "cycle", "gantt"] },
	{ category: "Data", icon: "chart-column", keywords: ["metrics", "numbers", "graph", "chart", "analytics"], queries: ["bar", "bar-horizontal", "stacked-bar", "stacked-bar-horizontal", "line", "area", "waterfall", "gauge", "pie", "drop-off", "dumbbell-vertical", "dumbbell-horizontal", "sankey"] },
	{ category: "Timelines", icon: "calendar-range", keywords: ["roadmap", "chronology", "time", "milestones"], queries: ["timeline", "sequence", "flowchart", "gantt", "cycle"] },
	{ category: "Comparison", icon: "scale", keywords: ["compare", "versus", "options", "tradeoffs"], queries: ["pros-and-cons", "table", "versus", "balance", "relationship", "podium", "decision", "spectrum", "quadrant", "venn"] },
	{ category: "Business frameworks", icon: "briefcase-business", keywords: ["strategy", "business", "analysis", "framework"], queries: ["swot", "pestel", "porters", "pyramid", "bullseye", "spectrum", "funnel", "gantt", "quadrant", "venn", "journey"] },
	{ category: "Brainstorming", icon: "lightbulb", keywords: ["ideas", "brainstorm", "explore", "concepts"], queries: ["mindmap", "key-ideas", "list", "table", "decision"] },
	{ category: "Parts of a whole", icon: "pie-chart", keywords: ["breakdown", "components", "whole", "structure"], queries: ["key-ideas", "diverge", "converge", "iceberg"] },
	{ category: "Problems and solutions", icon: "shield-question", keywords: ["problem", "solution", "challenge", "fix"], queries: ["problem-solution", "transformation", "pestel", "porters", "swot", "challenges", "bridge"] },
	{ category: "Visual metaphors", icon: "sparkles", keywords: ["metaphor", "story", "visual", "conceptual"], queries: ["transformation", "podium", "journey", "vision", "impact", "balance", "performance", "bottleneck", "hole", "spectrum", "trend", "stairs", "challenges", "race", "dialogue", "lens", "bridge", "prism", "pillar", "iceberg"] },
	{ category: "Narrative", icon: "messages-square", keywords: ["story", "dialogue", "conversation", "decision"], queries: ["dialogue", "decision"] },
	{ category: "Cause and effect", icon: "waypoints", keywords: ["causes", "effects", "impact", "drivers"], queries: ["root-causes", "impact", "cycle", "flowchart", "sequence"] },
	{ category: "Hierarchy", icon: "blocks", keywords: ["layers", "levels", "priority", "hierarchy"], queries: ["pyramid", "table", "bullseye", "iceberg", "quadrant"] },
];
