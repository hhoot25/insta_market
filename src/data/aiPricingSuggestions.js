// Hardcoded pricing suggestions presented as AI-generated recommendations.
// Keyed by category, then condition. Each entry has a suggested price,
// a range, a confidence score, and reasoning signals the AI "detected".

export const aiSuggestions = {
  fashion: {
    New:       { price: 185, low: 160, high: 220, confidence: 94, signals: ["Brand-new condition commands premium resale value", "Fashion category trending +18% this month", "Similar listings averaging $190 in your region"] },
    "Like New": { price: 140, low: 115, high: 165, confidence: 91, signals: ["Minimal wear detected — prices close to new", "High demand for near-mint fashion items", "Comparable listings sold within 3 days at this range"] },
    Excellent:  { price: 115, low: 95,  high: 140, confidence: 88, signals: ["Excellent condition holds strong resale value", "Buyer interest high for this category", "Listings priced here sell 40% faster than average"] },
    "Very Good":{ price: 90,  low: 72,  high: 110, confidence: 85, signals: ["Very good condition — slight discount from excellent", "Strong mid-market demand", "Recommend pricing at $90 to stay competitive"] },
    Good:       { price: 65,  low: 50,  high: 82,  confidence: 80, signals: ["Good condition items move well when priced fairly", "Buyers in this tier are price-sensitive", "Suggest pricing toward lower end to drive quick sale"] },
  },
  sneakers: {
    New:        { price: 245, low: 210, high: 295, confidence: 96, signals: ["Deadstock sneakers carry strong market premium", "Sneaker resale up 24% over last 30 days", "StockX/GOAT comparable listings averaging $260"] },
    "Like New":  { price: 195, low: 170, high: 225, confidence: 93, signals: ["Near-deadstock condition — minimal price drop from new", "Sneaker buyers highly condition-sensitive", "Box included will support higher end of range"] },
    Excellent:   { price: 155, low: 130, high: 180, confidence: 89, signals: ["Excellent condition commands solid resale", "Mid-tier sneaker demand remains consistent", "Price at $155 to match top sold comps"] },
    "Very Good": { price: 120, low: 100, high: 145, confidence: 84, signals: ["Some wear expected — price reflects honest condition", "Buyers comparison-shopping in this range", "Clear photos of soles recommended to build trust"] },
    Good:        { price: 85,  low: 65,  high: 105, confidence: 78, signals: ["Good condition works for wearers, not collectors", "Price competitively to beat similar listings", "Detailed condition notes will help conversion"] },
  },
  electronics: {
    New:        { price: 520, low: 470, high: 580, confidence: 95, signals: ["Sealed/new electronics sell near retail", "High buyer confidence in new condition", "Listings with original packaging sell 55% faster"] },
    "Like New":  { price: 420, low: 375, high: 465, confidence: 93, signals: ["Like-new electronics are the highest-demand tier", "Buyers prefer this over new for price savings", "Include all accessories to justify upper range"] },
    Excellent:   { price: 340, low: 300, high: 385, confidence: 90, signals: ["Excellent condition holds well in electronics", "Functional quality matters more than cosmetics here", "Mentioning battery health % increases sale rate"] },
    "Very Good": { price: 270, low: 235, high: 310, confidence: 86, signals: ["Very good — normal wear acceptable to most buyers", "Price reflects realistic used market value", "Recommend including original charger/cables"] },
    Good:        { price: 195, low: 160, high: 230, confidence: 80, signals: ["Good condition signals heavier use — price accordingly", "Budget buyers actively searching this tier", "Be transparent about any cosmetic issues"] },
  },
  jewelry: {
    New:        { price: 145, low: 120, high: 175, confidence: 92, signals: ["New handmade jewelry commands artisan premium", "Jewelry gifting demand peaks year-round", "Unique pieces outperform mass-market by 35%"] },
    "Like New":  { price: 110, low: 90,  high: 135, confidence: 89, signals: ["Like-new jewelry retains most of its value", "Buyers expect minimal signs of wear at this price", "Presentation photos on a clean background convert better"] },
    Excellent:   { price: 88,  low: 72,  high: 108, confidence: 86, signals: ["Excellent condition appropriate for gifting", "Strong demand for pre-owned fine jewelry", "Authentication or hallmark details boost trust"] },
    "Very Good": { price: 68,  low: 55,  high: 84,  confidence: 82, signals: ["Some patina expected — buyers accept this", "Price reflects honest pre-owned market", "Cleaning before listing can push toward higher range"] },
    Good:        { price: 48,  low: 36,  high: 62,  confidence: 76, signals: ["Good condition — priced for quick sale", "Entry-level buyers browsing this tier", "Describe any wear clearly to build credibility"] },
  },
  home: {
    New:        { price: 95,  low: 78,  high: 118, confidence: 90, signals: ["New home items sell reliably near retail", "Home category demand up 12% seasonally", "Listings with styled photos perform significantly better"] },
    "Like New":  { price: 72,  low: 58,  high: 90,  confidence: 87, signals: ["Like-new home goods are sought-after", "Buyers prefer used for sustainability and price", "Include dimensions to reduce buyer questions"] },
    Excellent:   { price: 56,  low: 44,  high: 70,  confidence: 84, signals: ["Excellent condition — minimal discount needed", "Home buyers are practical and detail-oriented", "Multiple angles in photos recommended"] },
    "Very Good": { price: 42,  low: 32,  high: 54,  confidence: 80, signals: ["Very good reflects honest daily-use wear", "Mid-market home buyers are active", "Price at $42 to stay in top search results"] },
    Good:        { price: 28,  low: 18,  high: 38,  confidence: 74, signals: ["Good condition — price for quick turnover", "Buyers in this range expect visible wear", "Bundle with similar items to increase value"] },
  },
  art: {
    New:        { price: 220, low: 180, high: 275, confidence: 88, signals: ["Original art and prints carry unique value", "Art market on platform growing 31% YoY", "Limited edition or signed pieces justify upper range"] },
    "Like New":  { price: 175, low: 145, high: 215, confidence: 85, signals: ["Near-mint prints retain strong collector value", "Art buyers highly condition-sensitive", "Certificate of authenticity will support higher price"] },
    Excellent:   { price: 140, low: 112, high: 170, confidence: 82, signals: ["Excellent condition appropriate for framing/display", "Consistent demand for quality art pieces", "Provenance details increase buyer confidence"] },
    "Very Good": { price: 105, low: 82,  high: 130, confidence: 78, signals: ["Very good — minor imperfections acceptable", "Art buyers factor condition heavily in offers", "Detail photos of any imperfections build trust"] },
    Good:        { price: 70,  low: 50,  high: 92,  confidence: 72, signals: ["Good condition — priced for accessibility", "Budget art buyers actively browsing", "Honest description of condition increases conversion"] },
  },
  vintage: {
    New:        { price: 130, low: 105, high: 160, confidence: 91, signals: ["New old-stock vintage is highly desirable", "Scarcity premium applies — lean toward upper range", "Provenance and era details drive collector interest"] },
    "Like New":  { price: 100, low: 82,  high: 125, confidence: 88, signals: ["Like-new vintage in strong demand", "Collectors pay premium for well-preserved pieces", "Include era/decade in title for better discoverability"] },
    Excellent:   { price: 78,  low: 62,  high: 98,  confidence: 85, signals: ["Excellent vintage condition — above average for age", "Patina acceptable but functionality matters", "Detailed origin story increases buyer engagement"] },
    "Very Good": { price: 58,  low: 44,  high: 74,  confidence: 81, signals: ["Very good for age — expected signs of life", "Vintage buyers embrace character and wear", "Price reflects honest market for this era and type"] },
    Good:        { price: 38,  low: 26,  high: 52,  confidence: 75, signals: ["Good condition — charm over perfection", "Entry-level vintage collectors browsing this range", "Clearly document what makes it authentic/interesting"] },
  },
};

// Returns a suggestion object for a given category + condition
export function getSuggestion(category, condition) {
  const cat = aiSuggestions[category];
  if (!cat) return null;
  return cat[condition] || null;
}
