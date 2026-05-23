// export const ALL_TASK_FILTER = "all";

// export const TASK_CATEGORIES = [
//   { key: "ptc", label: "PTC", icon: "💰", description: "Paid time-on-site tasks" },
//   { key: "captcha", label: "Captcha", icon: "🤖", description: "Solve and submit verification tasks" },
//   { key: "lucky-draw", label: "Lucky Draw", icon: "🎰", description: "Spin-based bonus tasks" },
//   { key: "short-link", label: "Short Link", icon: "🔗", description: "Visit and wait for redirect tasks" },
// ];

// export const TASK_CATEGORY_ORDER = TASK_CATEGORIES.map((category) => category.key);

// export const TASK_CATEGORY_MAP = TASK_CATEGORIES.reduce((map, category) => {
//   map[category.key] = category;
//   return map;
// }, {});

// export const normalizeTaskFilter = (value) => {
//   const key = (value || ALL_TASK_FILTER).toLowerCase();
//   return key === ALL_TASK_FILTER || TASK_CATEGORY_MAP[key] ? key : ALL_TASK_FILTER;
// };