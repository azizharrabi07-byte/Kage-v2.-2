// ============================================================
// KAGE Diet & Nutrition Programs — 100+ Real, Science-Backed Protocols
// ============================================================

export interface DietProgram {
  id: string;
  name: string;
  category: 'fat-loss' | 'muscle-gain' | 'maintenance' | 'keto' | 'low-carb' | 'high-carb' | 'plant-based' | 'intermittent-fasting' | 'mediterranean' | 'performance' | 'bodybuilding' | 'paleo' | 'specific';
  goal: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  scientificBasis: string;
  whatYouWillGain: string;
  typicalMacros: { protein: string; carbs: string; fat: string; calories: string };
  sampleMeals: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  provenBy: string;
  recommendedProgramTypes: string[];
}

// ============================================================
// FAT LOSS DIETS (15)
// ============================================================

const fatLossDiets: DietProgram[] = [
  {
    id: 'standard-calorie-deficit',
    name: 'Standard Calorie Deficit (500 kcal/day)',
    category: 'fat-loss',
    goal: 'Fat loss at ~0.5 kg (1 lb) per week',
    difficulty: 'beginner',
    description: 'The foundational fat loss approach: consume 500 fewer calories than your Total Daily Energy Expenditure (TDEE) each day. This creates a weekly deficit of ~3,500 calories, yielding approximately 0.5 kg of fat loss per week without extreme restriction. Macronutrients are balanced to preserve lean mass.',
    scientificBasis: 'The 3,500-calorie rule was popularised by Wishnofsky (1958) and remains the bedrock of energy balance theory. Modern research by Hall et al. (2012) at the NIH confirmed that a sustained 500-calorie deficit produces predictable fat loss while minimising muscle catabolism when protein is adequate.',
    whatYouWillGain: 'Steady, sustainable fat loss of 0.5 kg/week; preserved lean body mass; improved metabolic health markers; habit formation for long-term weight maintenance.',
    typicalMacros: { protein: '1.6–2.2 g/kg bodyweight', carbs: 'Remaining calories after protein/fat', fat: '0.8–1.0 g/kg bodyweight', calories: 'TDEE − 500' },
    sampleMeals: [
      'Breakfast: 3-egg omelette with spinach, mushrooms, and 30 g cheddar + 1 slice whole-grain toast',
      'Lunch: 150 g grilled chicken breast, 200 g roasted sweet potato, steamed broccoli with lemon',
      'Dinner: 150 g baked salmon, 150 g quinoa, roasted asparagus with olive oil drizzle',
      'Snack: 200 g Greek yoghurt (2%) with 100 g mixed berries and 15 g crushed almonds',
      'Post-workout: 1 scoop whey protein + 250 ml unsweetened almond milk + 1 banana',
      'Alternative lunch: 170 g lean ground turkey taco bowl with lettuce, tomato, 50 g avocado, salsa'
    ],
    pros: ['Sustainable for long periods', 'No foods are completely off-limits', 'Easy to track with apps', 'Well-researched and predictable', 'Adaptable to any cuisine preference'],
    cons: ['Requires consistent calorie tracking', 'Hunger may be an issue initially', 'Slower results than aggressive deficits', 'Plateaus require recalculation of TDEE', 'Can be tedious for social eating'],
    bestFor: 'Anyone new to dieting who wants a moderate, sustainable rate of fat loss without extreme measures. Ideal for natural lifters in the early stages of a cut.',
    provenBy: 'Wishnofsky (1958); Hall et al., NIH (2012); systematic reviews by the American Journal of Clinical Nutrition',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'fierce-5', 'phul', 'ice-cream-fitness-5x5']
  },
  {
    id: 'aggressive-calorie-deficit',
    name: 'Aggressive Deficit (750–1000 kcal/day)',
    category: 'fat-loss',
    goal: 'Rapid fat loss at 0.7–1.0 kg (1.5–2.2 lb) per week',
    difficulty: 'intermediate',
    description: 'A deeper calorie deficit used when faster fat loss is needed—such as before a competition, photoshoot, or weight class deadline. Protein intake is elevated (2.3–2.7 g/kg) to mitigate muscle loss. Not recommended for extended periods beyond 6–8 weeks without diet breaks.',
    scientificBasis: 'Garthe et al. (2011) showed that athletes in a 750–1,000 kcal deficit lost significant body fat while preserving lean mass when protein was high and resistance training was maintained. Aragon & Schoenfeld (2020) confirmed higher protein needs in aggressive deficits.',
    whatYouWillGain: 'Rapid fat loss suitable for deadlines; improved body composition in 4–8 weeks; heightened insulin sensitivity; competition-ready leanness.',
    typicalMacros: { protein: '2.3–2.7 g/kg lean mass', carbs: 'Low—focused on vegetables and fibrous sources', fat: '0.5–0.7 g/kg lean mass', calories: 'TDEE − 750 to −1000' },
    sampleMeals: [
      'Breakfast: 200 g liquid egg whites scrambled with spinach and 1 tbsp nutritional yeast',
      'Lunch: 170 g lean turkey breast with 300 g steamed green beans and 100 g brown rice (cooked)',
      'Dinner: 170 g white fish (cod/tilapia) with 400 g roasted vegetables (broccoli, cauliflower, bell pepper)',
      'Snack: 1 scoop casein protein + water + 10 g almond butter',
      'Post-workout: 2 scoops whey isolate + 200 ml water + 5 g glutamine',
      'Alternative: 150 g 93/7 lean beef with 2 whole eggs and 200 g asparagus'
    ],
    pros: ['Fast results—visible change in 2 weeks', 'Clear deadline structure', 'Boosts metabolic flexibility when done short-term', 'Can reveal muscle definition quickly'],
    cons: ['High hunger levels', 'Energy and performance may drop', 'Higher risk of muscle loss if protein is insufficient', 'Not sustainable beyond 6–8 weeks', 'May disrupt menstrual cycle in women', 'Requires precise tracking'],
    bestFor: 'Experienced dieters, physique competitors, and powerlifters needing to make a weight class with a deadline. Not for beginners or those with a history of disordered eating.',
    provenBy: 'Garthe et al. (2011); Aragon & Schoenfeld (2020); Helms et al. (2014) on protein needs during caloric restriction',
    recommendedProgramTypes: ['531', 'nsuns-lp', 'conjugate-method', 'phul', 'phat']
  },
  {
    id: 'psmf',
    name: 'Protein-Sparing Modified Fast (PSMF) — Lyle McDonald',
    category: 'fat-loss',
    goal: 'Extreme rapid fat loss while sparing lean mass',
    difficulty: 'advanced',
    description: 'A medically-supervised very-low-calorie diet (VLCD) that provides 700–1,000 kcal/day almost exclusively from protein sources (1.5–2.0 g per pound of lean mass). Carbohydrates and fats are minimised (<30 g each). Developed by Lyle McDonald, PSMF is designed for short-term use (2–12 weeks) in obese individuals or advanced dieters needing drastic fat loss with minimal muscle loss.',
    scientificBasis: 'Based on the physiological principle that dietary protein exerts a protein-sparing effect during severe caloric restriction. McDonald compiled the protocol from research by Blackburn et al. (1975) and the landmark Protein-Sparing Modified Fast studies at Harvard Medical School. High protein intake preserves nitrogen balance even in deep caloric deficits.',
    whatYouWillGain: 'Extremely rapid fat loss (1–2 kg/week); near-complete preservation of lean mass if training is maintained; rapid improvement in insulin sensitivity; reset of appetite signalling.',
    typicalMacros: { protein: '1.5–2.0 g/lb lean mass (~250–350 g)', carbs: '<30 g (fibrous vegetables only)', fat: '<30 g (from protein sources)', calories: '700–1,000' },
    sampleMeals: [
      'Meal 1: 200 g egg whites + 2 whole eggs scrambled with spinach and mushroom',
      'Meal 2: 200 g chicken breast with 200 g broccoli and 1 tbsp vinegar-based dressing',
      'Meal 3: 200 g extra-lean ground turkey or white fish with 200 g green beans',
      'Meal 4: 1–2 scoops casein protein shake + water (before bed)',
      'Optional: Sugar-free Jell-O, bouillon broth, or pickles for electrolyte management',
      'Free foods: All non-starchy vegetables, diet soda, black coffee, tea'
    ],
    pros: ['Fastest fat loss outside of surgery', 'Muscle-sparing when done correctly', 'Simplifies food choices dramatically', 'Drops water weight fast', 'Can break through stubborn plateaus'],
    cons: ['Extremely low energy and libido', 'Cannot be sustained past 12 weeks', 'Risk of gallstones without medical supervision', 'Severe social limitations', 'Risk of refeeding syndrome on reintroduction', 'Requires aggressive electrolyte supplementation', 'Not suitable for eating disorder history'],
    bestFor: 'Obese individuals under medical supervision (BMI >30); advanced bodybuilders in the final 2–4 weeks of contest prep; dieters who have stalled on conventional deficits.',
    provenBy: 'Blackburn et al. (1975), Harvard Medical School; Lyle McDonald, "The Protein-Sparing Modified Fast" (2003)',
    recommendedProgramTypes: ['starting-strength', '531', 'conjugate-method', 'smolov']
  },
  {
    id: 'rapid-fat-loss',
    name: 'Rapid Fat Loss (RFL) — Lyle McDonald',
    category: 'fat-loss',
    goal: 'Maximum fat loss with minimal muscle catabolism',
    difficulty: 'advanced',
    description: 'Lyle McDonald\'s complete "Rapid Fat Loss Handbook" protocol builds on PSMF principles with structured "free meals" and refeeds. It cycles between extremely low-calorie days (strict PSMF) and scheduled higher-calorie refeed days to maintain metabolic rate and psychological sanity. Designed for short-term use only (8–16 weeks depending on body fat).',
    scientificBasis: 'McDonald synthesised research on VLCDs, refeeding physiology, and metabolic adaptation. The protocol incorporates cyclical refeeds to prevent the adaptive thermogenesis that plagues continuous severe restriction. Studies by Weyer et al. (2000) and Doucet et al. (2001) demonstrated that refeeds help restore leptin levels and metabolic rate.',
    whatYouWillGain: 'Very rapid fat loss (0.5–1.5 kg/week depending on starting body fat); structured refeeds that maintain metabolic rate; learning how to transition off extreme dieting; preservation of training performance on refeed days.',
    typicalMacros: { protein: '1.5 g/lb lean mass on strict days', carbs: '150–300 g on refeed days', fat: 'Minimal on strict days', calories: '800–1,200 strict days; 2,000–2,500 refeed days' },
    sampleMeals: [
      'Strict day — Meal 1: 200 g egg whites + 2 whole eggs with spinach',
      'Strict day — Meal 2: 200 g chicken breast + 200 g broccoli + 1 tsp olive oil',
      'Strict day — Meal 3: 200 g tilapia + 200 g asparagus + lemon juice',
      'Strict day — Meal 4: 2 scoops casein + water before bed',
      'Refeed day — Add: 200–300 g carbohydrate sources (white rice, potatoes, oats, fruit) spread over 2–3 meals',
      'Free meal (weekly): Any meal of choice—pizza, burger, dessert—to maintain sanity'
    ],
    pros: ['Structured refeeds prevent metabolic crash', 'Fastest practical results', 'Free meals improve adherence', 'Clear start/end dates', 'Comprehensive handbook guidance'],
    cons: ['Extremely restrictive on strict days', 'Complex scheduling', 'Can trigger binge-restrict cycles', 'Performance suffers on strict days', 'Not for non-dieters or beginners'],
    bestFor: 'Experienced physique athletes and advanced fitness enthusiasts needing rapid fat loss while keeping metabolic adaptation at bay. Excellent last-resort protocol for competition prep.',
    provenBy: 'Lyle McDonald, "The Rapid Fat Loss Handbook" (2005); VLCD research by NIDDK',
    recommendedProgramTypes: ['531', 'phul', 'nsuns-lp', 'conjugate-method']
  },
  {
    id: 'flexible-dieting',
    name: 'Flexible Dieting / IIFYM (If It Fits Your Macros)',
    category: 'fat-loss',
    goal: 'Fat loss or muscle gain with dietary flexibility',
    difficulty: 'beginner',
    description: 'Flexible dieting, popularised by Alan Aragon, operates on the principle that no foods are inherently "bad" as long as total macronutrients and calories fit your daily targets. It removes the moral valence from food choices, allowing treats and discretionary calories within an overall structured intake. The focus is on hitting protein, fat, and carbohydrate targets rather than eating specific "approved" foods.',
    scientificBasis: 'Aragon and Schoenfeld\'s 2017 paper "Magnitude and Composition of Energy Deficit" confirmed that macronutrient composition matters less than total energy balance for fat loss, provided protein is adequate. The IIFYM approach has been validated in multiple trials showing equivalent fat loss between "clean" and "flexible" diet groups when macros are matched.',
    whatYouWillGain: 'Freedom from dietary rigidity; ability to eat socially without guilt; consistent progress without extreme restriction; long-term adherence through flexibility; improved understanding of food composition.',
    typicalMacros: { protein: '1.6–2.2 g/kg bodyweight', carbs: 'Flexible—based on preference and activity', fat: '0.8–1.0 g/kg bodyweight', calories: 'Set based on goal (deficit/surplus/maintenance)' },
    sampleMeals: [
      'Breakfast: 1 cup oatmeal with 1 scoop whey protein, 1 tbsp peanut butter, 1/2 banana',
      'Lunch: 200 g chicken thigh, 150 g jasmine rice, 100 g roasted broccoli with sesame oil',
      'Dinner: 180 g 80/20 ground beef burger on whole-wheat bun with lettuce, tomato, 1 slice cheese',
      'Snack: 200 g 2% Greek yoghurt + 30 g honey + 15 g dark chocolate chips',
      'Post-workout: 2 scoops protein + 500 ml skim milk + 1 apple',
      '"Treat" meal: 2 slices pepperoni pizza (fits into remaining macros)'
    ],
    pros: ['Highest adherence of any diet approach', 'No forbidden foods', 'Works for any goal (cut/bulk/maintain)', 'Teaches long-term nutritional competence', 'Easy to combine with social eating'],
    cons: ['Can encourage "see-food" mentality in some', 'Requires consistent tracking', 'Gives zero guidance on food quality', 'Can lead to micronutrient deficiencies if junk food dominates', 'Tracking fatigue over months/years'],
    bestFor: 'Anyone who struggles with restrictive diets, values social eating, or wants a sustainable lifelong approach. Particularly effective for busy professionals and students.',
    provenBy: 'Aragon & Schoenfeld (2017); Sacks et al. (2009), NEJM; clinical trials showing equivalent fat loss across varied macronutrient compositions',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp', 'phul', 'nsuns-lp', 'gzcl-method']
  },
  {
    id: 'vertical-diet',
    name: 'Vertical Diet — Stan Efferding',
    category: 'fat-loss',
    goal: 'Optimised digestion and nutrient partitioning for size and strength',
    difficulty: 'intermediate',
    description: 'Created by professional bodybuilder and powerlifter Stan Efferding, the Vertical Diet centres on easily digestible, micronutrient-dense foods arranged in a "vertical" hierarchy: red meat as the foundation, white rice as the primary carbohydrate (lowest allergy/FODMAP risk), and carefully selected fruits/vegetables that minimise gastrointestinal distress. The goal is maximum nutrient intake with minimum digestive burden, supporting high training volumes.',
    scientificBasis: 'Efferding developed the diet empirically through his own training and later validated it with hundreds of elite clients. It draws on sports nutrition research showing that red meat provides superior bioavailability of iron, zinc, and creatine. The emphasis on white rice over other grains is based on its low FODMAP content and high digestibility.',
    whatYouWillGain: 'Improved digestive comfort during heavy training; reduced bloating; better micronutrient status (iron, zinc, B vitamins); consistent energy from easily digested carbs; strength gains supported by optimal protein intake.',
    typicalMacros: { protein: '2.0–2.5 g/kg bodyweight (mostly red meat)', carbs: '4–6 g/kg (primarily white rice, potatoes)', fat: 'From meat and added butter/olive oil', calories: '3,000–5,000 depending on goal' },
    sampleMeals: [
      'Breakfast: 200 g ground beef (85/15) + 300 g white rice + 3 whole eggs',
      'Lunch: 250 g ribeye steak + 400 g white rice + 1 cup orange juice',
      'Dinner: 250 g 93/7 lean ground beef + 300 g white rice + 200 g steamed carrots with butter',
      'Snack: 200 ml whole milk + 1 banana + 30 g almond butter',
      'Post-training: 1 litre orange juice + 50 g dextrose + 1 scoop whey protein',
      'Pre-bed: 250 g cottage cheese or 200 g Greek yoghurt'
    ],
    pros: ['Very easy on the digestive system', 'High micronutrient density', 'Supports heavy training well', 'Low allergy risk foods', 'Simple and repeatable', 'Backed by elite athlete results'],
    cons: ['Very high red meat intake (environmental/health concerns for some)', 'Expensive at scale', 'Monotonous for some palates', 'Low fibre compared to other diets', 'Difficult for vegetarians/vegans'],
    bestFor: 'Serious strength athletes, powerlifters, and bodybuilders who struggle with digestive issues from high-volume eating. Ideal for anyone seeking maximum performance from minimal GI distress.',
    provenBy: 'Stan Efferding, "The Vertical Diet" (2018); results from Hafthor Björnsson (2018 World\'s Strongest Man)',
    recommendedProgramTypes: ['starting-strength', '531', 'smolov', 'westside-barbell', 'conjugate-method', 'stronglifts-5x5']
  },
  {
    id: 'velocity-diet',
    name: 'Velocity Diet',
    category: 'fat-loss',
    goal: 'Extreme short-term fat loss via meal replacement shakes',
    difficulty: 'advanced',
    description: 'The Velocity Diet is a 28-day aggressive fat loss protocol where solid food is replaced with 5–6 protein shakes per day (totalling ~1,000–1,200 kcal). Created by Chris Shugart at T-Nation, it was designed for rapid fat loss in disciplined individuals. Real food is gradually reintroduced after day 28.',
    scientificBasis: 'Based on meal replacement (MR) research showing that structured liquid diets improve adherence and produce faster initial weight loss than food-based diets (Heymsfield et al., 2003). The high protein content (200+ g/day) helps preserve lean mass during the caloric deficit.',
    whatYouWillGain: 'Very rapid fat loss in 28 days; dramatic visual change; simplified nutrition (no decisions); break from food addiction patterns; reset of appetite and cravings.',
    typicalMacros: { protein: '200+ g (from shakes)', carbs: '50–60 g (from shakes and limited veg)', fat: '20–30 g (from shakes)', calories: '1,000–1,200' },
    sampleMeals: [
      'Shake 1: 2 scoops protein + water + 1 tbsp flax oil + 5 g glutamine',
      'Shake 2: 2 scoops protein + water + 1 tbsp psyllium husk + 5 g glutamine',
      'Shake 3: 2 scoops protein + water + 1 tbsp flax oil + 5 g glutamine (post-workout)',
      'Shake 4: 2 scoops protein + water + 1 tbsp psyllium husk + 5 g glutamine',
      'Shake 5: 2 scoops protein + water + 1 tbsp flax oil + 5 g glutamine',
      'Optional: 1 cup green vegetables with vinegar + unlimited black coffee/tea'
    ],
    pros: ['Extremely fast results', 'No food decisions for 28 days', 'Simple and clear protocol', 'Dramatic visual change is motivating'],
    cons: ['Very difficult to adhere to', 'Zero food variety', 'May trigger disordered eating patterns', 'Socially isolating', 'No chewing leads to psychological frustration', 'Nutrient deficiencies possible', 'Weight regain common after'],
    bestFor: 'Highly disciplined individuals needing rapid results for a specific deadline (photo shoot, event, weigh-in). NOT suitable for anyone with a history of eating disorders.',
    provenBy: 'Chris Shugart, T-Nation (2004); Heymsfield et al. (2003) on meal replacement efficacy',
    recommendedProgramTypes: ['phul', 'phat', 'ice-cream-fitness-5x5']
  },
  {
    id: '21-day-fix',
    name: '21-Day Fix',
    category: 'fat-loss',
    goal: 'Simple portion-controlled fat loss',
    difficulty: 'beginner',
    description: 'A 21-day programme using colour-coded portion containers to simplify calorie and macro tracking without weighing or measuring. Each food category (protein, vegetables, fruits, carbs, healthy fats, seeds/dressings) has a specific container size. Created by Autumn Calabrese and popularised through Beachbody.',
    scientificBasis: 'Portion control is one of the most effective strategies for weight management, validated by the PORT trials at Penn State (Rolls et al., 2004). Using visual cues (containers) improves adherence compared to calorie counting (Wansink, 2004). The 21-day timeframe aligns with habit formation research by Lally et al. (2010).',
    whatYouWillGain: 'Weight loss of 3–7 kg (7–15 lb) in 3 weeks; simple nutrition education; portion size awareness; foundation for long-term healthy habits.',
    typicalMacros: { protein: '4 containers/day (varies by plan)', carbs: '2–3 containers/day', fat: '1–2 containers/day', calories: '1,200–1,500 (varies by container plan)' },
    sampleMeals: [
      'Breakfast: 1 container carbs (steel-cut oats) + 1/2 container fruit (berries) + 1 tsp seeds',
      'Lunch: 1 container protein (grilled chicken) + 2 containers vegetables + 1 container carbs (quinoa)',
      'Dinner: 1 container protein (salmon) + 2 containers vegetables + 1 container healthy fat (avocado)',
      'Snack 1: 1 container protein (Greek yoghurt) + 1/2 container fruit',
      'Snack 2: 1 container vegetables (bell peppers) + 1 container dressing (hummus)',
      'Optional treat: 2 dark chocolate squares within seed container'
    ],
    pros: ['Extremely beginner-friendly', 'No tracking apps needed', 'Clear portion guidelines', 'Short 21-day commitment', 'Includes exercise programme'],
    cons: ['Short-term only—not a sustainable lifelong diet', 'Containers can be imprecise for lean individuals', 'Higher carb/processed foods can still "fit"', 'Expensive if buying the official containers'],
    bestFor: 'Complete beginners to nutrition who need a simple, visual starting point. People who find calorie counting overwhelming.',
    provenBy: 'Rolls et al. (2004), PORT trials at Penn State; Lally et al. (2010), habit formation research',
    recommendedProgramTypes: ['stronglifts-5x5', 'greyskull-lp', 'starting-strength', 'fierce-5']
  },
  {
    id: 'whole30',
    name: 'Whole30',
    category: 'fat-loss',
    goal: '30-day elimination diet to reset metabolism and food relationships',
    difficulty: 'intermediate',
    description: 'Created by Melissa Hartwig Urban and Dallas Hartwig, Whole30 is a 30-day elimination diet that removes sugar, alcohol, grains, legumes, dairy, and processed foods. After 30 days, foods are systematically reintroduced to identify sensitivities. While marketed as a "nutritional reset" rather than a weight-loss programme, significant fat loss is a common side effect.',
    scientificBasis: 'The elimination diet model is grounded in clinical immunology—removing common allergens and inflammatory foods for 3–4 weeks before reintroducing to identify triggers. University of Michigan research (2017) showed significant reductions in C-reactive protein and improvements in food-related behaviours after 30 days of whole-foods elimination.',
    whatYouWillGain: 'Reduced inflammation; improved energy; better digestion; identification of food sensitivities; reduced cravings for sugar and processed food; reset taste buds.',
    typicalMacros: { protein: 'Moderate-to-high from meat, fish, eggs', carbs: 'From vegetables and fruit only', fat: 'Moderate-to-high from animal fat, avocado, nuts, oils', calories: 'Not tracked—ad libitum within allowed foods' },
    sampleMeals: [
      'Breakfast: 2-egg omelette with sautéed bell peppers, onions, spinach, and compliant bacon',
      'Lunch: Large salad with 150 g grilled chicken, mixed greens, tomato, cucumber, avocado, olive oil vinaigrette',
      'Dinner: 200 g grilled salmon with roasted sweet potato wedges (coconut oil) and steamed broccoli',
      'Snack: Handful of almonds + 1 apple, or hard-boiled egg, or carrot sticks with compliant guacamole',
      'Beverages: Black coffee, unsweetened tea, sparkling water with lemon',
      'Not allowed: No grains, no dairy, no legumes, no sugar, no alcohol, no processed additives'
    ],
    pros: ['Eliminates ultra-processed foods entirely', 'Clear, strict rules eliminate decision fatigue', 'Identifies food sensitivities via reintroduction', 'Often leads to significant fat loss', 'Improves cooking skills and food literacy'],
    cons: ['Extremely restrictive and socially challenging', '30 days is short—weight regain is common', '"Compliant" processed foods exist (chips, bars)', 'Can promote an unhealthy fixation on "clean" eating', 'Low carbohydrate intake may cause initial fatigue'],
    bestFor: 'People who suspect food sensitivities, want a hard reset on eating habits, or need rigid structure to break processed food addiction.',
    provenBy: 'Hartwig & Hartwig, "It Starts With Food" (2012); University of Michigan elimination diet research (2017)',
    recommendedProgramTypes: ['stronglifts-5x5', 'greyskull-lp', 'starting-strength', 'fierce-5']
  },
  {
    id: 'military-diet',
    name: 'Military Diet (3-Day Cycle)',
    category: 'fat-loss',
    goal: 'Short-term rapid water and fat loss via structured 3-day meal plan',
    difficulty: 'beginner',
    description: 'The Military Diet (not actually affiliated with any military) is a 3-day, low-calorie (~800–1,000 kcal/day) meal plan followed by 4 days of normal eating. It relies on specific food combinations (grapefruit, peanut butter, toast, eggs, coffee) claimed to create a metabolic effect. While the food combination claims are pseudoscience, the severe calorie restriction does produce short-term weight loss, mostly from water.',
    scientificBasis: 'The diet\'s claimed "thermogenic food combinations" have no scientific basis. However, any 800–1,000 kcal protocol will produce acute weight loss via calorie restriction and glycogen depletion. The true mechanism is simply drastic calorie cutting. Research by Krieger et al. (2006) confirms that short-term VLCDs produce rapid initial loss.',
    whatYouWillGain: 'Quick 2–5 kg weight loss in 3 days (mostly water); motivation from rapid scale change; possible jump-start to a longer diet.',
    typicalMacros: { protein: '~50–70 g', carbs: '~80–100 g (from bread, fruit)', fat: '~30–40 g', calories: '~800–1,000 on diet days' },
    sampleMeals: [
      'Day 1 Breakfast: 1/2 grapefruit, 1 slice toast with 2 tbsp peanut butter, 1 cup black coffee',
      'Day 1 Lunch: 1/2 cup tuna, 1 slice toast, black coffee',
      'Day 1 Dinner: 100 g lean meat, 1 cup green beans, 1/2 banana, 1 small apple',
      'Day 2 Breakfast: 1 egg (any style), 1 slice toast, 1/2 banana',
      'Day 2 Lunch: 1 cup cottage cheese, 1 hard-boiled egg, 5 saltine crackers',
      'Day 2 Dinner: 2 hot dogs (no bun), 1 cup broccoli, 1/2 cup carrots, 1/2 banana'
    ],
    pros: ['Very simple 3-day plan', 'Rapid scale results motivate adherents', 'Minimal meal prep needed', 'Short diet breaks reduce burden', 'Inexpensive foods'],
    cons: ['Most weight lost is water, not fat', '"Military" marketing is misleading—not evidence-based', 'Very low nutrition density', 'Unlikely to change long-term habits', 'Severe restriction can cause headaches, fatigue', 'No scientific backing for food combinations'],
    bestFor: 'Individuals wanting a quick "jump-start" before transitioning to a sustainable diet. NOT appropriate as a long-term strategy.',
    provenBy: 'Krieger et al. (2006); weight loss entirely due to calorie restriction',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'south-beach-diet',
    name: 'South Beach Diet (Phases 1, 2, 3)',
    category: 'fat-loss',
    goal: 'Low-glycemic weight loss with phased carbohydrate reintroduction',
    difficulty: 'intermediate',
    description: 'Developed by cardiologist Dr. Arthur Agatston, the South Beach Diet is a low-glycemic eating plan in three phases. Phase 1 (2 weeks) eliminates all grains, fruits, and starchy vegetables to break sugar addiction and insulin resistance. Phase 2 gradually reintroduces low-glycemic carbs. Phase 3 is lifelong maintenance.',
    scientificBasis: 'Rooted in glycemic index research by Dr. David Jenkins (University of Toronto, 1981) and the role of insulin in fat storage. The phased approach addresses insulin resistance before carbohydrate reintroduction, a strategy validated by Shai et al. (2008) in the NEJM.',
    whatYouWillGain: 'Weight loss (5–8 kg in first 2 weeks, mostly water then fat); improved glycemic control; reduced cardiovascular risk markers; learning to choose low-GI carbohydrates.',
    typicalMacros: { protein: 'Moderate-to-high', carbs: 'Very low in Phase 1; increasing in Phase 2', fat: 'Moderate (emphasis on unsaturated)', calories: 'Not explicitly tracked but naturally reduced' },
    sampleMeals: [
      'Phase 1 Breakfast: 2 scrambled eggs with sautéed mushrooms and spinach, 1 slice low-fat cheese',
      'Phase 1 Lunch: Grilled chicken breast over mixed greens with cucumber, bell peppers, vinaigrette',
      'Phase 1 Dinner: 170 g baked salmon with roasted asparagus and cauliflower rice',
      'Phase 1 Snack: 1/4 cup almonds or celery sticks with hummus',
      'Phase 2 adds: 1/2 cup brown rice or quinoa, 1 piece low-GI fruit (berries, apple, pear)',
      'Phase 3: All foods in moderation, continued emphasis on low-GI choices'
    ],
    pros: ['Phased reintroduction teaches tolerance', 'Strong cardiovascular health emphasis', 'No strict calorie counting', 'Can improve blood sugar and cholesterol', 'Many recipes available'],
    cons: ['Phase 1 is very restrictive (no fruit at all)', 'Weight regain common if Phase 3 is abandoned', 'Expensive lean protein emphasis', 'Some healthy foods (watermelon, carrots) initially banned', 'Original versions were too low-fat'],
    bestFor: 'Individuals with metabolic syndrome, pre-diabetes, or type 2 diabetes who need a structured low-glycemic approach with cardiac health benefits.',
    provenBy: 'Dr. Arthur Agatston, "The South Beach Diet" (2003); Shai et al. (2008), NEJM; Jenkins et al. (1981) GI research',
    recommendedProgramTypes: ['stronglifts-5x5', 'greyskull-lp', 'fierce-5', 'couch-to-5k']
  },
  {
    id: 'volumetrics-diet',
    name: 'Volumetrics Diet — Dr. Barbara Rolls',
    category: 'fat-loss',
    goal: 'Fat loss through high-volume, low-energy-density foods',
    difficulty: 'beginner',
    description: 'Developed by Dr. Barbara Rolls at Penn State University, Volumetrics is based on the principle that people tend to eat a consistent weight/volume of food each day regardless of calories. By choosing foods with low energy density (high water/fibre content), you can eat the same volume of food while consuming fewer calories.',
    scientificBasis: 'Dr. Rolls\' research program has conducted over 30 years of research on energy density and satiety. Landmark studies (Rolls et al., 1999; 2004; 2007) demonstrated that reducing the energy density of meals by incorporating vegetables and water reduces calorie intake without increasing hunger.',
    whatYouWillGain: 'Fat loss without hunger; high food volume satisfaction; improved vegetable and fruit intake; long-term eating habits that maintain lower energy density; better nutritional quality.',
    typicalMacros: { protein: 'Moderate (1.2–1.8 g/kg)', carbs: 'Higher from vegetables, fruits, whole grains', fat: 'Moderate (controlled to limit energy density)', calories: 'Naturally reduced through low-density choices' },
    sampleMeals: [
      'Breakfast: Large bowl of oatmeal made with 1 cup oats + 2 cups water/almond milk, topped with 1 cup berries, 1 tbsp chia seeds',
      'Lunch: Large vegetable soup (tomato broth base with carrots, celery, zucchini, beans) + 100 g chicken + side salad',
      'Dinner: 150 g baked white fish over 300 g roasted vegetables (broccoli, cauliflower, bell peppers) + 100 g quinoa',
      'Snack: 3 cups air-popped popcorn, or 2 cups mixed vegetables with 2 tbsp Greek yoghurt dip',
      'Hydration strategy: Water-rich fruits (watermelon, cantaloupe) as snacks',
      'Dessert: 1 cup strawberries with 2 tbsp non-fat whipped cream'
    ],
    pros: ['Very high satiety per calorie', 'No foods forbidden (just adjust portions)', 'Strong scientific foundation from decades of research', 'Improves diet quality automatically', 'Easy to understand concept (eat more volume)'],
    cons: ['Requires significant cooking and prep', 'Dining out is challenging (restaurant portions are dense)', 'Higher-bulk foods can cause bloating initially', 'Less practical for very active or high-calorie individuals', 'Some healthy high-density foods (nuts, seeds) need strict limitation'],
    bestFor: 'Individuals who struggle with hunger on traditional diets. People who prefer large portions. Anyone wanting a research-backed, non-restrictive approach to weight management.',
    provenBy: 'Dr. Barbara Rolls, "The Volumetrics Diet"; Penn State PORT trials (2004–2012); >30 years of energy density research',
    recommendedProgramTypes: ['stronglifts-5x5', 'greyskull-lp', 'fierce-5', 'couch-to-5k', 'gzlp']
  },
  {
    id: 'dash-diet',
    name: 'DASH Diet (Dietary Approaches to Stop Hypertension)',
    category: 'fat-loss',
    goal: 'Lower blood pressure and support healthy weight',
    difficulty: 'beginner',
    description: 'The DASH Diet was developed by the NIH specifically to lower blood pressure without medication. It emphasises fruits, vegetables, whole grains, lean proteins, and low-fat dairy while limiting sodium, saturated fat, and added sugars. While designed for heart health, it naturally supports fat loss due to its emphasis on nutrient-dense, low-calorie-density foods.',
    scientificBasis: 'The DASH diet was validated in landmark multicentre trials funded by the NIH/NHLBI (Appel et al., 1997, NEJM). The original DASH trial showed the diet reduced systolic blood pressure by 11.4 mmHg in hypertensive patients—comparable to single-drug therapy. DASH-Sodium (Sacks et al., 2001) demonstrated additional benefits from sodium restriction.',
    whatYouWillGain: 'Significant blood pressure reduction; improved cardiovascular health; gradual, sustainable weight loss; reduced LDL cholesterol; lower risk of stroke, heart disease, and kidney stones.',
    typicalMacros: { protein: '~18–20% of calories (lean sources)', carbs: '~55–60% (whole grains, fruits, vegetables)', fat: '~25–30% (emphasis on unsaturated)', calories: '~1,600–2,000 (adjusted for weight loss goal)' },
    sampleMeals: [
      'Breakfast: 1 cup oatmeal with 1 cup berries, 1 tbsp flaxseed, 200 ml low-fat milk',
      'Lunch: Spinach salad with 100 g grilled chicken, 1/2 avocado, cherry tomatoes, cucumber, balsamic vinaigrette, 1 whole-wheat pita',
      'Dinner: 120 g baked salmon, 1 cup quinoa, 1 cup steamed broccoli, 1 cup roasted sweet potato, lemon-dill sauce',
      'Snack: 200 ml low-fat Greek yoghurt + 1 apple, or 30 g unsalted almonds + 1 pear',
      'Sodium limit: <2,300 mg/day (~1 tsp salt), ideally <1,500 mg/day',
      'Weekly: 4–5 servings of nuts/seeds/legumes, limited red meat (1–2x/week)'
    ],
    pros: ['#1 ranked overall diet by US News & World Report', 'Proven medical benefits beyond weight loss', 'Flexible and balanced (not extreme)', 'Large body of clinical trial evidence', 'Appropriate for families and children'],
    cons: ['Low-sodium requirement is challenging for eating out', 'Not designed specifically for rapid fat loss', 'Higher carb may not suit everyone', 'Low-fat dairy emphasis is outdated for some', 'Requires significant cooking'],
    bestFor: 'Anyone with hypertension, prehypertension, or a family history of heart disease. Also ideal for general health and weight management without extreme measures.',
    provenBy: 'Appel et al. (1997), NEJM—DASH Collaborative Research Group; Sacks et al. (2001), DASH-Sodium trial; NHLBI/NIH',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp', 'couch-to-5k', 'fierce-5']
  },
  {
    id: 'weight-watchers',
    name: 'Weight Watchers (WW — Points System)',
    category: 'fat-loss',
    goal: 'Weight loss through a commercial points-based tracking system',
    difficulty: 'beginner',
    description: 'WW (formerly Weight Watchers) uses a proprietary "Points" system where foods are assigned point values based on calories, saturated fat, sugar, and protein. Members have a daily and weekly points budget, with a growing list of "ZeroPoint" foods that don\'t count toward the budget. The programme includes coaching and social support community.',
    scientificBasis: 'WW has been the subject of multiple RCTs. Jebb et al. (2011, The Lancet) found that WW participants lost twice as much weight as standard care (6.7 kg vs 2.5 kg at 12 months). Gudzune et al. (2015) systematic review confirmed WW as one of the most effective commercial weight-loss programmes.',
    whatYouWillGain: 'Consistent weight loss (5–10% of body weight in 6 months); structured food tracking; social support for accountability; skills for long-term weight maintenance.',
    typicalMacros: { protein: 'Encouraged (ZeroPoint foods drive higher intake)', carbs: 'Moderate (ZeroPoint fruits/veg increase carb intake)', fat: 'Moderate (points limit high-fat foods)', calories: 'Naturally limited through points budget (~1,200–2,000)' },
    sampleMeals: [
      'Breakfast: 2 eggs (0 points) + 1 slice whole-wheat toast (2 pts) + 1/2 avocado (3 pts)',
      'Lunch: Large salad with 150 g grilled chicken (0 pts), mixed vegetables (0 pts), 2 tbsp light dressing (2 pts)',
      'Dinner: 150 g baked cod (0 pts), 1 cup roasted potatoes (4 pts), 2 cups steamed vegetables (0 pts)',
      'Snack: 200 g Greek yoghurt (0 pts) + 30 g berries (0 pts) + 10 g dark chocolate chips (2 pts)',
      'Weekly treat: Pizza night (budgeted from weekly points)',
      'Daily points target: Typically 23–32 for women, 32–42 for men'
    ],
    pros: ['Strong RCT evidence for efficacy', 'Built-in community support', 'No foods off-limits', 'ZeroPoint list encourages healthy choices', 'Flexible for social occasions (weekly points)'],
    cons: ['Monthly subscription cost', 'Proprietary system—no direct macro education', 'ZeroPoint foods can be overeaten', 'App-dependent tracking', 'Slow weight loss compared to aggressive diets'],
    bestFor: 'People who thrive with peer support and structured accountability. Those who need a commercial framework with proven results rather than self-directed dieting.',
    provenBy: 'Jebb et al. (2011), The Lancet; Gudzune et al. (2015), systematic review; multiple NIH-funded RCTs',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp', 'couch-to-5k']
  },
  {
    id: 'noom',
    name: 'Noom — Psychology-Based Weight Loss',
    category: 'fat-loss',
    goal: 'Weight loss through behaviour change and cognitive restructuring',
    difficulty: 'beginner',
    description: 'Noom is a mobile app-based weight management programme that combines a colour-coded food tracking system (green/yellow/red) with daily psychological lessons drawn from Cognitive Behavioural Therapy (CBT). Unlike traditional diets focused on food rules, Noom targets the underlying behaviours, thoughts, and habits that drive overeating.',
    scientificBasis: 'Noom\'s methodology is grounded in CBT and self-determination theory. Toro-Ramos et al. (2017, JMIR) found that 77.9% of Noom users reported weight loss, and 35% lost >5% of body weight. The colour-coding system is based on energy density research by Rolls & Barnett.',
    whatYouWillGain: 'Weight loss through sustained behaviour change; understanding of emotional eating triggers; long-term habits that persist after the programme; reduced food anxiety; improved relationship with eating.',
    typicalMacros: { protein: 'Encouraged (mostly green/yellow)', carbs: 'Moderate (green = vegetables/fruit, yellow = whole grains)', fat: 'Limited (red category)', calories: 'Set by Noom (~1,200–2,000 based on goal)' },
    sampleMeals: [
      'Green foods (unlimited-ish): Vegetables, fruits (except avocado/coconut), whole grains, non-fat dairy, legumes',
      'Yellow foods (moderate portions): Lean meats, eggs, avocados, nuts, seeds, low-fat cheese',
      'Red foods (limited portions): Red meat, full-fat cheese, butter, oils, processed foods, sweets',
      'Breakfast: Oatmeal (green) with banana (green), topped with 1 tbsp almond butter (yellow)',
      'Lunch: Large salad with grilled chicken (yellow), chickpeas (green), light vinaigrette (yellow)',
      'Dinner: Salmon (yellow), quinoa (green), roasted vegetables (green) with 1 tsp olive oil (red)'
    ],
    pros: ['Strong psychological/behavioural focus', 'Daily lessons build lasting change', 'Colour coding is intuitive', 'Real coaching and group support', 'Addresses root causes of overeating'],
    cons: ['Monthly subscription required', 'Less focus on exercise/macros', 'Colour system can oversimplify nutrition', 'Weight loss is slower than structured diet plans', 'Requires daily phone engagement (screen fatigue)'],
    bestFor: 'Individuals who struggle with emotional eating, binge eating, or the psychological aspects of weight loss. People who want to understand WHY they overeat, not just WHAT to eat.',
    provenBy: 'Toro-Ramos et al. (2017), JMIR; Michaelides et al. (2019); Noom behaviour change model based on CBT research',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp', 'couch-to-5k']
  }
];

// ============================================================
// MUSCLE GAIN / BULKING DIETS (12)
// ============================================================

const muscleGainDiets: DietProgram[] = [
  {
    id: 'lean-bulk',
    name: 'Lean Bulk (200–300 Calorie Surplus)',
    category: 'muscle-gain',
    goal: 'Slow, controlled muscle gain with minimal fat accumulation',
    difficulty: 'intermediate',
    description: 'A conservative calorie surplus of 200–300 kcal/day above maintenance, designed to maximise muscle protein synthesis while minimising fat gain. Preferred by natural lifters who want to stay relatively lean year-round. Protein is set high (1.6–2.2 g/kg), and most calories come from nutrient-dense whole foods.',
    scientificBasis: 'Research by Slater et al. (2019) and Iraki et al. (2020) shows that a modest surplus (200–300 kcal) maximises muscle protein accretion while minimising fat storage. Aragon & Schoenfeld (2020) recommend this approach for natural athletes, as the rate of muscle gain is limited to ~0.25–0.5 kg/week regardless of surplus size.',
    whatYouWillGain: 'Steady lean mass gain (~0.5–1 kg/month); minimal fat accumulation; improved strength without significant body composition changes; maintained cardiovascular fitness during the gaining phase.',
    typicalMacros: { protein: '1.6–2.2 g/kg bodyweight', carbs: '4–5 g/kg (supports training performance)', fat: '0.8–1.0 g/kg', calories: 'TDEE + 200 to +300' },
    sampleMeals: [
      'Breakfast: 3 whole eggs + 1 cup oatmeal + 200 ml milk + 1 tbsp honey + 1 scoop whey protein',
      'Lunch: 200 g chicken breast, 250 g jasmine rice, 100 g avocado, mixed vegetables',
      'Dinner: 200 g lean beef steak, 300 g roasted potatoes, 150 g roasted carrots with butter',
      'Snack 1: 250 g Greek yoghurt + 60 g granola + 100 g mixed berries',
      'Snack 2: 2 rice cakes with 2 tbsp peanut butter + 1 banana + 1 scoop casein protein before bed',
      'Post-workout: 2 scoops whey + 500 ml skim milk + 1 banana'
    ],
    pros: ['Minimal fat gain during mass phase', 'Maintains cardiovascular health', 'Better insulin sensitivity than aggressive bulks', 'Shorter future cutting phases needed', 'Sustainable for long periods (6–12 months)'],
    cons: ['Slower strength progress than larger surpluses', 'Requires precise tracking to stay at +300 not +500', 'Can be frustrating for those wanting faster visual change', 'High protein requirement demands planning'],
    bestFor: 'Natural (non-enhanced) lifters who want to add muscle without significant fat gain. Athletes who compete in weight-class sports or care about maintaining a lean physique year-round.',
    provenBy: 'Slater et al. (2019); Aragon & Schoenfeld (2020); Iraki et al. (2020), JISSN',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp', 'gzlp', 'phul', 'nsuns-lp']
  },
  {
    id: 'traditional-bulk',
    name: 'Traditional Bulk (500 Calorie Surplus)',
    category: 'muscle-gain',
    goal: 'Standard muscle gain at a moderate pace',
    difficulty: 'beginner',
    description: 'The classic "bulking" approach: consume 500 kcal above TDEE each day, with macros split to support training performance and recovery. This surplus provides clear energy for progressive overload while being moderate enough that the resulting fat gain is manageable in a subsequent cutting phase.',
    scientificBasis: 'The 500-calorie surplus recommendation is rooted in sports nutrition literature (Lemon, 2000; Tarnopolsky, 2004). Morton et al. (2018, BJSM) confirmed that energy surplus combined with adequate protein (~1.6 g/kg) produces significant hypertrophy in resistance-trained individuals.',
    whatYouWillGain: 'Reliable muscle gain (~1–1.5 kg/month for beginners); consistent strength increases; clear performance improvement in the gym; moderate fat gain (manageable in a 2–3 month cut).',
    typicalMacros: { protein: '1.6–2.2 g/kg bodyweight', carbs: '4–6 g/kg', fat: '0.8–1.0 g/kg', calories: 'TDEE + 500' },
    sampleMeals: [
      'Breakfast: 4 eggs (scrambled), 2 slices whole-wheat toast with butter, 200 g Greek yoghurt with honey',
      'Lunch: 200 g chicken thigh, 300 g white rice, 100 g steamed broccoli with olive oil',
      'Dinner: 200 g 80/20 ground beef, 2 medium potatoes (mashed with butter), 200 g roasted asparagus',
      'Post-workout shake: 2 scoops whey protein, 500 ml whole milk, 1 banana, 1 tbsp peanut butter',
      'Snack: 200 g cottage cheese + 1 can tuna mixed + 5 rice cakes',
      'Before bed: 1 scoop casein + 250 ml milk + 30 g almonds'
    ],
    pros: ['Clear and simple surplus target', 'Strong strength increases', 'More calorie allowance = greater food flexibility', 'Well-tolerated by most lifters', 'Decades of practical success'],
    cons: ['Inevitable fat gain (~30–50% of weight gain is fat)', 'Requires a subsequent cut period', 'Higher body fat may reduce insulin sensitivity', 'Can encourage overeating "dirty" foods'],
    bestFor: 'Beginners wanting their first serious mass phase. Anyone who has been under-eating and needs a clear surplus target. Natural lifters comfortable with a subsequent cut.',
    provenBy: 'Lemon (2000); Tarnopolsky (2004); Morton et al. (2018), BJSM',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp', 'gzlp', 'nsuns-lp', 'phul']
  },
  {
    id: 'dirty-bulk',
    name: 'Dirty Bulk (Aggressive Surplus)',
    category: 'muscle-gain',
    goal: 'Maximum mass and strength gain with minimal food restrictions',
    difficulty: 'beginner',
    description: 'The "dirty bulk" involves a large calorie surplus (800–1,500+ kcal above TDEE) with minimal attention to food quality—the goal is to eat as much as possible to drive maximum weight gain and strength. Foods are typically calorie-dense: fast food, whole milk, ice cream, pizza. While effective for strength gain, the trade-off is significant fat accumulation.',
    scientificBasis: 'The dirty bulk operates on the principle that a larger energy surplus creates a more anabolic environment through increased insulin, IGF-1, and mTOR signalling (Drummond et al., 2009). However, Garthe et al. (2013) showed that aggressive surpluses lead to disproportionately more fat gain without additional muscle accretion once the surplus exceeds ~500–700 kcal.',
    whatYouWillGain: 'Maximum strength numbers (especially on the scale); rapid total body weight increase; significant calorie allowance allows complete social freedom; no food restrictions.',
    typicalMacros: { protein: '2.0–2.5 g/kg', carbs: '5–8 g/kg', fat: '1.0–1.5 g/kg', calories: 'TDEE + 800 to +1,500+' },
    sampleMeals: [
      'Breakfast: 4 eggs + 3 slices bacon + 3 pancakes with syrup + 500 ml whole milk',
      'Lunch: Double cheeseburger + large fries + milkshake',
      'Dinner: 300 g pasta with meat sauce + garlic bread + 500 ml whole milk',
      'Snack 1: 500 ml whole milk + 2 scoops protein + 2 tbsp peanut butter + 1 banana (1,000 cal shake)',
      'Snack 2: 200 g mixed nuts + 2 protein bars + 1 chocolate bar',
      'Before bed: 250 g cottage cheese + 2 tbsp honey + 1 scoop casein'
    ],
    pros: ['Fastest possible strength gains', 'No food restrictions or tracking needed', 'Very satisfying for the eater', 'Maximum calorie allowance', 'Effective for "hardgainers" who struggle to eat enough'],
    cons: ['Significant fat gain (60–70% of weight gain may be fat)', 'Longer cutting phases needed', 'Can impair cardiovascular health and insulin sensitivity', 'Often leads to lethargy and poor sleep', 'May encourage poor long-term habits'],
    bestFor: 'Hardgainers with extremely high metabolisms who cannot gain weight on moderate surpluses. Off-season powerlifters and strongmen prioritising strength over aesthetics.',
    provenBy: 'Empirical bodybuilding tradition; Garthe et al. (2013); Drummond et al. (2009) on anabolic signalling',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'smolov', 'westside-barbell', '531', 'conjugate-method']
  },
  {
    id: 'gomad',
    name: 'GOMAD (Gallon of Milk a Day)',
    category: 'muscle-gain',
    goal: 'Rapid weight gain for underweight lifters through full-fat milk supplementation',
    difficulty: 'beginner',
    description: 'GOMAD is exactly what it sounds like: drink one gallon (3.78 litres) of whole milk per day on top of your regular diet. Originally popularised by Mark Rippetoe (Starting Strength), it is designed exclusively for young, underweight males who cannot gain weight through conventional eating. The gallon adds ~2,400 calories, 120 g protein, 180 g carbs, and 120 g fat daily. Temporary intervention (6–12 weeks).',
    scientificBasis: 'Milk is recognised as one of the most effective post-exercise nutritional interventions due to its optimal casein:whey ratio, calcium content, and insulinotropic properties (Elliot et al., 2006). Hartman et al. (2007) showed that milk consumption after resistance training produced greater muscle hypertrophy than soy or carbohydrate-based drinks.',
    whatYouWillGain: 'Rapid total body weight gain (10–20 kg in 6–12 weeks); significant strength increases; improved bone density from calcium and vitamin D; simplified "bulking" through a single high-calorie addition.',
    typicalMacros: { protein: '~180–220 g (120 from milk + food)', carbs: '~400–500 g', fat: '~150–200 g', calories: 'TDEE + ~2,400 (from milk alone)' },
    sampleMeals: [
      'Base diet: Eat all normal meals as usual (breakfast, lunch, dinner, snacks)',
      'Plus: 1 gallon (3.78 L) whole milk consumed throughout the day',
      'Suggested schedule: 500 ml with each meal + 500 ml post-workout + remainder between meals',
      'Example breakfast with GOMAD: 4 eggs, 3 slices bacon, 1 cup oatmeal + 500 ml whole milk',
      'Example lunch: 2 sandwiches with meat/cheese, chips, fruit + 500 ml whole milk',
      'Example dinner: 250 g pasta with meat sauce, garlic bread, vegetables + 500 ml whole milk'
    ],
    pros: ['Extremely effective for underweight gain', 'Simple—just add milk to existing diet', 'Cheap relative to other high-calorie strategies', 'Milk has proven muscle-building properties', 'Temporary intervention (not a lifestyle)'],
    cons: ['~60–70% of weight gain is fat', 'Very high lactose load = digestive distress', 'Environmentally impactful (1 gallon milk/day)', 'Can cause acne in susceptible individuals', 'Not suitable for lactose intolerance', 'Expensive if milk prices are high'],
    bestFor: 'Underweight (<18.5 BMI) young males (18–25 years) who have tried and failed to gain weight on structured diets. A temporary intervention for "hardgainers" under coaching supervision.',
    provenBy: 'Mark Rippetoe, "Starting Strength" (2005); Elliot et al. (2006); Hartman et al. (2007), AJCN',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp', 'gzlp']
  },
  {
    id: 'rp-mass-diet',
    name: 'Renaissance Periodization (RP) Mass Diet',
    category: 'muscle-gain',
    goal: 'Phased muscle gain using periodised nutrition templates',
    difficulty: 'intermediate',
    description: 'Developed by Dr. Mike Israetel and the RP team, the RP Mass Diet uses structured, periodised nutrition templates that adjust macronutrients daily based on training variables (volume, intensity, frequency). Carbohydrates are higher on training days and lower on rest days. The diet progresses through 4-week "mesocycles" with incremental surplus adjustments.',
    scientificBasis: 'RP\'s methodology is based on "mesocycle" periodisation applied to nutrition—matching energy and carbohydrate availability to training demand (Slater & Phillips, 2011; Morton et al., 2018). Daily fluctuating macros optimise muscle protein synthesis when it matters most—around training sessions.',
    whatYouWillGain: 'Well-controlled muscle gain with less fat accumulation than traditional bulking; optimal training performance due to strategic carb timing; structured mesocycle progression; clear stopping points.',
    typicalMacros: { protein: '1.8–2.2 g/kg bodyweight', carbs: '4–6 g/kg on training days, 2–3 g/kg on rest days', fat: '0.5–0.8 g/kg', calories: 'TDEE + 300 to +500 (training day), TDEE (rest day)' },
    sampleMeals: [
      'Training day breakfast: 3 eggs, 1 cup oatmeal with maple syrup, 200 ml milk',
      'Training day lunch (pre-workout): 200 g chicken, 300 g white rice, 1 banana',
      'Training day dinner (post-workout): 200 g salmon, 200 g white potato, steamed vegetables',
      'Rest day breakfast: 3 eggs, 100 g sweet potato, spinach sautéed in coconut oil',
      'Rest day dinner: 200 g beef steak, 150 g roasted vegetables, 50 g avocado',
      'Evening snack: 200 g Greek yoghurt + 1 scoop casein (same regardless of day)'
    ],
    pros: ['Training day carbs maximise performance', 'Rest day restriction minimises fat gain', 'Structured 4-week mesocycles', 'Very detailed guidance and templates', 'Backed by sports nutrition PhDs'],
    cons: ['Complex daily macro adjustments', 'Requires RP app or templates (paid)', 'May be too structured for casual lifters', 'High carb on training days may cause bloating', 'Not designed for advanced athletes nearing genetic limits'],
    bestFor: 'Intermediate to advanced natural lifters who want to maximise muscle gain while minimising fat. Anyone comfortable with structured, periodised approaches.',
    provenBy: 'Dr. Mike Israetel, Renaissance Periodization; Morton et al. (2018); Slater & Phillips (2011)',
    recommendedProgramTypes: ['phul', 'phat', 'nsuns-lp', '531-bbb', 'juggernaut-method', 'gzcl-method']
  },
  {
    id: 'vertical-diet-mass',
    name: 'Vertical Diet for Mass — Stan Efferding',
    category: 'muscle-gain',
    goal: 'Maximum mass gain with optimal digestion',
    difficulty: 'intermediate',
    description: 'The mass-gain version of the Vertical Diet scales up portions aggressively to achieve a large calorie surplus while maintaining digestive comfort. The "Monster Mash" (rice/beef/egg mixture) and "Microwave Scramble" make high-volume eating more manageable. Efferding emphasises "horizontal" expansion—eating more of the same vertical foundation rather than adding variety.',
    scientificBasis: 'Same as standard Vertical Diet, with added emphasis on total energy flux. Athletes with high energy throughput (high intake matched by high expenditure) have better nutrient partitioning (Bullough et al., 1995; Melby et al., 2017).',
    whatYouWillGain: 'Rapid mass gain with good digestive tolerance; high energy availability for intense training; simplified high-volume eating; maintained micronutrient status even at high calories.',
    typicalMacros: { protein: '2.0–2.5 g/kg bodyweight', carbs: '6–8 g/kg (primarily white rice, potatoes)', fat: '1.0–1.5 g/kg', calories: 'TDEE + 500 to +1,000' },
    sampleMeals: [
      'Breakfast: 200 g ground beef + 400 g white rice + 4 whole eggs + 250 ml orange juice',
      'Lunch (Monster Mash): 250 g ground beef mixed with 500 g white rice + 2 whole eggs',
      'Dinner: 300 g ribeye steak + 400 g white rice + 200 g buttered carrots',
      'Snack: 500 ml whole milk + 1 scoop whey + 1 banana + 2 tbsp almond butter',
      'Microwave Scramble: 6 eggs, 200 g ground beef, 200 g white rice (microwaved together)',
      'Before bed: 250 g cottage cheese + 2 tbsp honey'
    ],
    pros: ['Excellent digestive tolerance at high volumes', 'Simple, repeatable meals', 'Very high micronutrient density', 'Supports elite-level training', '"Monster Mash" is a proven mass-building tool'],
    cons: ['Extremely high food cost (lots of meat)', 'Very monotonous', 'High red meat intake concerns', 'Not suitable for vegetarians', 'Requires significant meal prep time'],
    bestFor: 'Serious strength athletes, powerlifters, and strongmen needing to gain weight while maintaining digestive comfort and high training performance.',
    provenBy: 'Stan Efferding (2018); Hafthor Björnsson\'s 2018 World\'s Strongest Man prep',
    recommendedProgramTypes: ['starting-strength', '531', 'smolov', 'westside-barbell', 'conjugate-method']
  },
  {
    id: 'anabolic-diet',
    name: 'The Anabolic Diet',
    category: 'muscle-gain',
    goal: 'Muscle gain through carb cycling and hormonal optimisation',
    difficulty: 'intermediate',
    description: 'Created by Dr. Mauro Di Pasquale, the Anabolic Diet cycles 5–6 days of low-carb, moderate-protein, high-fat intake followed by 1–2 days of high-carb "refeeds." The theory is that sustained low-carb days increase fat adaptation and growth hormone levels, while carb-load days replenish glycogen and drive muscle protein synthesis.',
    scientificBasis: 'Di Pasquale\'s protocol draws on research showing that low-carbohydrate states increase growth hormone pulsatility (Harber et al., 2005), while carbohydrate refeeding restores glycogen and induces an anabolic spike in insulin and mTOR signalling. Schoenfeld & Aragon (2015) noted theoretical basis for strategic carbohydrate periodisation in advanced trainees.',
    whatYouWillGain: 'Muscle gain with lower average carbohydrate intake; improved metabolic flexibility; fat loss concurrently with lean mass (in some); better appetite control from higher fat intake.',
    typicalMacros: { protein: '2.0–2.5 g/kg bodyweight', carbs: '<30 g/day on low-carb days; 400–600 g on refeed days', fat: '60–70% of calories on low-carb days', calories: 'TDEE + 300 (surplus across the week)' },
    sampleMeals: [
      'Low-carb day — Breakfast: 4 eggs fried in butter, 3 slices bacon, 1/2 avocado',
      'Low-carb day — Lunch: 200 g chicken thigh with skin, large salad with olive oil dressing',
      'Low-carb day — Dinner: 250 g ribeye steak, 200 g asparagus with hollandaise sauce',
      'Refeed day — Breakfast: 1 cup oatmeal, 4 eggs, 2 slices toast with jam, 1 banana',
      'Refeed day — Lunch: 200 g chicken, 400 g white rice, 1 apple',
      'Refeed day — Dinner: 200 g lean beef, 500 g potatoes, steamed vegetables'
    ],
    pros: ['Clear carb cycling structure', 'High satiety from fat intake', 'Can combine muscle gain with fat loss (recomposition)', 'GH and glycogen cycling may benefit advanced athletes', 'Strong appetite control'],
    cons: ['Very low carbohydrate for half the week = performance limitations', 'Complex planning', 'Refeed days can cause bloating', 'Not suitable for high-volume training', 'Limited modern research support'],
    bestFor: 'Experienced lifters who have plateaued on conventional bulking and want to try carb cycling. Individuals who respond well to higher fat intakes.',
    provenBy: 'Dr. Mauro Di Pasquale, "The Anabolic Diet" (1995); Harber et al. (2005); Schoenfeld & Aragon (2015)',
    recommendedProgramTypes: ['531', 'phul', 'conjugate-method', 'phat', 'nsuns-lp']
  },
  {
    id: 'kevin-levrone-diet',
    name: 'Kevin Levrone Diet (High-Protein, Moderate-Carb)',
    category: 'muscle-gain',
    goal: 'High-quality muscle gain with extremely high protein intake',
    difficulty: 'intermediate',
    description: 'Based on the eating approach of legendary bodybuilder Kevin Levrone, this diet emphasises very high protein intake (2.5–3.0 g/kg bodyweight), moderate carbohydrates timed around training, and moderate fat. Levrone maintained an impressive physique while eating high-volume, protein-centred whole-food meals.',
    scientificBasis: 'Levrone\'s practical approach aligns with research showing that protein intakes up to 3.0 g/kg can enhance body composition in resistance-trained individuals (Bandegan et al., 2017; Antonio et al., 2015). While optimal intake for most is 1.6–2.2 g/kg, higher intakes may benefit advanced athletes with high TDEE.',
    whatYouWillGain: 'High-quality lean mass; excellent protein utilisation and recovery; maintained leanness even during mass phase; strong training performance from balanced macronutrient intake.',
    typicalMacros: { protein: '2.5–3.0 g/kg bodyweight', carbs: '3–4 g/kg (mostly around training)', fat: '0.5–0.8 g/kg', calories: 'TDEE + 200 to +400' },
    sampleMeals: [
      'Breakfast: 6 egg whites + 2 whole eggs + 1 cup oatmeal + 200 g Greek yoghurt',
      'Meal 2: 200 g chicken breast, 200 g brown rice, 100 g broccoli',
      'Meal 3 (pre-workout): 200 g lean beef, 250 g sweet potato, 1 tbsp olive oil',
      'Post-workout shake: 2 scoops whey isolate + 1 scoop dextrose + 500 ml water',
      'Meal 5: 250 g turkey breast, 200 g quinoa, mixed vegetables',
      'Meal 6: 250 g cottage cheese or 2 scoops casein before bed'
    ],
    pros: ['Very high protein supports maximum recovery', 'Maintains leanness well', 'Balanced approach, not extreme', 'High satiety from protein', 'Proven by one of the best physiques in bodybuilding history'],
    cons: ['Very expensive (large amounts of lean meat)', 'High protein can cause digestive issues', 'Very frequent eating (6 meals/day)', 'May exceed optimal protein for natural lifters'],
    bestFor: 'Experienced bodybuilders and advanced lifters who want to maximise protein intake for recovery and lean mass maintenance.',
    provenBy: 'Kevin Levrone (IFBB Hall of Fame); Antonio et al. (2015), JISSN; Bandegan et al. (2017)',
    recommendedProgramTypes: ['phul', 'phat', 'nsuns-lp', '531-bbb', 'german-volume-training']
  },
  {
    id: 'ultimate-diet-20',
    name: 'Ultimate Diet 2.0 — Lyle McDonald',
    category: 'muscle-gain',
    goal: 'Cyclical refeeding protocol for muscle gain with minimal fat',
    difficulty: 'advanced',
    description: 'Lyle McDonald\'s Ultimate Diet 2.0 (UD2.0) is a highly structured, week-long protocol cycling through phases of depletion, loading, and maintenance. Days 1–4 involve low-carb, low-calorie depletion. Days 5–6 are carb-loading phases for glycogen supercompensation. Day 7 is maintenance. Aims for simultaneous muscle gain and fat loss—recomposition.',
    scientificBasis: 'Built on glycogen supercompensation (Bergström & Hultman, 1966) and the observation that muscle cells become more anabolically sensitive after glycogen depletion. The depletion phase increases GLUT4 translocation and insulin sensitivity, making the subsequent carb load more effective at driving nutrients into muscle.',
    whatYouWillGain: 'Simultaneous muscle gain and fat loss (recomposition); dramatic glycogen supercompensation (full, round muscles); improved insulin sensitivity; advanced understanding of carbohydrate periodisation.',
    typicalMacros: { protein: '2.0–2.5 g/kg (all phases)', carbs: '<30 g (depletion), 500–700 g (loading), maintenance (other days)', fat: 'Variable per phase', calories: '1,200–1,500 (depletion), 3,500–4,000 (loading), maintenance' },
    sampleMeals: [
      'Depletion phase (Mon–Wed): Very low carb, moderate protein—similar to PSMF meals',
      'Loading phase (Thu–Fri): 500–700 g carbs from high-glycemic sources—white rice, potatoes, dextrose, fruit juice',
      'Loading day breakfast: 1 cup oatmeal + 4 eggs + 2 slices toast + 500 ml juice',
      'Loading day lunch: 200 g chicken + 400 g white rice + 2 bananas',
      'Loading day dinner: 200 g lean beef + 500 g potatoes + 200 g sweet potato',
      'Maintenance day: Moderate macros, maintenance calories'
    ],
    pros: ['Potential for simultaneous gain/loss recomposition', 'Dramatic visual effect from glycogen loading', 'Scientifically grounded protocol', 'Clear, structured weekly template', 'Advanced tool for experienced dieters'],
    cons: ['Extremely complex scheduling', 'Severe depletion phase is very difficult', 'Bloating during carb loading', 'Requires precise exercise-diet synchronisation', 'Not sustainable as a permanent approach'],
    bestFor: 'Advanced natural bodybuilders wanting recomposition. Best for those with low body fat who want to gain muscle without additional fat.',
    provenBy: 'Lyle McDonald, "The Ultimate Diet 2.0" (2005); Bergström & Hultman (1966)',
    recommendedProgramTypes: ['phul', 'nsuns-lp', 'phat', '531-bbb', 'juggernaut-method']
  },
  {
    id: 'carb-backloading',
    name: 'Carb Backloading — John Kiefer',
    category: 'muscle-gain',
    goal: 'Muscle gain with fat loss by restricting carbs until evening',
    difficulty: 'intermediate',
    description: 'Created by John Kiefer, Carb Backloading (CBL) involves eating almost zero carbohydrates during the day, then consuming the majority of daily carbs after training in the evening. Kiefer theorises that avoiding carbs during the day when insulin sensitivity is lower reduces fat storage, while post-training carbs drive muscle glycogen replenishment.',
    scientificBasis: 'Draws on circadian biology—insulin sensitivity follows a diurnal rhythm (Poggiogalle et al., 2018). CBL reverses this by keeping carbs for evening training. Also draws on exercise-induced increase in insulin sensitivity via GLUT4 translocation lasting 2–4 hours post-training (Richter & Hargreaves, 2013).',
    whatYouWillGain: 'Improved body composition (muscle gain with fat loss); better appetite control from daytime fats; improved energy stability through the day; increased metabolic flexibility.',
    typicalMacros: { protein: '2.0–2.5 g/kg bodyweight', carbs: '<30 g during day; 300–500 g post-training in evening', fat: 'Moderate-to-high during day', calories: 'TDEE ± 0 (recomposition) or TDEE + 300 (gain)' },
    sampleMeals: [
      'Morning/Afternoon (no carbs): 4 eggs + 3 slices bacon + 1/2 avocado',
      'Lunch: 200 g chicken thigh, large salad with olive oil, 1/2 avocado, cheese',
      'Pre-workout (late afternoon): 1 scoop protein + 1 tbsp peanut butter + black coffee',
      'Post-workout Feast (evening): 200 g lean steak, 400 g white rice, 200 g sweet potato, 1 banana',
      'Late evening: 200 g Greek yoghurt + honey + 1 scoop casein, or ice cream (Kiefer recommends it!)',
      'Hydration: Black coffee/tea during day, water + electrolytes'
    ],
    pros: ['Recomposition potential (gain muscle/lose fat)', 'Daytime appetite control from fats', 'Socially flexible evenings', 'Well-supported by circadian biology', 'Includes treats (ice cream) in the plan'],
    cons: ['Performance may suffer for morning trainers', 'Evening carb load can disrupt sleep in some', 'Complex timing requirements', 'Very low daytime carbs are hard for some', 'Limited direct clinical research'],
    bestFor: 'Evening trainers who want recomposition and don\'t mind eating most carbs at night. Good for those who prefer savoury daytime eating.',
    provenBy: 'John Kiefer, "Carb Backloading" (2011); Richter & Hargreaves (2013); Poggiogalle et al. (2018)',
    recommendedProgramTypes: ['531', 'phul', 'nsuns-lp', 'conjugate-method', 'phat']
  },
  {
    id: 'eat-to-perform',
    name: 'Eat to Perform',
    category: 'muscle-gain',
    goal: 'Performance-driven eating with carbohydrate periodisation',
    difficulty: 'intermediate',
    description: 'Eat to Perform (ETP) is a coaching system using day-to-day training performance as the primary driver of carbohydrate intake. If performance increases, carbs stay or increase. If performance drops, carbs decrease. The diet emphasises "real food"—meat, potatoes, vegetables, eggs, and fruit—minimising processed foods.',
    scientificBasis: 'Based on the principle that carbohydrate needs are individual and dynamic. By using training performance as feedback, carbohydrate intake auto-regulates to match actual metabolic demand—a practical application of energy availability concepts (Loucks et al., 2011). Real food emphasis aligns with Katz & Meller (2014).',
    whatYouWillGain: 'Optimised training performance through individualised carb timing; body recomposition; improved relationship with food (eat for performance, not appearance); flexibility responsive to daily training demands.',
    typicalMacros: { protein: '2.0–2.5 g/kg bodyweight', carbs: 'Variable—determined by training performance feedback', fat: '0.5–1.0 g/kg', calories: 'Variable—determined by performance-driven carb intake' },
    sampleMeals: [
      'Breakfast: 3 eggs, 200 g russet potato (home fries), 1 tbsp butter, 1 apple',
      'Lunch: 200 g chicken thigh, 300 g roasted potatoes, mixed vegetables',
      'Dinner: 200 g beef steak, 200 g sweet potato, steamed broccoli with butter',
      'Post-workout: 2 scoops protein + 1 banana + 200 ml milk',
      'Snack: 200 g cottage cheese + 100 g berries + handful almonds',
      'Higher performance day addition: Extra 100–200 g carbohydrate sources at dinner'
    ],
    pros: ['Performance-based feedback is highly effective', 'Removes emotional eating triggers', 'Simple real-food guidelines', 'Flexible and adaptable day-to-day', 'Builds awareness of training-nutrition connection'],
    cons: ['No fixed template—requires coaching/guidance', 'Difficult for beginners who don\'t track performance', 'Potato/meat centric—can be monotonous', 'High cost for pasture-raised preferences'],
    bestFor: 'Performance-focused athletes (CrossFit, powerlifting, strongman, team sports) who want nutrition to directly support training output.',
    provenBy: 'Jared Schempf & Andy T., Eat to Perform (2015); Loucks et al. (2011) on energy availability',
    recommendedProgramTypes: ['juggernaut-method', '531', 'phul', 'starting-strength', 'westside-barbell', 'cube-method']
  },
  {
    id: 'seefood-diet',
    name: 'Seefood Diet ("See Food, Eat It")',
    category: 'muscle-gain',
    goal: 'Maximum weight gain with zero dietary restriction',
    difficulty: 'beginner',
    description: 'A humorous but commonly used term for an approach where individuals eat any and all food they see, with no restrictions. Essentially an extreme dirty bulk. Popularised by internet meme culture and old-school bodybuilders, characterised by frequent meals and zero attention to food quality beyond "eat big to get big."',
    scientificBasis: 'The only scientific basis is the fundamental energy balance equation—if you eat significantly more than you burn, you will gain weight. Garthe et al. (2013) clearly demonstrates that aggressive surpluses produce disproportionately more fat than muscle.',
    whatYouWillGain: 'Maximum rate of body weight gain; dramatic strength improvements from increased total mass; complete dietary freedom; simplicity (no tracking, no rules).',
    typicalMacros: { protein: 'Variable (not tracked)', carbs: 'Variable (not tracked)', fat: 'Variable (not tracked)', calories: 'Maximum possible (>>TDEE)' },
    sampleMeals: [
      'Breakfast: Stack of pancakes + 4 eggs + sausages + 500 ml whole milk',
      'Mid-morning: Protein bar + pastry + coffee with cream',
      'Lunch: Large fast food combo meal (burger + fries + shake)',
      'Afternoon snack: 2 PB&J sandwiches + crisps + 500 ml milk',
      'Dinner: Large pasta portion with meat sauce + garlic bread + 3 slices pizza',
      'Before bed: Bowl of ice cream with protein powder mixed in + 500 ml milk'
    ],
    pros: ['Maximum weight gain possible', 'Zero mental energy spent on food decisions', 'Socially easy (eat anything at any event)', 'Cheap (any food, any restaurant)'],
    cons: ['Extreme fat gain (~70% of weight gain is fat)', 'Terrible for cardiovascular health', 'Promotes poor long-term eating habits', 'Expensive in the long run', 'Can cause severe digestive distress', 'No micronutrient optimisation'],
    bestFor: 'Hardgainers who cannot gain weight no matter what they eat. A temporary (2–4 week) break from restrictive dieting. NOT recommended as a serious nutritional strategy.',
    provenBy: 'Bodybuilding folklore; energy balance equation',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'smolov', 'greyskull-lp']
  }
];

// ============================================================
// KETO / LOW-CARB DIETS (12)
// ============================================================

const ketoLowCarbDiets: DietProgram[] = [
  {
    id: 'standard-keto',
    name: 'Standard Ketogenic Diet (SKD)',
    category: 'keto',
    goal: 'Nutritional ketosis with <50 g carbs/day',
    difficulty: 'intermediate',
    description: 'The SKD restricts carbohydrate intake to <50 g/day, providing roughly 70–80% of calories from fat, 15–25% from protein, and 5–10% from carbohydrates. This severe carb restriction induces nutritional ketosis—elevated blood ketone bodies that serve as an alternative fuel source. SKD is the most studied ketogenic protocol.',
    scientificBasis: 'Developed in 1921 by Dr. Russell Wilder at Mayo Clinic for epilepsy (Wilder, 1921). Modern research by Volek & Phinney (2012) demonstrated keto-adapted athletes can utilise fat at ~1.5 g/min versus ~0.5 g/min in carb-adapted. Hall et al. (2016, AJCN) showed carb restriction increases energy expenditure compared to fat restriction.',
    whatYouWillGain: 'Rapid initial weight loss (water + fat); reduced appetite and hunger; improved insulin sensitivity and blood glucose control; stable energy without carb crashes; mental clarity for some; elevated blood ketones (0.5–3.0 mM).',
    typicalMacros: { protein: '1.2–2.0 g/kg lean mass', carbs: '<50 g total (ideally <20 g net)', fat: '70–80% of total calories', calories: 'Any goal (deficit, maintenance, or surplus on keto)' },
    sampleMeals: [
      'Breakfast: 3-egg omelette with cheese, bacon, and avocado cooked in butter',
      'Lunch: Large spinach salad with 200 g grilled chicken, 1/2 avocado, blue cheese dressing, bacon bits',
      'Dinner: 200 g salmon with butter sauce, roasted asparagus with hollandaise, cauliflower rice',
      'Snack: Macadamia nuts, cheese crisps, celery with almond butter, or half avocado',
      'Dessert: Keto cheesecake (almond flour crust, cream cheese, erythritol) or 90% dark chocolate',
      'Beverages: Black coffee, unsweetened tea, water with electrolytes (sodium, potassium, magnesium)'
    ],
    pros: ['Very effective for rapid initial fat loss', 'Excellent appetite suppression', 'Proven therapeutic use (epilepsy, type 2 diabetes)', 'Improves blood lipids (HDL up, TG down)', 'Steady energy without carb crashes'],
    cons: ['Very restrictive—hard to maintain socially', 'Keto flu during adaptation (1–2 weeks)', 'Performance may drop for high-intensity exercise', 'Risk of electrolyte imbalances', 'Long-term safety data limited'],
    bestFor: 'Individuals with type 2 diabetes or metabolic syndrome seeking improved glycemic control. Those who respond well to fat-based energy.',
    provenBy: 'Wilder (1921), Mayo Clinic; Volek & Phinney (2012); Hall et al. (2016), AJCN',
    recommendedProgramTypes: ['starting-strength', '531', 'conjugate-method', 'smolov']
  },
  {
    id: 'targeted-keto',
    name: 'Targeted Ketogenic Diet (TKD)',
    category: 'keto',
    goal: 'Ketosis with strategic pre/post-workout carbs for training performance',
    difficulty: 'intermediate',
    description: 'TKD adds small amounts of fast-digesting carbohydrates (15–30 g) around workouts to SKD. These "targeted" carbs are timed 30–60 minutes before training to fuel high-intensity exercise without kicking you out of ketosis, as the carbs are burned during training. Popularised by Lyle McDonald.',
    scientificBasis: 'Based on the principle that exogenous glucose before high-intensity exercise improves performance by providing substrate for glycolysis, which ketones cannot fuel rapidly (Phinney, 2004). The small carb dose is preferentially used during exercise and does not disrupt ketosis long-term.',
    whatYouWillGain: 'Maintained ketosis while supporting higher training intensity; better workout performance than SKD; glycogen replenishment for training recovery; appetite suppression of keto with improved training capacity.',
    typicalMacros: { protein: '1.5–2.0 g/kg lean mass', carbs: '<30 g/day + 15–30 g pre/post-workout', fat: '65–75% of calories', calories: 'Set per goal' },
    sampleMeals: [
      'Pre-workout (30 min before): 20–30 g fast carbs (dextrose, gummy bears, white rice, or half banana)',
      'Post-workout (within 30 min): 1 scoop protein + water (optional: 10–15 g additional carbs)',
      'Breakfast: 3-egg omelette with cheese, mushroom, 1/2 avocado',
      'Lunch: 200 g chicken thigh, large salad with olive oil dressing, 1/4 cup almonds',
      'Dinner: 200 g ribeye steak, roasted broccoli with butter, cauliflower mash',
      'Snack: Cheese crisps, macadamia nuts, celery with almond butter'
    ],
    pros: ['Better training performance than SKD', 'Still maintains most keto benefits', 'Flexible around training schedule', 'Allows some carb variety', 'Good balance for active keto dieters'],
    cons: ['Still requires carb tracking and timing', 'Easy to over-consume and exit ketosis', 'Not suitable for those who train multiple times daily', 'Digestive issues with pre-workout carbs possible', 'Requires experimentation to find carb threshold'],
    bestFor: 'Keto-adapted athletes who train at moderate-to-high intensity and need performance support. Bodybuilders, CrossFitters, and strength athletes who want keto benefits without losing training capacity.',
    provenBy: 'Lyle McDonald, "The Ketogenic Diet" (2003); Phinney (2004); Volek & Phinney (2012)',
    recommendedProgramTypes: ['531', 'juggernaut-method', 'phul', 'conjugate-method', 'cube-method']
  },
  {
    id: 'cyclical-keto',
    name: 'Cyclical Ketogenic Diet (CKD)',
    category: 'keto',
    goal: 'Carb cycling with 5–6 days keto + 1–2 days high-carb refeed',
    difficulty: 'advanced',
    description: 'CKD alternates between 5–6 days of strict keto and 1–2 days of high-carbohydrate refeeding. The carb-load phase is designed to replenish glycogen stores, restore hormone levels (especially leptin), and maintain metabolic flexibility. Primarily used by athletes and bodybuilders needing periodic glycogen restoration.',
    scientificBasis: 'Builds on glycogen supercompensation research (Bergström & Hultman, 1966) and the role of carbohydrates in restoring leptin levels (Boden et al., 1996). The cyclical approach attempts to combine metabolic benefits of ketosis with periodic hormonal and performance advantages of carbohydrate replenishment.',
    whatYouWillGain: 'Fat loss benefits of keto with better training performance; glycogen supercompensation on refeed days; hormonal restoration (leptin, thyroid); metabolic flexibility; improved long-term adherence via carb breaks.',
    typicalMacros: { protein: '1.5–2.0 g/kg (all days)', carbs: '<30 g on keto days; 400–600 g on refeed days', fat: 'High on keto days; low on refeed days', calories: 'Set per goal (often deficit on keto, maintenance/surplus on refeed)' },
    sampleMeals: [
      'Keto day — Breakfast: 3 eggs + cheese + avocado',
      'Keto day — Lunch: 200 g chicken thigh + broccoli with butter sauce',
      'Keto day — Dinner: 200 g beef steak + asparagus + cauliflower mash',
      'Refeed day — Breakfast: 1 cup oatmeal + 4 eggs + 2 slices toast + 1 banana',
      'Refeed day — Lunch: 200 g chicken + 400 g white rice + apple',
      'Refeed day — Dinner: 200 g lean beef + 500 g potatoes + steamed vegetables'
    ],
    pros: ['Best of both worlds (keto + carbs)', 'Restores performance on refeed days', 'Leptin/thyroid support', 'Better adherence for carb lovers', 'Can be designed for recomposition'],
    cons: ['Very complex scheduling', 'Refeed days cause bloating and weight fluctuation', 'Transitioning in/out of ketosis weekly is challenging', 'Risk of overeating on refeed days', 'Not suitable for pure keto therapeutic use'],
    bestFor: 'Advanced fitness enthusiasts and athletes who want keto benefits for fat loss but need periodic glycogen restoration for training performance.',
    provenBy: 'Lyle McDonald, "The Ketogenic Diet" (2003); Bergström & Hultman (1966); Boden et al. (1996)',
    recommendedProgramTypes: ['phul', '531', 'nsuns-lp', 'phat', 'juggernaut-method']
  },
  {
    id: 'lazy-keto',
    name: 'Lazy Keto',
    category: 'keto',
    goal: 'Weight loss through carbohydrate restriction only (no macro tracking)',
    difficulty: 'beginner',
    description: 'Lazy Keto is a simplified keto version where the only rule is to eat fewer than 20–50 g of carbs per day. No calorie counting, no fat macros, no protein targets. Simply avoid carbohydrate-rich foods and eat until satisfied from remaining food groups. Popular as an entry-level keto approach.',
    scientificBasis: 'Carbohydrate restriction naturally reduces calorie intake by eliminating hyper-palatable, energy-dense processed foods (Hall et al., 2016). Simply cutting carbs reduces calorie intake by 300–800 kcal/day for most people. However, lack of protein tracking can lead to muscle loss (Phillips, 2014).',
    whatYouWillGain: 'Weight loss without detailed tracking; introduction to a low-carb lifestyle; reduced appetite from ketosis; simplified eating decisions.',
    typicalMacros: { protein: 'Not tracked (potential issue)', carbs: '<20–50 g (only rule)', fat: 'Not tracked (naturally high)', calories: 'Not tracked (spontaneously reduced)' },
    sampleMeals: [
      'Breakfast: 3 eggs + 3 slices bacon + 1/2 avocado',
      'Lunch: Bunless cheeseburger with lettuce wrap + side salad',
      'Dinner: 200 g baked chicken thigh + roasted vegetables with olive oil',
      'Snack: Handful of almonds + string cheese, or pork rinds + guacamole',
      'Dessert: Sugar-free Jell-O with whipped cream',
      'Beverages: Black coffee, diet soda, sparkling water'
    ],
    pros: ['Simplest way to start keto', 'No tracking or apps needed', 'Mental freedom from numbers', 'Still produces ketosis and appetite suppression', 'Good introduction for beginners'],
    cons: ['Easy to overeat calories on high-fat foods', 'Protein inadequacy common → muscle loss', 'No micronutrient tracking → potential deficiencies', 'May stall after initial weight loss', 'Lazy tracking = lazy results for many'],
    bestFor: 'Beginners curious about keto who would be overwhelmed by strict tracking. People who want to test low-carb eating before committing to full keto.',
    provenBy: 'Hall et al. (2016); community-based extension of SKD principles',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'clean-keto',
    name: 'Clean Keto (Whole-Food Ketogenic)',
    category: 'keto',
    goal: 'Nutritional ketosis with whole, unprocessed foods',
    difficulty: 'intermediate',
    description: 'Clean Keto applies the same ratios as SKD but sources all food from whole, minimally processed options. No "keto processed foods"—no sugar-free candy, diet sodas, keto bars. Foods are grass-fed meats, pastured eggs, wild-caught fish, organic vegetables, nuts, seeds, and healthy oils.',
    scientificBasis: 'Combines metabolic benefits of carbohydrate restriction with well-established health advantages of whole-food diets (Katz & Meller, 2014). Avoids artificial sweeteners\' negative effects (Suez et al., 2014) and industrial seed oils. Emphasis on omega-3-rich foods supports anti-inflammatory potential.',
    whatYouWillGain: 'Nutritional ketosis with superior nutrient quality; reduced exposure to processed ingredients; anti-inflammatory benefits from whole-food fat sources; potential gut health improvements.',
    typicalMacros: { protein: '1.2–2.0 g/kg from quality sources', carbs: '<50 g (from vegetables only, no grains/fruit)', fat: '70–80% (animal fats, avocado, coconut, olive oil)', calories: 'Set per goal' },
    sampleMeals: [
      'Breakfast: 3 pastured eggs fried in ghee, 1/2 avocado, sautéed spinach',
      'Lunch: Wild-caught salmon over mixed greens with olive oil, avocado, pumpkin seeds',
      'Dinner: Grass-fed ribeye steak, roasted Brussels sprouts with bacon fat, cauliflower mash',
      'Snack: Handful of macadamia nuts, celery with almond butter, bone broth',
      'Fat sources: Avocado, coconut oil, cold-pressed olive oil, grass-fed butter, ghee',
      'No: Diet soda, sugar-free candy, keto processed bars, industrial seed oils'
    ],
    pros: ['Highest nutritional quality of any keto approach', 'No artificial sweeteners or processed ingredients', 'Strong anti-inflammatory potential', 'Superior micronutrient and omega-3 intake', 'Aligns with environmental sustainability'],
    cons: ['Very expensive (grass-fed, wild-caught, organic)', 'Extremely restrictive food choices', 'Socially difficult (no restaurants are truly "clean keto")', 'Requires extensive cooking and prep', 'No different from SKD in achieving ketosis'],
    bestFor: 'Health-conscious individuals prioritising food quality who are willing to invest significantly in sourcing.',
    provenBy: 'Volek & Phinney (2012); Katz & Meller (2014); Suez et al. (2014) on artificial sweeteners',
    recommendedProgramTypes: ['starting-strength', '531', 'greyskull-lp', 'smolov']
  },
  {
    id: 'dirty-keto',
    name: 'Dirty Keto (Convenience/Processed Keto)',
    category: 'keto',
    goal: 'Weight loss through carb restriction using convenient processed low-carb foods',
    difficulty: 'beginner',
    description: 'Dirty Keto achieves ketosis by eating any food that fits the low-carb macro profile, regardless of quality. Bunless fast-food burgers, pork rinds, processed cheese, diet soda, sugar-free candy, keto bars, microwave bacon. Only priority is staying under 20–50 g of carbs.',
    scientificBasis: 'From a purely biochemical standpoint, Dirty Keto produces ketosis identically to Clean Keto—energy metabolism doesn\'t distinguish between "clean" and "dirty" fat sources for ketone production. However, processed meats and artificial ingredients have established negative health effects (Micha et al., 2010; Srour et al., 2019).',
    whatYouWillGain: 'Weight loss through ketosis with minimal cooking/meal prep; low barrier to entry; ability to maintain keto while travelling or eating out; no nutrient obsession.',
    typicalMacros: { protein: 'Variable (often adequate from meat/cheese)', carbs: '<20–50 g', fat: 'High (often from processed sources)', calories: 'Variable (often spontaneously reduced)' },
    sampleMeals: [
      'Breakfast: Sausage patties + processed cheese slices + black coffee',
      'Lunch: Bunless double cheeseburger + side salad + diet soda',
      'Dinner: Pepperoni + cream cheese roll-ups, pork rinds with queso, sugar-free Jell-O',
      'Snacks: Pork rinds, processed cheese sticks, keto bars, diet energy drinks',
      'Fast food options: Bunless burgers, chicken wings (unbreaded), salad bowls without croutons',
      'Dessert: Sugar-free ice cream or keto candy'
    ],
    pros: ['Extremely convenient, no cooking required', 'Low cost of entry (fast food is cheap)', 'Easy to maintain while travelling', 'Still produces ketosis and weight loss', 'Satisfies "junk food" cravings while on diet'],
    cons: ['Very low micronutrient density', 'High in processed meats and industrial seed oils', 'Linked to increased inflammation', 'Very low fibre intake', 'Does not build healthy long-term habits', 'High sodium from processed foods'],
    bestFor: 'People who want to lose weight on keto but cannot or will not cook. Short-term use for those transitioning to clean keto. NOT recommended as a long-term health strategy.',
    provenBy: 'Micha et al. (2010); Srour et al. (2019); biochemical principle of ketosis',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5']
  },
  {
    id: 'atkins-20',
    name: 'Atkins 20 (Phase 1: Induction)',
    category: 'low-carb',
    goal: 'Rapid weight loss through strict carb restriction and phased reintroduction',
    difficulty: 'intermediate',
    description: 'Atkins 20 starts with a strict induction phase of 20 g net carbs/day for at least 2 weeks. Subsequent phases gradually increase carbs in 5 g increments as goal weight approaches. Created by Dr. Robert Atkins in the 1970s, one of the first popular low-carb diets.',
    scientificBasis: 'Initially controversial but later validated by multiple RCTs. The A TO Z Weight Loss Study (Gardner et al., 2007, JAMA) found Atkins produced more weight loss than Zone, Ornish, or LEARN diets. Shai et al. (2008) demonstrated Atkins superior to low-fat diets at 2 years.',
    whatYouWillGain: 'Rapid initial weight loss; structured phased reintroduction teaches carb tolerance; reduced triglycerides and increased HDL; improved blood sugar control; clear progression milestones.',
    typicalMacros: { protein: 'Moderate-to-high (unlimited in Phase 1)', carbs: 'Phase 1: 20 g net; Phase 2: 25–50 g; Phase 3: 50–80 g', fat: 'High (unrestricted)', calories: 'Not explicitly tracked' },
    sampleMeals: [
      'Phase 1 Breakfast: 3 eggs scrambled in butter with cheese and spinach',
      'Phase 1 Lunch: 200 g grilled chicken with bacon, lettuce, tomato, and ranch dressing',
      'Phase 1 Dinner: 200 g salmon with dill butter sauce, asparagus with hollandaise',
      'Phase 1 Snacks: Celery with cream cheese, 1/4 cup almonds, cheese cubes',
      'Phase 1 treats: Sugar-free Jell-O, diet soda, coffee with heavy cream',
      'Phase 4 (maintenance): Normal low-glycemic eating, avoiding refined carbs'
    ],
    pros: ['Strong clinical trial evidence', 'Clear phased system', 'High satiety from protein/fat', 'Long-standing track record (50+ years)', 'Supportive community'],
    cons: ['Phase 1 is very restrictive', 'Can be high in saturated fat', 'Requires diligence on net carb counting', 'Fruit very limited in early phases', 'Bad reputation from early "unlimited bacon" claims'],
    bestFor: 'Individuals wanting a structured low-carb diet with a proven track record and clinical evidence.',
    provenBy: 'Dr. Robert Atkins (1972); Gardner et al. (2007), JAMA; Shai et al. (2008), NEJM',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'atkins-40',
    name: 'Atkins 40',
    category: 'low-carb',
    goal: 'Moderate low-carb weight loss for individuals with less weight to lose',
    difficulty: 'beginner',
    description: 'Atkins 40 is a more moderate version for individuals with less weight to lose (typically <18 kg). It starts at 40 g net carbs/day rather than 20 g, allowing more vegetable and fruit flexibility from the beginning while maintaining the phased reintroduction structure.',
    scientificBasis: 'Based on the same evidence as Atkins 20 (Gardner et al., 2007; Shai et al., 2008) but recognises individuals with less weight to lose may not need the extreme induction phase. Moderate carb restriction (50–100 g/day) still produces significant metabolic benefits.',
    whatYouWillGain: 'Weight loss with more dietary flexibility than Atkins 20; less severe "low-carb flu"; more fruit and vegetable variety from the start; easier transition to maintenance.',
    typicalMacros: { protein: 'Moderate-to-high', carbs: 'Phase 1: 40 g net; Phases 2–4: gradual increase', fat: 'Moderate-to-high', calories: 'Not explicitly tracked' },
    sampleMeals: [
      'Phase 1 Breakfast: 2-egg omelette with cheese, mushrooms, 1/2 avocado',
      'Phase 1 Lunch: Large chicken caesar salad (no croutons), 1/4 cup berries for dessert',
      'Phase 1 Dinner: 150 g steak, roasted broccoli, 1/2 cup roasted butternut squash',
      'Phase 1 Snacks: 1/4 cup almonds, 1/2 apple with peanut butter, cheese cubes',
      'Phase 1 allows: Berries, melon, nuts, seeds, more vegetables than Atkins 20',
      'Phase 4: Full maintenance with all food groups in appropriate portions'
    ],
    pros: ['More carb flexibility from day 1', 'Better fruit and vegetable variety', 'Easier adherence for many people', 'Still produces weight loss and metabolic improvements', 'Good for those with less weight to lose'],
    cons: ['Slower initial weight loss than Atkins 20', 'Some may not enter ketosis at 40 g carbs', 'Later phases may cause weight regain if not careful', 'Less structured for those needing strict rules'],
    bestFor: 'People with 5–18 kg to lose who want a moderate low-carb approach and more vegetable/fruit flexibility.',
    provenBy: 'Atkins Nutritionals (2013); based on Atkins 20 evidence',
    recommendedProgramTypes: ['stronglifts-5x5', 'greyskull-lp', 'starting-strength']
  },
  {
    id: 'paleo-keto',
    name: 'Paleo Keto (Keto + Paleo Principles)',
    category: 'keto',
    goal: 'Achieve ketosis using only Paleo-approved whole foods',
    difficulty: 'intermediate',
    description: 'Paleo Keto combines keto macronutrient ratios with Paleo food quality guidelines (no grains, legumes, dairy, processed foods). No cheese, no dairy fat sources—fat comes from animal fats (tallow, lard), avocado, coconut, olive oil, and nuts. The most restrictive common dietary approach.',
    scientificBasis: 'Combines metabolic ketosis research (Volek & Phinney, 2012) with evolutionary health framework (Cordain et al., 2005). May offer synergistic anti-inflammatory benefits, as both approaches independently reduce inflammatory markers (Paoli et al., 2013; Jönsson et al., 2009).',
    whatYouWillGain: 'Deep nutritional ketosis with maximally anti-inflammatory food choices; avoidance of dairy and grain-related sensitivities; very high nutrient density; potential autoimmune benefit.',
    typicalMacros: { protein: '1.5–2.0 g/kg lean mass (from meat/fish/eggs)', carbs: '<30 g (from vegetables only)', fat: '70–80% (animal fats, avocado, coconut, olive oil)', calories: 'Set per goal' },
    sampleMeals: [
      'Breakfast: 3 pastured eggs fried in tallow, 1/2 avocado, sautéed kale in coconut oil',
      'Lunch: 200 g grilled wild salmon, large salad with olive oil, macadamia nuts, cucumber',
      'Dinner: 200 g grass-fed ribeye, roasted Brussels sprouts in duck fat, cauliflower mash',
      'Snack: Handful Brazil nuts, celery with guacamole, bone broth',
      'Fats allowed: Grass-fed tallow, lard, schmaltz, coconut oil, avocado oil, olive oil',
      'Not allowed: All grains, legumes, dairy (including butter), soy, processed foods, seed oils'
    ],
    pros: ['Highest food quality standards', 'Avoids all common allergens (dairy, grains, soy)', 'Potential anti-inflammatory synergy', 'Excellent for micronutrients', 'Suitable for autoimmune protocols'],
    cons: ['Extremely restrictive (arguably the most restrictive diet)', 'Very expensive', 'Dairy fat sources removal makes keto harder', 'Socially impossible for most settings', 'Low calcium intake (no dairy)', 'Limited research on the specific combination'],
    bestFor: 'Individuals with autoimmune conditions, dairy intolerance, and grain sensitivities who also want metabolic benefits of ketosis.',
    provenBy: 'Volek & Phinney (2012); Cordain et al. (2005); Paoli et al. (2013)',
    recommendedProgramTypes: ['starting-strength', '531', 'smolov']
  },
  {
    id: 'keto-vegan',
    name: 'Keto Vegan (Vegan Ketogenic Diet)',
    category: 'keto',
    goal: 'Achieve nutritional ketosis on a vegan diet',
    difficulty: 'advanced',
    description: 'Combines extreme carb restriction of keto (20–50 g/day) with complete absence of animal products. Very challenging because most vegan protein sources are high in carbohydrates. Relies on coconut products, avocado, nuts, seeds, low-carb vegetables, and vegan protein isolates.',
    scientificBasis: 'Research is limited but theoretically possible. The primary challenge is adequate protein without exceeding carb limits. Soy and pea protein isolates are exceptions. Tóth et al. (2016) case series showed vegan keto can produce ketosis and weight loss, but protein adequacy is a concern.',
    whatYouWillGain: 'Ketosis while adhering to vegan ethics; fat loss; improved blood sugar control; high phytonutrient and fibre intake from vegetables and seeds.',
    typicalMacros: { protein: '1.2–1.8 g/kg (challenging on vegan keto)', carbs: '<30 g net (from non-starchy vegetables, small berries)', fat: '70–80% (coconut, avocado, nuts, seeds, oils)', calories: 'Set per goal' },
    sampleMeals: [
      'Breakfast: Tofu scramble with coconut oil, spinach, nutritional yeast, and 1/2 avocado',
      'Lunch: Large salad with avocado, hemp seeds, pumpkin seeds, cucumber, bell peppers, olive oil dressing',
      'Dinner: Zucchini noodles with pesto (basil, pine nuts, olive oil, nutritional yeast) + 100 g baked tofu',
      'Snacks: Coconut chips, macadamia nuts, celery with avocado, olives, seaweed snacks',
      'Protein sources: Tofu, tempeh (limited), pea protein isolate, hemp seeds, nutritional yeast',
      'Fat sources: Coconut oil, MCT oil, avocado, olive oil, macadamia oil, seed butters'
    ],
    pros: ['Allows vegans to achieve ketosis', 'High intake of healthy fats and phytonutrients', 'Ethically aligned for plant-based eaters', 'High fibre intake', 'Potential for very high micronutrient variety'],
    cons: ['Extremely challenging to meet protein needs', 'Very low food variety', 'Risk of protein deficiency and muscle loss', 'Soy and gluten-free protein sources expensive', 'Very socially restrictive', 'Limited research on long-term safety'],
    bestFor: 'Vegans committed to ketosis for metabolic or therapeutic reasons. NOT for beginners or those new to either diet.',
    provenBy: 'Tóth et al. (2016); theoretical framework based on SKD principles',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'zero-carb-carnivore',
    name: 'Zero Carb / Carnivore Diet',
    category: 'keto',
    goal: 'Eliminate all plant foods and eat exclusively animal products',
    difficulty: 'advanced',
    description: 'The Carnivore Diet removes all plant foods and consumes only animal products—meat, fish, eggs, and (depending on version) dairy. Carbohydrate intake is effectively zero. Popularised by Dr. Shawn Baker, based on the theory that plant toxins contribute to chronic health issues.',
    scientificBasis: 'Limited clinical research but growing anecdotal reports. All essential nutrients can be obtained from animal products (especially with organ meats). O\'Hearn (2020) reported improvement in autoimmune symptoms in self-reported carnivore dieters. Clemens & Bier (2021) note long-term effects are unknown. Produces deep ketosis.',
    whatYouWillGain: 'Deep, consistent nutritional ketosis; complete elimination of plant-based allergens/irritants; simplified eating (meat, water, salt); improved satiety; potential autoimmune symptom relief; stable blood glucose.',
    typicalMacros: { protein: '20–35% of calories', carbs: '0 g (all animal products have zero/trace carbs)', fat: '65–80% of calories', calories: 'Ad libitum (appetite-driven)' },
    sampleMeals: [
      'Breakfast: 4 eggs fried in butter + 3 slices bacon',
      'Lunch: 300 g ground beef patties with cheddar cheese (optional)',
      'Dinner: 300 g ribeye steak cooked in butter, 6 sardines as starter',
      'Snacks: Beef jerky, hard-boiled eggs, bone broth, pork rinds',
      'Variation includes: Organ meats (liver, heart, kidney) for micronutrient density',
      'Beverages: Water, black coffee (some exclude coffee), salt water for electrolytes'
    ],
    pros: ['Extreme simplicity', 'Complete elimination of plant allergens', 'Deep and stable ketosis', 'Very high satiety', 'Anecdotal relief from autoimmune and digestive issues', 'No counting or measuring needed'],
    cons: ['Almost no clinical research', 'Very low in vitamin C (theoretical concern)', 'Zero fibre (gut microbiome implications)', 'Extremely socially restrictive', 'Very expensive (quality meat)', 'High environmental impact', 'Potential for excessive saturated fat'],
    bestFor: 'Individuals with severe autoimmune conditions, chronic digestive issues (IBD, SIBO), or multiple food sensitivities who have exhausted other approaches.',
    provenBy: 'Dr. Shawn Baker, "The Carnivore Diet" (2019); O\'Hearn (2020); Clemens & Bier (2021)',
    recommendedProgramTypes: ['starting-strength', '531', 'smolov']
  },
  {
    id: 'keto-mediterranean',
    name: 'Ketogenic Mediterranean Diet',
    category: 'keto',
    goal: 'Ketosis with heart-healthy Mediterranean fat sources',
    difficulty: 'intermediate',
    description: 'Combines very low carb intake of standard keto with heart-healthy Mediterranean fat sources. Fat shifts from butter/cream toward olive oil, fish, nuts, seeds, and avocado. Red meat is used more sparingly. Aims for ketosis while capturing cardiovascular and longevity benefits of Mediterranean eating.',
    scientificBasis: 'Paoli et al. (2013) demonstrated ketogenic Mediterranean diet with olive oil as primary fat produced significant weight loss and cardiovascular improvements. Shai et al. (2008) showed low-carb Mediterranean superior to low-fat diets at 2 years. Combines ketosis with PREDIMED trial benefits (Estruch et al., 2018).',
    whatYouWillGain: 'Ketosis with superior cardiovascular risk profile; high monounsaturated fat and omega-3 intake; anti-inflammatory benefits; reduced LDL compared to standard keto; improved long-term health markers.',
    typicalMacros: { protein: '1.2–2.0 g/kg (from fish, poultry, moderate red meat)', carbs: '<50 g (from vegetables, small legumes)', fat: '65–75% (olive oil, nuts, fish, avocado)', calories: 'Set per goal' },
    sampleMeals: [
      'Breakfast: 3 eggs scrambled in olive oil with tomato, olives, and spinach',
      'Lunch: Large Greek salad with 150 g grilled sardines, olive oil dressing, feta (if tolerated)',
      'Dinner: 200 g wild salmon with lemon-herb olive oil sauce, roasted aubergine and courgette',
      'Snack: Handful of walnuts and macadamia nuts, olives, 1/2 avocado',
      'Fat sources: Extra-virgin olive oil (primary), nuts, seeds, avocado, fatty fish',
      'Moderate: Red wine (1 glass, if desired—counts toward carb limit)'
    ],
    pros: ['Combines best of two well-studied diets', 'Superior cardiovascular profile vs standard keto', 'Highest omega-3 of any keto variant', 'Rich in polyphenols and antioxidants', 'May be more sustainable than standard keto'],
    cons: ['Higher carb allowance may prevent ketosis in some', 'Expensive (good olive oil, fish)', 'Moderate dairy conflicts with clean keto', 'Less total fat flexibility than standard keto'],
    bestFor: 'Individuals who want metabolic benefits of ketosis but are concerned about cardiovascular implications of high saturated fat intake.',
    provenBy: 'Paoli et al. (2013); Shai et al. (2008), NEJM; Estruch et al. (2018), NEJM (PREDIMED)',
    recommendedProgramTypes: ['starting-strength', '531', 'greyskull-lp', 'cube-method']
  }
];

// ============================================================
// PLANT-BASED DIETS (10)
// ============================================================

const plantBasedDiets: DietProgram[] = [
  {
    id: 'wfpb-forks-over-knives',
    name: 'Whole Food Plant-Based (WFPB)',
    category: 'plant-based',
    goal: 'Health optimisation through a whole-food, plant-exclusive diet',
    difficulty: 'beginner',
    description: 'Popularised by "Forks Over Knives" and Dr. T. Colin Campbell, excludes all animal products and processed foods. Centres on vegetables, fruits, whole grains, legumes, nuts, seeds. Low fat (no added oils), moderate protein (from plants), high carbohydrate. A health-focused approach distinct from ethical veganism.',
    scientificBasis: 'Based on Campbell\'s China Study (2005) and Esselstyn (1999) showing WFPB diet reversed coronary artery disease in 82% of compliant patients. Ornish et al. (1998, JAMA) demonstrated coronary atherosclerosis regression with very low-fat vegetarian diets.',
    whatYouWillGain: 'Significant cardiovascular risk reduction; weight loss without calorie counting; high fibre (40–60 g/day); increased phytonutrient consumption; improved digestive health; potential heart disease reversal.',
    typicalMacros: { protein: '10–15% of calories', carbs: '70–80% (from whole plant sources)', fat: '<10% of calories (no added oils)', calories: 'Ad libitum (naturally limited by fibre)' },
    sampleMeals: [
      'Breakfast: Oatmeal with berries, ground flaxseed, and unsweetened almond milk',
      'Lunch: Large lentil soup with carrots, celery, onion, kale, and quinoa',
      'Dinner: Black bean tacos on corn tortillas with salsa, guacamole, lettuce, pico de gallo',
      'Snacks: Carrot sticks with hummus, apple with almond butter, handful of almonds',
      'Hydration: Water, herbal tea, no caloric beverages',
      'NOT allowed: All animal products, all processed foods, all added oils, refined grains'
    ],
    pros: ['Very strong research base for heart disease reversal', 'High fibre intake', 'Very low environmental impact', 'High phytonutrient density', 'Associated with longevity in observational studies', 'No portion control needed'],
    cons: ['Very restrictive (no animal products, no oils)', 'Very low fat may cause hormonal issues', 'Difficult to eat out', 'Significant cooking required', 'May be low in B12, iron, zinc, DHA', 'Very high carb problematic for some metabolic types'],
    bestFor: 'Individuals with or at high risk for cardiovascular disease. Those prioritising longevity and environmental impact.',
    provenBy: 'Campbell, "The China Study" (2005); Esselstyn (1999); Ornish et al. (1998), JAMA',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'vegan-bodybuilding',
    name: 'Vegan Bodybuilding Diet',
    category: 'plant-based',
    goal: 'Muscle gain on a completely plant-based diet',
    difficulty: 'intermediate',
    description: 'Designed for resistance-trained vegan athletes. Emphasises high-protein vegan sources (soy, seitan, tempeh, peas, hemp, pumpkin seeds) and strategic supplementation (B12, iron, zinc, vitamin D, EPA/DHA algae oil). Same calorie/macro targets as conventional bodybuilding nutrition but requires more planning.',
    scientificBasis: 'Hevia-Larraín et al. (2021, JISSN) found soy-based whole food protein supported comparable muscle gain to animal protein over 12 weeks. Monteyne et al. (2020) showed mycoprotein stimulates muscle protein synthesis similarly to animal protein.',
    whatYouWillGain: 'Muscle gain on a vegan diet; high carbohydrate intake for training performance; high fibre and phytonutrient intake; alignment with ethical vegan values; improved blood lipid profiles.',
    typicalMacros: { protein: '1.6–2.2 g/kg bodyweight (varied plant sources)', carbs: '4–6 g/kg (grains, legumes, fruits)', fat: '0.8–1.2 g/kg (nuts, seeds, avocado, oils)', calories: 'TDEE + 300 to +500' },
    sampleMeals: [
      'Breakfast: 1 cup oatmeal + 2 tbsp peanut butter + 1 scoop pea protein + 1 banana + 200 ml soy milk',
      'Lunch: 200 g firm tofu stir-fry with quinoa, broccoli, bell peppers, sesame seeds, tamari sauce',
      'Dinner: 200 g seitan steak with 250 g sweet potato, kale sautéed in coconut oil',
      'Post-workout shake: 2 scoops pea/rice protein blend + 500 ml soy milk + 1 banana + 1 tbsp flax oil',
      'Snack 1: 200 g edamame + 1 apple + 30 g almonds',
      'Snack 2: 200 g soy yoghurt + 30 g hemp seeds + 100 g berries'
    ],
    pros: ['Allows ethical vegans to build muscle effectively', 'High carb intake supports training', 'Excellent fibre and phytonutrient intake', 'Better cardiovascular markers than meat-based bulking', 'Growing research support'],
    cons: ['Requires careful planning to meet protein needs', 'Very high food volume can cause digestive discomfort', 'Higher cost for plant protein supplements', 'Needs B12, DHA/EPA supplementation', 'Less leucine per calorie than animal protein'],
    bestFor: 'Vegans who want to maximise muscle growth and training performance. Transitioning from standard diet to vegan bodybuilding.',
    provenBy: 'Hevia-Larraín et al. (2021), JISSN; Monteyne et al. (2020)',
    recommendedProgramTypes: ['phul', 'phat', 'nsuns-lp', 'german-volume-training', 'gzlp']
  },
  {
    id: 'plant-based-athlete',
    name: 'Plant-Based Athlete Diet',
    category: 'plant-based',
    goal: 'High-performance plant-based eating for athletes',
    difficulty: 'intermediate',
    description: 'Formalised by vegan bodybuilder Robert Cheeke and dietitian Matt Ruscigno in "The Plant-Based Athlete." Provides structured guidelines for vegan athletes across all sports. Emphasises calorie sufficiency, strategic protein intake (1.2–2.0 g/kg), and nutrient timing around training.',
    scientificBasis: 'Key findings: plant protein supports comparable performance when total intake is adequate (Pinckaers et al., 2021); carbohydrate periodisation needs adjustment for vegan athletes (higher volume needed); micronutrient concerns require proactive management (Ruscigno, 2017).',
    whatYouWillGain: 'Athletic performance on fully plant-based diet; structured sports nutrition guidance; adequate protein and energy for training demands; nutrient timing protocols for competition; long-term health benefits.',
    typicalMacros: { protein: '1.4–2.0 g/kg bodyweight', carbs: '5–8 g/kg (performance-dependent)', fat: '0.8–1.2 g/kg (whole plant sources)', calories: 'TDEE + 200 to +500 (depending on sport)' },
    sampleMeals: [
      'Pre-training breakfast: 1 cup oatmeal + 1 scoop pea protein + 1 banana + 2 tbsp peanut butter',
      'Post-training lunch: 200 g tempeh, 300 g brown rice, 200 g roasted vegetables',
      'Dinner: Lentil bolognese over whole-wheat pasta with nutritional yeast',
      'Snacks: Trail mix, protein shake, fruit, veggie sticks with hummus',
      'High-calorie additions: Avocado, nut butters, seeds, dried fruit, coconut milk',
      'Key supplementation: B12, vitamin D, DHA/EPA algae oil, iron (if deficient)'
    ],
    pros: ['Specifically designed for athletes', 'Clear, actionable guidelines', 'Backed by registered dietitians', 'Performance-focused, not just weight loss', 'Comprehensive nutrient timing guidance'],
    cons: ['High food volume can be uncomfortable', 'Requires significant planning', 'Supplement-dependent (B12, DHA/EPA)', 'Higher cost for quality plant proteins', 'Dining while travelling is challenging'],
    bestFor: 'Vegan and vegetarian athletes who want performance-optimised nutrition.',
    provenBy: 'Cheeke & Ruscigno, "The Plant-Based Athlete" (2021); Pinckaers et al. (2021)',
    recommendedProgramTypes: ['phul', 'phat', 'nsuns-lp', 'juggernaut-method', '531']
  },
  {
    id: 'nutritarian-diet',
    name: 'Nutritarian Diet — Dr. Joel Fuhrman',
    category: 'plant-based',
    goal: 'Maximum micronutrient density per calorie for longevity',
    difficulty: 'intermediate',
    description: 'Built around the ANDI (Aggregate Nutrient Density Index) scoring system. Emphasises G-BOMBS (Greens, Beans, Onions, Mushrooms, Berries, Seeds). Strictly limits animal products, oils, and processed foods. Fuhrman recommends 90%+ of calories from nutrient-dense plants.',
    scientificBasis: 'Based on epidemiological data showing nutrient-dense food intake correlates with lower chronic disease (Hung et al., 2004). Fuhrman (2011) published clinical outcomes showing significant weight loss and cardiovascular improvements.',
    whatYouWillGain: 'High micronutrient intake; weight loss without calorie counting; reduced chronic disease risk; increased longevity markers; improved immune function; reduced inflammation.',
    typicalMacros: { protein: '10–15% (beans, greens, seeds)', carbs: '70–80% (vegetables, fruits, beans, grains)', fat: '10–15% (seeds, nuts, avocado)', calories: 'Not explicitly limited (naturally controlled by density)' },
    sampleMeals: [
      'Breakfast: Giant green smoothie (kale, spinach, berries, banana, flax seeds, unsweetened almond milk)',
      'Lunch: Large salad with mixed greens, chickpeas, shredded carrots, tomato, onion, sunflower seeds, oil-free dressing',
      'Dinner: Lentil vegetable soup with kale, carrots, celery, onion, and spices, served over shredded greens',
      'Snack: Apple with walnuts, or raw vegetables with black bean dip',
      'G-BOMBS daily: Greens, Beans, Onions, Mushrooms, Berries, Seeds',
      'NOT allowed: All oils, dairy, eggs, meat (minimal allowance in transition)'
    ],
    pros: ['Highest nutrient density of any diet', 'Clear ANDI scoring system', 'Strong emphasis on disease prevention', 'Can reverse heart disease and hypertension', 'High food volume = high satiety'],
    cons: ['Extremely restrictive', 'Very low fat—can cause hormonal issues', 'Socially difficult in every context', 'Requires extensive cooking and prep', 'No oils make cooking difficult', 'B12, DHA, iron deficiency risk'],
    bestFor: 'Individuals focused on longevity and disease prevention willing to adopt very restrictive nutrient-maximising approach.',
    provenBy: 'Dr. Joel Fuhrman, "Eat to Live" (2011); Hung et al. (2004)',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'vegetarian-keto',
    name: 'Vegetarian Keto (Lacto-Ovo Ketogenic)',
    category: 'plant-based',
    goal: 'Achieve ketosis on a lacto-ovo vegetarian diet',
    difficulty: 'intermediate',
    description: 'Follows standard keto macros while restricting meat and fish but allowing eggs, dairy, and plant foods. Fat sources include butter, cream, cheese, eggs, avocado, coconut, nuts, seeds. Protein from eggs, dairy, tofu, tempeh, seitan, and plant powders. Eggs and dairy make this much easier than vegan keto.',
    scientificBasis: 'Merra et al. (2017) found a vegetarian ketogenic diet produced significant weight loss and metabolic improvements over 12 weeks. The lacto-ovo approach solves the protein adequacy problem of vegan keto.',
    whatYouWillGain: 'Nutritional ketosis without eating meat; adequate protein via eggs and dairy; high satiety from dairy-based keto meals; better calcium intake than standard keto.',
    typicalMacros: { protein: '1.2–2.0 g/kg (eggs, dairy, soy, seitan)', carbs: '<30–50 g (vegetables, limited berries)', fat: '70–80% (dairy, eggs, avocado, nuts, oils)', calories: 'Set per goal' },
    sampleMeals: [
      'Breakfast: 3-egg cheese omelette cooked in butter with 1/2 avocado',
      'Lunch: Large spinach salad with feta, hard-boiled eggs, walnuts, avocado, olive oil dressing',
      'Dinner: Baked halloumi with roasted aubergine, courgette, and pesto',
      'Snack: Full-fat Greek yoghurt with macadamia nuts, celery with cream cheese',
      'Protein boost: Tofu scramble, seitan steak, tempeh bacon, protein shake with almond milk',
      'Dessert: Sugar-free cheesecake (almond flour crust, cream cheese, erythritol)'
    ],
    pros: ['Much easier than vegan keto (eggs and dairy)', 'Adequate protein is achievable', 'Higher satiety from dairy fats', 'Better calcium intake than standard keto', 'Appealing for cheese lovers'],
    cons: ['Still restrictive compared to standard vegetarian', 'High dairy may cause issues for some', 'Low plant diversity if cheese-heavy', 'Expensive (good cheese, eggs, nuts)', 'Moderate environmental impact'],
    bestFor: 'Vegetarians who want to try keto without eating meat. Individuals who tolerate dairy well.',
    provenBy: 'Merra et al. (2017); Volek & Phinney (2012)',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'flexitarian-diet',
    name: 'Flexitarian Diet (Semi-Vegetarian)',
    category: 'plant-based',
    goal: 'Flexible plant-forward eating with occasional animal products',
    difficulty: 'beginner',
    description: 'Coined by dietitian Dawn Jackson Blatner, the Flexitarian Diet is semi-vegetarian—~90% plant-based with occasional meat, fish, or dairy. No strict rules—emphasis is on adding vegetables, fruits, whole grains, legumes, and plant proteins rather than subtracting animal products.',
    scientificBasis: 'Satija et al. (2016, JACC) found plant-based diets that were not strictly vegetarian still significantly reduced cardiovascular disease risk. EPIC-Oxford (Appleby et al., 2016) showed semi-vegetarians had lower chronic disease rates than meat-eaters.',
    whatYouWillGain: 'Improved health markers with eating flexibility; increased plant food consumption; gradual reduction in animal product intake; sustainable long-term approach; lower environmental impact.',
    typicalMacros: { protein: '15–25% (mixed plant/animal sources)', carbs: '45–55% (whole grains, vegetables, fruits)', fat: '20–30% (plant-based emphasis)', calories: 'Not strictly tracked (ad libitum within guidelines)' },
    sampleMeals: [
      'Breakfast: Greek yoghurt with berries, granola, and a drizzle of honey',
      'Lunch: Large quinoa bowl with chickpeas, roasted vegetables, tahini dressing (plant-based day)',
      'Dinner: Grilled fish with roasted potatoes and vegetables (animal product day)',
      'Flexible approach: "Meatless Monday" through Thursday, flex meals on weekends',
      'Snacks: Fruit, nuts, vegetable sticks with hummus, edamame',
      'Goal: 5+ plant-based meals per week, minimal processed foods'
    ],
    pros: ['Very flexible and sustainable', 'No forbidden foods', 'Easier adherence than strict vegetarian/vegan', 'Reduces environmental impact', 'Backed by observational research'],
    cons: ['Less structured than other diets', 'May not produce rapid results', '"Flexible" can become "no rules"', 'Requires self-monitoring of plant/animal balance'],
    bestFor: 'People who want health benefits of plant-based eating without full commitment to vegetarianism. Ideal for families with mixed dietary preferences.',
    provenBy: 'Blatner, "The Flexitarian Diet" (2009); Satija et al. (2016), JACC; Appleby et al. (2016)',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'pescatarian-diet',
    name: 'Pescatarian Diet',
    category: 'plant-based',
    goal: 'Plant-based eating with fish and seafood as the only animal protein',
    difficulty: 'beginner',
    description: 'A pescatarian diet combines plant-based eating (vegetables, fruits, grains, legumes, nuts, seeds) with fish and seafood as the primary animal protein source. Dairy and eggs are optionally included. Excludes meat and poultry. Combines the benefits of plant-based eating with omega-3 fatty acids from fish.',
    scientificBasis: 'The EPIC-Oxford study (Appleby et al., 2016) found pescatarians had lower rates of chronic disease than both meat-eaters and regular vegetarians. Fish consumption is associated with reduced cardiovascular mortality (Mozaffarian & Rimm, 2006, JAMA).',
    whatYouWillGain: 'High omega-3 intake from fish; cardiovascular benefits; adequate protein and B12 from seafood; lower environmental impact than meat-based diets; flexible and nutrient-dense eating pattern.',
    typicalMacros: { protein: '15–25% (plant + fish/seafood)', carbs: '45–55% (whole grains, vegetables, fruits)', fat: '20–30% (fish oils, nuts, seeds, avocado)', calories: 'Set per goal' },
    sampleMeals: [
      'Breakfast: Smoked salmon on whole-grain toast with avocado and poached egg',
      'Lunch: Tuna salad with chickpeas, mixed greens, tomato, cucumber, olive oil dressing',
      'Dinner: Grilled mackerel with quinoa, steamed broccoli, and lemon-tahini sauce',
      'Snacks: Edamame, apple with almond butter, seaweed snacks, Greek yoghurt',
      'Protein sources: Salmon, mackerel, sardines, tuna, cod, shrimp, legumes, tofu',
      'Avoids: Beef, pork, chicken, lamb, turkey (all meat and poultry)'
    ],
    pros: ['Excellent omega-3 intake', 'Good protein quality and variety', 'Higher B12 than vegetarian/vegan diets', 'Flexible and nutrient-dense', 'Well-studied and health-promoting'],
    cons: ['Mercury concerns with certain fish', 'Can be expensive (quality seafood)', 'Less protein variety than omnivorous diets', 'Not suitable for ethical vegans/vegetarians'],
    bestFor: 'People wanting health benefits of plant-based eating with the nutritional advantages of fish consumption without eliminating all animal products.',
    provenBy: 'Appleby et al. (2016), EPIC-Oxford; Mozaffarian & Rimm (2006), JAMA',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'macrobiotic-diet',
    name: 'Macrobiotic Diet',
    category: 'plant-based',
    goal: 'Balanced eating based on yin/yang principles and whole foods',
    difficulty: 'intermediate',
    description: 'Originating from Japanese philosophy, the Macrobiotic Diet emphasises whole grains (40–60% of calories), vegetables (20–30%), beans and sea vegetables, with small amounts of fish and occasional fruit. Foods are classified by yin/yang properties. The diet avoids processed foods, dairy, eggs, meat, and nightshade vegetables. Rooted in Zen Buddhism.',
    scientificBasis: 'While the yin/yang food classification lacks scientific basis, the dietary pattern itself aligns with research on whole grains, vegetables, and limited animal products. Kushi et al. (2001) reviewed the diet\'s potential in cancer prevention, noting its high fibre, low fat, and phytoestrogen content may be protective. Limited clinical trial data.',
    whatYouWillGain: 'High fibre intake; low saturated fat; high phytonutrient consumption; improved digestive health through fermented foods; mindfulness about food sourcing and preparation.',
    typicalMacros: { protein: '10–15% from beans, fish, sea vegetables', carbs: '60–70% (whole grains, vegetables)', fat: '10–15% (sesame oil, seeds, fish)', calories: 'Naturally moderate (whole foods)' },
    sampleMeals: [
      'Breakfast: Brown rice porridge with umeboshi plum and sesame seeds',
      'Lunch: Bowl of brown rice, miso soup with wakame and tofu, steamed kale with sesame oil',
      'Dinner: Steamed salmon with adzuki beans, sautéed bok choy, pickled vegetables',
      'Snacks: Roasted pumpkin seeds, nori sheets, apple',
      'Grains: Brown rice, millet, barley, oats, buckwheat (40–60% of daily intake)',
      'Avoids: Nightshades (tomato, potato, aubergine, peppers), dairy, meat, eggs, processed foods'
    ],
    pros: ['Very high whole grain intake', 'Emphasis on mindful eating', 'Low in processed foods and saturated fat', 'Includes fermented foods (gut health)', 'Traditional roots with cultural depth'],
    cons: ['Restrictive food classifications (yin/yang unscientific)', 'Avoids many healthy foods (nightshades)', 'May be too low in protein and fat', 'Time-intensive food preparation', 'Very limited clinical evidence'],
    bestFor: 'Those interested in Eastern food philosophy and a highly disciplined whole-foods approach. May support cancer prevention according to observational research.',
    provenBy: 'Kushi et al. (2001), Journal of Nutrition; Zen Buddhist culinary tradition',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5']
  },
  {
    id: 'raw-vegan',
    name: 'Raw Vegan',
    category: 'plant-based',
    goal: 'Exclusively raw, uncooked plant foods',
    difficulty: 'advanced',
    description: 'A raw vegan diet consists entirely of uncooked and unprocessed plant foods—fruits, vegetables, nuts, seeds, sprouted grains, and cold-pressed oils. No food is heated above 40–48°C (104–118°F). Based on the belief that cooking destroys natural enzymes and reduces nutritional value. Very high in fruits and vegetables.',
    scientificBasis: 'The enzyme hypothesis (that raw food provides live enzymes aiding digestion) is not supported by science—the human stomach deactivates dietary enzymes. However, raw vegan diets are very high in vitamin C, potassium, and fibre. Koebnick et al. (1999) found raw food diets produced low body fat but also low bone mass and B12 deficiency. Long-term adherence raises nutritional concerns.',
    whatYouWillGain: 'Very high fruit and vegetable intake; low calorie density supports weight loss; high fibre and vitamin C; no processed foods; potential improved skin health.',
    typicalMacros: { protein: '8–12% of calories (low—primary concern)', carbs: '70–80% (from fruits and vegetables)', fat: '10–20% (nuts, seeds, avocado, coconut)', calories: 'Naturally low (high volume required)' },
    sampleMeals: [
      'Breakfast: Large fruit smoothie (banana, berries, mango, spinach, flax seeds, coconut water)',
      'Lunch: Large zucchini noodle bowl with marinara sauce (blended tomatoes, sun-dried tomatoes, herbs, olive oil), walnut "meat"',
      'Dinner: Large salad with mixed greens, grated carrot, beetroot, avocado, pumpkin seeds, lemon-tahini dressing',
      'Snacks: Raw nuts, dates, fresh fruit, coconut chips, vegetable sticks with guacamole',
      'Dehydrator options: Raw crackers, kale chips, raw granola, raw energy bars',
      'Protein sources: Hemp seeds, chia seeds, sprouted buckwheat, raw nuts, green vegetables'
    ],
    pros: ['Highest fruit/vegetable intake of any diet', 'Very low in processed foods', 'Generally high in vitamin C and fibre', 'Low calorie density supports weight management', 'Aligns with natural/organic food philosophy'],
    cons: ['Very low protein intake (major concern)', 'Vitamin B12 deficiency is almost certain without supplementation', 'Iron, zinc, calcium, and vitamin D deficiencies common', 'Extremely restrictive and socially isolating', 'Low bone density documented in research', 'Food preparation is very time-intensive'],
    bestFor: 'Short-term detox or reset (1–4 weeks). NOT recommended as a long-term diet due to documented nutritional deficiencies, particularly B12 and protein.',
    provenBy: 'Koebnick et al. (1999); raw food movement led by practitioners like Dr. Douglas Graham',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5']
  },
  {
    id: 'blue-zone-diet',
    name: 'Blue Zone Diet',
    category: 'plant-based',
    goal: 'Longevity through dietary patterns of the world\'s longest-lived populations',
    difficulty: 'beginner',
    description: 'Based on research by Dan Buettner identifying five global regions (Blue Zones) with highest life expectancy: Okinawa (Japan), Sardinia (Italy), Nicoya (Costa Rica), Ikaria (Greece), and Loma Linda (California). The common dietary pattern is 95% plant-based, with beans as the cornerstone, moderate whole grains, nuts, and limited fish. Meat is eaten only 5 times per month on average.',
    scientificBasis: 'Buettner\'s team identified dietary commonalities across these regions through demographic and epidemiological research published in National Geographic (2005). The diet aligns with the PREDIMED trial findings (Estruch et al., 2018) and the Adventist Health Study (Fraser, 1999) showing plant-based diets associated with 7–10 additional years of life expectancy.',
    whatYouWillGain: 'Increased life expectancy; reduced chronic disease risk; sustainable plant-forward eating; natural weight management; culturally rich eating patterns from multiple traditions.',
    typicalMacros: { protein: '12–18% (primarily from beans and legumes)', carbs: '60–70% (vegetables, fruits, whole grains, beans)', fat: '15–25% (nuts, seeds, olive oil, fish)', calories: 'Ad libitum within plant-based pattern' },
    sampleMeals: [
      'Breakfast (Ikarian style): Whole-grain bread with olives, tomato, herbs, olive oil',
      'Lunch (Sardinian style): Minestrone soup with beans, barley, vegetables, served with sourdough bread',
      'Dinner (Okinawan style): Stir-fried bitter melon, tofu, onion, and sweet potato with ginger',
      'Snacks: Handful of almonds (Loma Linda style), fresh fruit, herbal tea',
      'Cornerstone: Beans/legumes daily (1–2 cups), vegetables at every meal, whole grains daily',
      'Meat consumption: Small portions, 2–5 times per month (not daily)'
    ],
    pros: ['Strongest longevity research support', 'Not restrictive—just plant-forward', 'Culturally diverse and interesting meals', 'Sustainable long-term pattern', 'Focuses on lifestyle (not just food)'],
    cons: ['Not designed for rapid weight loss', 'May be too low in protein for athletes', 'Some traditional foods unavailable outside regions', 'Requires significant cooking from scratch', 'Not a structured "diet" with numbers'],
    bestFor: 'Anyone prioritising longevity and healthspan over short-term weight loss. Ideal for families and individuals wanting a sustainable, culturally rich eating pattern.',
    provenBy: 'Buettner, "The Blue Zones" (2008); Fraser (1999), Adventist Health Study; Estruch et al. (2018), PREDIMED',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  }
];

// ============================================================
// INTERMITTENT FASTING DIETS (10)
// ============================================================

const intermittentFastingDiets: DietProgram[] = [
  {
    id: '16-8-fasting',
    name: '16:8 Protocol (Leangains)',
    category: 'intermittent-fasting',
    goal: 'Daily 16-hour fast with 8-hour eating window',
    difficulty: 'beginner',
    description: 'The most popular IF protocol, popularised by Martin Berkhan (Leangains). Fast for 16 hours daily (including sleep time), eat all calories within an 8-hour window (e.g., 12:00 PM – 8:00 PM). The eating window typically contains 2–3 meals. No calorie restriction is imposed during the window, making it an eating schedule rather than a calorie-restricted diet.',
    scientificBasis: 'Research shows time-restricted feeding improves metabolic health independent of calorie intake. Hatori et al. (2012, Cell Metabolism) demonstrated time-restricted feeding improved circadian rhythms and metabolic markers. Moro et al. (2016, JISSN) found 16:8 IF preserved lean mass while reducing fat in resistance-trained males over 8 weeks.',
    whatYouWillGain: 'Natural calorie reduction without conscious restriction; improved insulin sensitivity; better appetite regulation; increased mental clarity during fasted state; flexible eating window for social meals.',
    typicalMacros: { protein: '1.6–2.2 g/kg (consumed in eating window)', carbs: 'Set per goal (consumed in eating window)', fat: 'Set per goal (consumed in eating window)', calories: 'Set per goal (all within 8-hour window)' },
    sampleMeals: [
      'First meal (12:00 PM): 200 g chicken breast, large salad, 150 g quinoa, 1/2 avocado',
      'Second meal (4:00 PM): 200 g Greek yoghurt, 1 scoop protein, 100 g berries, 30 g almonds',
      'Third meal (7:30 PM): 200 g salmon, 250 g sweet potato, roasted vegetables with olive oil',
      'During fast (8 PM – 12 PM): Water, black coffee, unsweetened tea, zero-calorie beverages',
      'Optional pre-workout (fasted): Black coffee + 5 g BCAAs or 1 scoop EAAs',
      'Post-workout (in window): 2 scoops whey + 500 ml milk + 1 banana + 1 tbsp peanut butter'
    ],
    pros: ['Easy to adapt (just skip breakfast)', 'No food restriction within window', 'Improved appetite regulation', 'Increased mental clarity fasted', 'Flexible window timing', 'Well-researched protocol'],
    cons: ['Social challenges with breakfast meetings', 'Initial hunger adaptation period', 'May not suit morning trainers (fasted training)', 'Can encourage overeating in window', 'Not suitable for pregnancy, underweight, or eating disorder history'],
    bestFor: 'Most people new to IF. Particularly good for those who naturally skip breakfast and want the metabolic benefits of time-restricted eating.',
    provenBy: 'Berkhan, "Leangains"; Hatori et al. (2012), Cell Metabolism; Moro et al. (2016), JISSN',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp', '531', 'nsuns-lp']
  },
  {
    id: '18-6-fasting',
    name: '18:6 Protocol',
    category: 'intermittent-fasting',
    goal: 'Extended daily fast with 6-hour eating window',
    difficulty: 'intermediate',
    description: 'An extension of the 16:8 protocol with an 18-hour fast and 6-hour eating window (e.g., 1:00 PM – 7:00 PM). Allows one large meal and one smaller meal or two substantial meals. More aggressive time restriction that may increase fat oxidation during the extended fast.',
    scientificBasis: 'Longer fasting periods increase the duration of ketone production and fat oxidation. Anton et al. (2017) reviewed that extended fasting windows up to 18 hours may enhance autophagy and cellular repair mechanisms. However, adherence is lower than 16:8.',
    whatYouWillGain: 'Extended period of fat oxidation; potential for greater autophagy activation; natural calorie reduction; tighter appetite control as body adapts to longer fasts.',
    typicalMacros: { protein: '1.6–2.2 g/kg (compressed into 6 hours)', carbs: 'Set per goal', fat: 'Set per goal', calories: 'Set per goal (all within 6-hour window)' },
    sampleMeals: [
      'First meal (1:00 PM): 250 g chicken thigh, 3 eggs, 200 g sweet potato, mixed vegetables (large meal)',
      'Second meal (6:00 PM): 200 g salmon, 200 g quinoa, 200 g roasted asparagus with butter',
      'Post-workout (within window): 2 scoops protein + 500 ml milk + 1 banana',
      'During fast (7 PM – 1 PM): Water, black coffee, unsweetened tea',
      'Electrolytes during fast: Sodium (salt water), potassium, magnesium',
      'Window options: Can split into 2 meals or eat one large meal + 1 snack'
    ],
    pros: ['More metabolic benefit than 16:8', 'Extended ketone production', 'Natural calorie restriction', 'Very clear schedule', 'Shorter window reduces eating opportunities'],
    cons: ['Harder to get enough calories in 6 hours', 'Socially challenging (tiny window)', 'May cause blood sugar swings initially', 'Not ideal for high-volume eaters', 'Higher dropout rate than 16:8'],
    bestFor: 'Experienced IF practitioners wanting to extend fasting benefits. Those who prefer two large meals daily rather than three smaller ones.',
    provenBy: 'Anton et al. (2017); clinical experience from IF practitioners',
    recommendedProgramTypes: ['531', 'phul', 'conjugate-method', 'nsuns-lp']
  },
  {
    id: 'omad',
    name: '20:4 or OMAD (One Meal A Day)',
    category: 'intermittent-fasting',
    goal: 'Single daily meal within a 1–4 hour window',
    difficulty: 'advanced',
    description: 'OMAD involves eating all daily calories in a single meal (typically 1 hour) or a 2–4 hour window. The remaining 20–23 hours are spent fasting. This is the most aggressive daily IF protocol. Practitioners typically eat one very large, nutrient-dense meal that meets all daily macronutrient and micronutrient needs.',
    scientificBasis: 'Stote et al. (2007, AJCN) found that eating one meal per day improved body composition but increased blood pressure and cholesterol in some subjects. The extreme fasting period maximises ketone production and may enhance autophagy, but nutrient partitioning over such a compressed window is suboptimal for muscle protein synthesis (MPS is stimulated for only ~5 hours post-meal).',
    whatYouWillGain: 'Maximum daily fasting period; extreme simplicity (one meal to plan/cook); significant calorie restriction if not consciously overeating; deep ketosis during extended fast.',
    typicalMacros: { protein: '2.0–2.5 g/kg (in single meal—challenging)', carbs: 'Set per goal (in single meal)', fat: 'Set per goal (in single meal)', calories: 'All daily calories in 1–2 hours' },
    sampleMeals: [
      'The "OMAD Feast": 300 g ribeye steak + 4 whole eggs + 300 g sweet potato + 200 g broccoli + 1/2 avocado + 2 tbsp butter + 200 g Greek yoghurt + 100 g berries + 1 scoop protein mixed in',
      'OR: 250 g chicken breast + 200 g salmon + 400 g white rice + large salad with olive oil + 1 banana + 2 tbsp peanut butter',
      'The meal must contain: All daily protein (challenging in one meal), sufficient fibre and micronutrients',
      'Liquid version: 2,000+ kcal shake (protein powder, whole milk, peanut butter, oats, banana, olive oil)',
      'During fast: Water, black coffee, unsweetened tea, sparkling water, electrolytes',
      'Window: Typically 6:00–7:00 PM (dinner), fast the remaining 23 hours'
    ],
    pros: ['Maximum simplicity (one meal)', 'Very easy to create calorie deficit', 'Deep ketosis and autophagy', 'No food decisions during day', 'Frees up significant time'],
    cons: ['Extremely difficult to get adequate protein in one meal', 'Bloating from massive single meal', 'Not optimal for muscle protein synthesis', 'Blood sugar spike after the single meal', 'Socially impossible (family dinners, etc.)', 'May trigger binge-restrict cycles', 'Not sustainable for most'],
    bestFor: 'Experienced IF practitioners wanting maximum fasting duration. People who genuinely prefer one large meal and have no social constraints.',
    provenBy: 'Stote et al. (2007), AJCN; anecdotal bodybuilding community experience',
    recommendedProgramTypes: ['531', 'smolov', 'conjugate-method']
  },
  {
    id: '5-2-diet',
    name: '5:2 Diet (Fast Diet)',
    category: 'intermittent-fasting',
    goal: 'Two days of severe restriction, five days normal eating',
    difficulty: 'intermediate',
    description: 'Popularised by Dr. Michael Mosley\'s "The Fast Diet," the 5:2 protocol involves eating normally for 5 days per week and restricting to 500–600 kcal for 2 non-consecutive days (e.g., Monday and Thursday). The fasting days are not zero-calorie but very low calorie, providing some food flexibility while maintaining the metabolic benefits of periodic restriction.',
    scientificBasis: 'Harvie et al. (2011, British Journal of Nutrition) compared 5:2 IF to daily calorie restriction and found similar weight loss but greater improvement in insulin sensitivity with IF. Mosley drew on research showing intermittent energy restriction improves metabolic markers independent of weight loss (Varady et al., 2009).',
    whatYouWillGain: 'Flexibility of normal eating 5 days/week; improved insulin sensitivity beyond daily restriction; simple structure; no daily tracking on feast days; compatible with social eating most of the week.',
    typicalMacros: { protein: 'Fast days: 50–60 g; Feast days: normal', carbs: 'Fast days: 50–60 g; Feast days: normal', fat: 'Fast days: 15–20 g; Feast days: normal', calories: 'Fast days: 500 (women) / 600 (men); Feast days: normal' },
    sampleMeals: [
      'Fast day breakfast: 1 egg + 1 slice whole-grain toast + black coffee (~150 kcal)',
      'Fast day lunch: Large bowl of vegetable soup + 100 g chicken breast (~250 kcal)',
      'Fast day dinner: 1 apple + 1 cup green tea (~80 kcal)',
      'OR three small meals: Porridge (morning), salad (afternoon), lean protein + veg (evening)',
      'Feast day: Eat normally, no restrictions (within reason)',
      'Hydration fast days: Unlimited water, black coffee, unsweetened tea, sparkling water'
    ],
    pros: ['Only 2 days of restriction per week', 'Normal eating 5 days = social flexibility', 'Simple structure to remember', 'No daily calorie counting on feast days', 'Improves insulin sensitivity'],
    cons: ['Very hungry on fast days', 'Easy to overeat on feast days ("compensation")', 'Not suitable for athletes on training days', 'May disrupt training performance if fast days fall on training', 'Risk of disordered pattern in susceptible individuals'],
    bestFor: 'People who cannot sustain daily calorie restriction but can manage 2 days/week of severe restriction. Good for social eaters.',
    provenBy: 'Mosley, "The Fast Diet" (2012); Harvie et al. (2011), BJN; Varady et al. (2009)',
    recommendedProgramTypes: ['stronglifts-5x5', 'greyskull-lp', 'starting-strength']
  },
  {
    id: 'alternate-day-fasting',
    name: 'Alternate Day Fasting (ADF)',
    category: 'intermittent-fasting',
    goal: 'Alternating between feast days and fast days',
    difficulty: 'advanced',
    description: 'ADF alternates between days of normal eating (feast days) and days of very low calorie intake (fast days: 0–500 kcal). The most extreme of the periodic IF protocols. Some versions allow zero calories on fast days (true alternate day fasting), while modified versions allow ~500 kcal.',
    scientificBasis: 'Varady et al. (2013, Cell Metabolism) showed ADF produced significant weight loss (5–7% in 8 weeks) and improved cardiovascular markers. However, adherence over long periods is poor, and Halberg et al. (2005) found ADF may increase cortisol and sympathetic nervous system activity.',
    whatYouWillGain: 'Significant calorie deficit across the week; rapid weight loss; improved insulin sensitivity; cellular autophagy on fast days; cardiovascular marker improvements.',
    typicalMacros: { protein: 'Fast: 0–60 g; Feast: normal', carbs: 'Fast: 0–60 g; Feast: normal', fat: 'Fast: 0–10 g; Feast: normal', calories: 'Fast: 0–500; Feast: normal (ad libitum)' },
    sampleMeals: [
      'Fast day (zero calorie): Water, black coffee, unsweetened tea, sparkling water, electrolyte supplements',
      'Fast day (modified, 500 kcal): 2 eggs + 1 cup vegetable soup + 1 apple + small salad',
      'Feast day breakfast: 4-egg omelette, oatmeal with berries, 200 ml whole milk',
      'Feast day lunch: 200 g chicken, 300 g rice, mixed vegetables',
      'Feast day dinner: 250 g steak, large baked potato, roasted vegetables',
      'Feast day is NOT unlimited—aim for maintenance/slightly above'
    ],
    pros: ['Very large weekly calorie deficit', 'Longer fasts enhance autophagy', 'Feast days allow normal eating', 'Rapid fat loss', 'Clear alternation schedule'],
    cons: ['Extremely difficult adherence', 'Fasting day often means zero training', 'Can cause irritability and fatigue', 'Sleeplessness on fast nights', 'May increase cortisol', 'Not sustainable long-term'],
    bestFor: 'Short-term rapid fat loss (2–6 weeks) for experienced dieters who cannot do daily restriction but can manage alternate day fasting.',
    provenBy: 'Varady et al. (2013), Cell Metabolism; Halberg et al. (2005)',
    recommendedProgramTypes: ['531', 'smolov', 'conjugate-method']
  },
  {
    id: 'eat-stop-eat',
    name: 'Eat Stop Eat — Brad Pilon',
    category: 'intermittent-fasting',
    goal: 'One or two 24-hour fasts per week',
    difficulty: 'intermediate',
    description: 'Developed by Brad Pilon, Eat Stop Eat involves fasting for 24 hours once or twice per week (e.g., dinner to dinner or lunch to lunch). The remaining days follow normal eating with no restrictions. The fast includes only water, black coffee, and unsweetened tea. No food is consumed during the 24-hour period.',
    scientificBasis: 'Pilon extensively reviewed the research on meal frequency and fasting for his master\'s thesis. His system is based on research showing 24-hour fasts do not decrease metabolic rate (Heilbronn et al., 2005) and may improve insulin sensitivity. The key is that 24 hours without food creates a natural calorie deficit across the week without tracking daily.',
    whatYouWillGain: 'Flexibility of normal eating most of the week; natural weekly calorie deficit; maintained metabolic rate (research shows 24-hour fasts don\'t reduce RMR); improved body composition; no daily tracking.',
    typicalMacros: { protein: '1.6–2.2 g/kg on eating days', carbs: 'Normal on eating days', fat: 'Normal on eating days', calories: 'Normal on eating days; 0 on fast days' },
    sampleMeals: [
      '24-hour fast: Dinner (Day 1) → No food → Dinner (Day 2) - nothing but water, coffee, tea',
      'Breaking the fast: Start gradually—soup or light meal first, then main meal 30–60 minutes later',
      'Eating day breakfast: 3 eggs, oatmeal, fruit, coffee',
      'Eating day lunch: 200 g salmon, large salad, quinoa',
      'Eating day dinner: 250 g steak, roasted vegetables, sweet potato',
      'Typical schedule: Fast Sunday dinner → Monday dinner (once/week) or add Wednesday dinner → Thursday dinner'
    ],
    pros: ['Very clear on/off structure', 'Maintained metabolic rate (research supported)', 'No daily tracking on eating days', 'Social flexibility most of week', 'Simple concept'],
    cons: ['24 hours without food is difficult', 'Easy to overcompensate on eating days', 'Training on fast day is challenging', 'May cause sleep disruption on fast nights', 'Not recommended for lean individuals trying to gain'],
    bestFor: 'People who prefer a clear fast/feast schedule over daily micro-management. Frequent travellers who can\'t track daily.',
    provenBy: 'Pilon, "Eat Stop Eat" (2007); Heilbronn et al. (2005)',
    recommendedProgramTypes: ['stronglifts-5x5', 'greyskull-lp', '531']
  },
  {
    id: 'warrior-diet',
    name: 'Warrior Diet — Ori Hofmekler',
    category: 'intermittent-fasting',
    goal: '20-hour undereating followed by 4-hour overeating window',
    difficulty: 'advanced',
    description: 'Based on ancient warrior eating patterns, the Warrior Diet involves undereating for 20 hours (small amounts of raw fruits, vegetables, and protein) followed by a 4-hour overeating window at night. The day phase allows small portions of specific "light" foods, while the night phase is a single large meal with unrestricted food choices.',
    scientificBasis: 'Hofmekler based his protocol on research showing cyclic undereating/overeating patterns may have evolutionary benefits. The day phase is designed to keep the body in a fat-burning state while providing enough nutrients to prevent catabolism. Research on circadian biology supports the concept that evening eating may be more metabolically efficient for some (Poggiogalle et al., 2018).',
    whatYouWillGain: 'Extended daily fat-burning period; large satisfying evening meal; natural calorie deficit without tracking; improved energy regulation; deep connection with hunger signals.',
    typicalMacros: { protein: '1.6–2.0 g/kg (mostly in evening meal)', carbs: 'Minimal during day; substantial in evening', fat: 'Minimal during day; substantial in evening', calories: 'Very low during day; full intake in evening' },
    sampleMeals: [
      'Day phase (20 hrs): Small portions of raw vegetables, fruit, 1–2 hard-boiled eggs, protein shake if needed',
      'Day options: Handful of almonds + apple, carrot sticks + hummus, 1 scoop protein + water',
      'Evening feast (4 hrs): Large mixed salad + 250 g steak + 300 g potatoes + 200 g vegetables + 2 glasses wine',
      'Evening dessert: Dark chocolate, berries with cream, or cheese plate',
      'The feast should be: Moderate protein, high healthy fats, and naturally satisfying foods',
      'Beverages: Water with lemon, herbal tea, black coffee during day'
    ],
    pros: ['Large satisfying evening meal', 'Simple day structure (minimal eating)', 'Natural calorie deficit', 'Aligns with evening social eating', 'Appeals to those who don\'t like breakfast'],
    cons: ['Very long daily underfeeding period', 'Daytime low energy and potential lightheadedness', 'Not suitable for morning/afternoon athletes', 'Can promote binge-like evening eating', 'Social challenges for daytime meals', 'May disrupt sleep with large evening meal'],
    bestFor: 'People who naturally eat very little during the day and want one large evening meal. Those who enjoy the challenge of extended daily fasting.',
    provenBy: 'Hofmekler, "The Warrior Diet" (2002); Poggiogalle et al. (2018) on circadian biology',
    recommendedProgramTypes: ['531', 'conjugate-method', 'smolov']
  },
  {
    id: 'circadian-fasting',
    name: 'Circadian Rhythm Fasting',
    category: 'intermittent-fasting',
    goal: 'Align eating window with daylight hours for circadian alignment',
    difficulty: 'beginner',
    description: 'Circadian Rhythm Fasting involves eating all calories within a window aligned with the sun—typically sunrise to sunset. The eating window varies with seasons but is usually 8–12 hours during daylight. This approach integrates IF principles with circadian biology, emphasising that WHEN you eat matters as much as WHAT you eat.',
    scientificBasis: 'Satchin Panda\'s research at the Salk Institute (Hatori et al., 2012, Cell Metabolism) demonstrated that time-restricted feeding aligned with circadian rhythms improves metabolic health independent of calorie intake. Late-night eating disrupts circadian gene expression and impairs glucose tolerance (Turek et al., 2005). The protocol is based on standardising the feeding window rather than its duration.',
    whatYouWillGain: 'Improved metabolic health; better sleep quality; alignment with natural light-dark cycles; reduced late-night eating (linked to metabolic dysfunction); natural appetite regulation.',
    typicalMacros: { protein: '1.2–2.0 g/kg (eaten during daylight)', carbs: 'Set per goal', fat: 'Set per goal', calories: 'Set per goal (all during daylight hours)' },
    sampleMeals: [
      'Summer schedule: First meal 7:00 AM, last meal 7:00 PM (12-hour window)',
      'Winter schedule: First meal 8:00 AM, last meal 5:00 PM (9-hour window)',
      'Breakfast (sunrise): 2 eggs, oatmeal with berries, green tea',
      'Lunch (midday): 200 g chicken, quinoa, vegetables, olive oil',
      'Dinner (before sunset): 200 g salmon, roasted vegetables, small portion of rice',
      'No food after sunset: Water, herbal tea only'
    ],
    pros: ['Aligns with natural biological rhythms', 'Improves sleep quality', 'Reduces late-night eating', 'Flexible window length', 'Research-backed by Salk Institute'],
    cons: ['Winter windows are very short', 'Social events often happen after sunset', 'Seasonal shifting can be confusing', 'Early sunrises may require early feeding', 'Less effective for shift workers'],
    bestFor: 'People wanting to integrate IF with circadian biology for sleep and metabolic health. Those who eat late at night and want to stop.',
    provenBy: 'Panda, "The Circadian Code" (2018); Hatori et al. (2012), Cell Metabolism; Turek et al. (2005)',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: '24-hour-fast',
    name: '24-Hour Fast Protocol',
    category: 'intermittent-fasting',
    goal: 'Once-weekly 24-hour water-only fast for metabolic reset',
    difficulty: 'intermediate',
    description: 'A 24-hour water-only fast performed once per week. The fast runs from one meal to the same meal the next day (e.g., dinner to dinner). During the 24 hours, only water, black coffee, and unsweetened tea are consumed. The remaining 6 days follow normal eating patterns. This is distinct from Eat Stop Eat in that it\'s usually done only once weekly.',
    scientificBasis: 'Heilbronn et al. (2005, JAMA) showed that 24-hour fasting periods do not reduce resting metabolic rate and may improve insulin sensitivity. The metabolic shift to ketosis and autophagy during the prolonged fast may provide cellular repair benefits. Longo & Mattson (2014, Cell Metabolism) reviewed periodic fasting\'s potential for disease prevention.',
    whatYouWillGain: 'Weekly metabolic reset; improved insulin sensitivity; natural calorie deficit across the week; potential autophagy activation; maintained metabolic rate; deep appreciation for food.',
    typicalMacros: { protein: 'Normal on eating days', carbs: 'Normal on eating days', fat: 'Normal on eating days', calories: 'Normal 6 days; 0 for 24 hours once/week' },
    sampleMeals: [
      'Fast start: Finish dinner Sunday at 7:00 PM',
      'During Monday: Water, black coffee, unsweetened tea only',
      'Breaking fast (Monday 7:00 PM): Start with light meal—bone broth or small salad',
      'Full meal (30–60 min later): Normal balanced dinner—protein, vegetables, carbs',
      'Tuesday onward: Normal eating until next fast day',
      'Electrolytes: Add sodium and potassium to water during fast to prevent headaches'
    ],
    pros: ['Clear 1-day commitment per week', 'No tracking on regular days', 'Potential autophagy benefits', 'Maintained RMR per research', 'Flexible scheduling (pick any day)'],
    cons: ['Full day without food is mentally challenging', 'Training on fast day is compromised', 'May cause social disruption on fast days', 'Easy to overcompensate on eating days', 'Headaches and fatigue common initially'],
    bestFor: 'Healthy individuals wanting periodic fasting benefits without daily time restriction. Good for those who prefer a once-weekly reset.',
    provenBy: 'Longo & Mattson (2014), Cell Metabolism; Heilbronn et al. (2005), JAMA',
    recommendedProgramTypes: ['stronglifts-5x5', 'greyskull-lp', 'starting-strength']
  },
  {
    id: '36-hour-fast',
    name: '36-Hour Fast Protocol',
    category: 'intermittent-fasting',
    goal: 'Extended fast from dinner to breakfast two days later (36 hours)',
    difficulty: 'advanced',
    description: 'A 36-hour water-only fast (e.g., finish dinner at 7:00 PM Sunday, fast all day Monday, break fast at 7:00 AM Tuesday). This is the most common extended fasting protocol, entering deep ketosis and significant autophagy by the 24–36 hour mark. Typically performed once per week by experienced fasters.',
    scientificBasis: 'At 24+ hours of fasting, ketone levels rise significantly (BHB reaches 1–3 mM) and autophagy is substantially activated (Mizushima & Komatsu, 2011). Fung (2016) proposes longer fasts may be more effective for metabolic disease reversal. However, the risk of electrolyte imbalance and refeeding syndrome increases with fast duration.',
    whatYouWillGain: 'Deep ketosis and significant autophagy; rapid fat loss on fast days; reset of appetite regulation; improved metabolic flexibility; profound appreciation for food.',
    typicalMacros: { protein: 'Normal on eating days', carbs: 'Normal on eating days', fat: 'Normal on eating days', calories: 'Normal on eating days; 0 for 36 hours once/week' },
    sampleMeals: [
      'Fast start: Finish dinner Sunday at 7:00 PM',
      'Monday: Water, black coffee, unsweetened tea, electrolyte water (sodium, potassium, magnesium)',
      'Breaking fast (Tuesday 7:00 AM): Start with bone broth or small vegetable soup',
      'Breakfast (30 min later): 2 eggs + 1/2 avocado + light vegetables',
      'Tuesday lunch onward: Normal eating',
      'Critical: Supplement electrolytes (sodium 3–5 g, potassium 1–2 g, magnesium 300–400 mg)'
    ],
    pros: ['Deep ketosis and autophagy activation', 'Significant fat loss on fast days', 'Only 1 night of sleep affected', 'Clear once-weekly commitment', 'Profound metabolic benefits at 36-hour mark'],
    cons: ['Very difficult to complete', 'Headaches, fatigue, dizziness common', 'Training not possible on fast day', 'Electrolyte supplementation essential', 'Refeeding syndrome risk for novices', 'Not suitable for lean, athletes, or most people'],
    bestFor: 'Experienced IF practitioners seeking deep autophagy activation. Therapeutic fasting for metabolic syndrome under supervision. NOT for beginners.',
    provenBy: 'Fung, "The Complete Guide to Fasting" (2016); Mizushima & Komatsu (2011) on autophagy',
    recommendedProgramTypes: ['531', 'conjugate-method']
  }
];

// ============================================================
// MEDITERRANEAN & HEART HEALTH DIETS (8)
// ============================================================

const mediterraneanDiets: DietProgram[] = [
  {
    id: 'traditional-mediterranean',
    name: 'Traditional Mediterranean Diet',
    category: 'mediterranean',
    goal: 'Cardiovascular health and longevity through traditional Mediterranean eating',
    difficulty: 'beginner',
    description: 'The Traditional Mediterranean Diet reflects the eating patterns of Greece, Crete, and southern Italy in the early 1960s. It features abundant olive oil (as the primary fat), vegetables, fruits, legumes, whole grains, moderate fish and seafood, moderate red wine, and limited red meat and dairy. It is not a weight-loss diet but a health-promoting lifestyle pattern.',
    scientificBasis: 'The PREDIMED trial (Estruch et al., 2018, NEJM) randomised 7,447 participants to Mediterranean diet with olive oil, Mediterranean diet with nuts, or low-fat control. Both Mediterranean groups had 30% reduction in cardiovascular events. The Lyon Diet Heart Study (De Lorgeril et al., 1999) showed Mediterranean diet reduced cardiac mortality by 70% in heart attack survivors.',
    whatYouWillGain: 'Reduced cardiovascular disease risk (30%+); improved blood lipids; lower inflammation; healthy weight maintenance; increased longevity; rich, flavourful eating pattern.',
    typicalMacros: { protein: '15–20% (fish, legumes, moderate poultry/dairy)', carbs: '40–50% (whole grains, legumes, vegetables, fruit)', fat: '35–40% (primarily olive oil, nuts, fish)', calories: 'Not explicitly restricted (portion-controlled naturally)' },
    sampleMeals: [
      'Breakfast: Greek yoghurt with honey, walnuts, and fresh figs, whole-grain bread with olive oil',
      'Lunch: Large Greek salad (tomato, cucumber, olives, feta, oregano, olive oil) with grilled sardines and whole-grain pita',
      'Dinner: Baked salmon with lemon-oregano sauce, roasted vegetables (aubergine, courgette, bell pepper), quinoa',
      'Snack: Handful of almonds + 1 apple, fresh fruit, olives',
      'Red wine: 1–2 glasses daily with meals (optional, cultural component)',
      'Olive oil: Used abundantly on vegetables, salads, bread, and cooking'
    ],
    pros: ['Strongest clinical trial evidence for heart health', 'Delicious and satisfying', 'Sustainable lifelong pattern', 'Rich cultural tradition', 'No calorie counting', 'Flexible and varied food choices'],
    cons: ['Not designed for rapid weight loss', 'High fat content contradicts low-fat dogma', 'Good olive oil is expensive', 'Requires regular cooking', 'Not suitable for those avoiding alcohol', 'May be too high in carbs for some metabolic types'],
    bestFor: 'Anyone prioritising cardiovascular health, longevity, and sustainable eating over rapid weight loss. Ideal for families and lifelong eating patterns.',
    provenBy: 'Estruch et al. (2018), NEJM (PREDIMED); De Lorgeril et al. (1999), Lyon Diet Heart Study',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp', 'couch-to-5k']
  },
  {
    id: 'mind-diet',
    name: 'MIND Diet (Mediterranean-DASH Intervention for Neurodegenerative Delay)',
    category: 'mediterranean',
    goal: 'Brain health and prevention of Alzheimer\'s disease',
    difficulty: 'beginner',
    description: 'The MIND diet combines elements of the Mediterranean and DASH diets specifically optimised for neurological health. Developed by Dr. Martha Morris at Rush University, it identifies 10 "brain-healthy" foods (green leafy vegetables, other vegetables, berries, nuts, whole grains, fish, poultry, olive oil, wine) and 5 "unhealthy" foods to limit (red meat, butter, cheese, pastries/sweets, fried foods).',
    scientificBasis: 'Morris et al. (2015, Alzheimer\'s & Dementia) found the MIND diet reduced Alzheimer\'s disease risk by 53% in high-adherence participants over 4.5 years. Even moderate adherence reduced risk by 35%—stronger than either Mediterranean or DASH alone. The specific emphasis on berries (not all fruit) is based on flavonoid research showing berry anthocyanins protect neural function.',
    whatYouWillGain: 'Reduced Alzheimer\'s disease risk; slower cognitive decline with ageing; improved brain health markers; cardiovascular benefits shared with Mediterranean/DASH; sustainable, moderate dietary pattern.',
    typicalMacros: { protein: '15–20% (fish, poultry, legumes)', carbs: '45–55% (whole grains, vegetables, fruit)', fat: '30–35% (olive oil, nuts, fish)', calories: 'Not explicitly restricted' },
    sampleMeals: [
      'Breakfast: Oatmeal with blueberries and walnuts, green tea',
      'Lunch: Large spinach salad with grilled chicken, strawberries, almonds, olive oil vinaigrette',
      'Dinner: Baked salmon with roasted Brussels sprouts, wild rice, side salad with olive oil',
      'MIND 10 foods to eat: Green leafy veg (6+ servings/week), berries (2+ servings/week), fish (1+/week), poultry (2+/week)',
      'MIND 5 to limit: Red meat (<4 servings/week), butter (<1 tbsp/day), cheese (<1 serving/week)',
      'Daily requirement: Olive oil as primary cooking fat, 1 glass of wine optional'
    ],
    pros: ['Strongest evidence of any diet for Alzheimer\'s prevention', 'Even moderate adherence helps (35% risk reduction)', 'Combines best of Mediterranean and DASH', 'Simple 15-point scoring system', 'Sustainable and moderate'],
    cons: ['Very specific to brain health (not general wellness)', 'Berry requirement can be expensive (especially blueberries)', 'Low dairy may be hard for some', 'Not designed for weight loss', 'Fish requirement can be expensive'],
    bestFor: 'Older adults concerned about cognitive decline. Anyone with family history of Alzheimer\'s. People wanting a brain-optimised version of Mediterranean eating.',
    provenBy: 'Morris et al. (2015), Alzheimer\'s & Dementia; Rush University Medical Center',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'mediterranean-keto-hybrid',
    name: 'Mediterranean Keto',
    category: 'mediterranean',
    goal: 'Ketosis with heart-healthy Mediterranean fat sources',
    difficulty: 'intermediate',
    description: 'Combines the very low carbohydrate intake of standard ketogenic diet with the food quality and fat-source principles of the Mediterranean diet. The key difference from standard keto: fat sources shift from butter and cream toward olive oil, fish, nuts, and seeds. Red meat is minimised. Captures cardiovascular benefits while achieving nutritional ketosis.',
    scientificBasis: 'Paoli et al. (2013) demonstrated a ketogenic Mediterranean diet with olive oil as primary fat produced significant weight loss and cardiovascular improvements. Shai et al. (2008) showed the low-carb Mediterranean diet was superior to both low-fat and standard Mediterranean for weight loss at 2 years.',
    whatYouWillGain: 'Ketosis with superior cardiovascular risk profile; high monounsaturated fat intake; anti-inflammatory benefits; reduced LDL vs standard keto; improved longevity markers.',
    typicalMacros: { protein: '1.2–2.0 g/kg (fish, poultry, moderate red meat)', carbs: '<50 g (vegetables, limited legumes)', fat: '65–75% (olive oil, nuts, fish, avocado)', calories: 'Set per goal' },
    sampleMeals: [
      'Breakfast: 3 eggs scrambled in olive oil with tomato, olives, and spinach',
      'Lunch: Large Greek salad with 150 g grilled sardines, olive oil dressing, feta',
      'Dinner: 200 g wild salmon with lemon-herb olive oil sauce, roasted aubergine and courgette',
      'Snack: Handful of walnuts, olives, 1/2 avocado',
      'Fat sources: Extra-virgin olive oil (primary), nuts, seeds, fatty fish',
      'Moderate: 1 glass red wine (if desired—count toward carb limit)'
    ],
    pros: ['Combines best of two well-studied eating patterns', 'Superior cardiovascular profile vs standard keto', 'Highest omega-3 intake of any keto variant', 'Rich in polyphenols and antioxidants', 'More sustainable than standard keto'],
    cons: ['Higher carb may prevent ketosis in some', 'Expensive (quality olive oil, fish)', 'Moderate dairy intake conflicts with clean keto', 'Less total fat flexibility than standard keto'],
    bestFor: 'Individuals wanting metabolic benefits of ketosis but concerned about cardiovascular implications of high saturated fat.',
    provenBy: 'Paoli et al. (2013); Shai et al. (2008), NEJM',
    recommendedProgramTypes: ['531', 'greyskull-lp', 'juggernaut-method']
  },
  {
    id: 'low-sodium-diet',
    name: 'Low Sodium Diet',
    category: 'mediterranean',
    goal: 'Reduce sodium intake to <2,300 mg/day for blood pressure management',
    difficulty: 'intermediate',
    description: 'A low sodium diet restricts sodium intake typically to <2,300 mg/day (about 1 teaspoon of salt) and ideally <1,500 mg/day for those with hypertension. The focus is on avoiding processed foods, canned goods, cured meats, and restaurant meals. Fresh, whole foods are naturally low in sodium. Herbs and spices replace salt for flavouring.',
    scientificBasis: 'The DASH-Sodium trial (Sacks et al., 2001, NEJM) demonstrated conclusively that sodium reduction combined with the DASH diet produced the greatest blood pressure reduction. He et al. (2013, BMJ) meta-analysis of 34 trials confirmed sodium reduction lowers blood pressure regardless of baseline levels. Aburto et al. (2013, BMJ) linked high sodium to increased cardiovascular events.',
    whatYouWillGain: 'Reduced blood pressure (5–10 mmHg systolic); decreased cardiovascular risk; improved fluid balance; reduced bloating; long-term kidney disease prevention.',
    typicalMacros: { protein: '15–20% (fresh, unprocessed sources)', carbs: '50–60% (fresh whole grains, vegetables, fruits)', fat: '25–30% (minimally processed oils)', calories: 'Per goal (sodium focus, not calorie focus)' },
    sampleMeals: [
      'Breakfast: Oatmeal made with water/milk, fresh berries, unsalted nuts, no salt added',
      'Lunch: Large salad with fresh vegetables, grilled chicken (no salt), homemade vinaigrette (no salt)',
      'Dinner: Fresh salmon with lemon-dill sauce, steamed vegetables, quinoa (cooked without salt)',
      'Snacks: Fresh fruit, unsalted nuts, raw vegetables, Greek yoghurt',
      'Herb/spice seasoning: Garlic, oregano, basil, rosemary, paprika, cumin, black pepper, lemon juice, vinegar',
      'Avoid: All processed foods, canned vegetables (unless no-salt), deli meats, most restaurant meals'
    ],
    pros: ['Clinically proven blood pressure reduction', 'Reduces risk of stroke, heart disease, kidney disease', 'Improves food quality (fresh vs processed)', 'Reduces bloating and water retention', 'Essential for salt-sensitive hypertension'],
    cons: ['Extremely challenging for eating out', 'Many convenient foods become off-limits', 'Food without salt initially tastes bland', 'Label-reading required at all times', 'Low sodium can cause dizziness initially', 'Social limitations'],
    bestFor: 'Individuals with hypertension, chronic kidney disease, heart failure, or those at high cardiovascular risk.',
    provenBy: 'Sacks et al. (2001), NEJM (DASH-Sodium); He et al. (2013), BMJ; Aburto et al. (2013), BMJ',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'tlc-diet',
    name: 'TLC Diet (Therapeutic Lifestyle Changes)',
    category: 'mediterranean',
    goal: 'Lower cholesterol through dietary modification',
    difficulty: 'intermediate',
    description: 'The TLC Diet was created by the National Institutes of Health\'s National Cholesterol Education Program. It aims to reduce LDL cholesterol through diet: total fat 25–35% of calories (primarily unsaturated), saturated fat <7% of calories, dietary cholesterol <200 mg/day, and 2 g/day of plant stanols/sterols. Includes increased soluble fibre (10–25 g/day).',
    scientificBasis: 'The TLC diet is based on the landmark NIH National Cholesterol Education Program guidelines (ATP III, 2002). Jenkins et al. (2011, JAMA) showed the "Portfolio Diet" (similar to TLC with added plant sterols) reduced LDL by 28%—comparable to first-line statin therapy. Soluble fibre (oats, psyllium) reduces cholesterol absorption (Brown et al., 1999).',
    whatYouWillGain: 'Reduced LDL cholesterol (8–15% expected); improved total cholesterol/HDL ratio; reduced cardiovascular risk; healthy weight management; increased soluble fibre intake.',
    typicalMacros: { protein: '15–20% (lean poultry, fish, legumes)', carbs: '50–60% (whole grains, vegetables, fruits)', fat: '25–35% (primarily unsaturated; <7% saturated)', calories: 'Per goal (calories reduced if overweight)' },
    sampleMeals: [
      'Breakfast: 1 cup oatmeal made with water/milk, 1 banana, 1 tbsp ground flaxseed, 1 tsp plant sterol margarine',
      'Lunch: Large salad with chickpeas, 100 g grilled chicken, avocado, olive oil vinaigrette, whole-wheat roll',
      'Dinner: 150 g baked salmon, 1 cup steamed broccoli, 1 cup quinoa, side of psyllium husk in water',
      'Snack: Apple with almond butter, 1/2 cup berries, or 1 small handful of almonds',
      'Daily plant sterols: 2 g from fortified margarine or supplements',
      'Saturated fat limit: <7% of calories—meaning limited red meat, butter, cheese, full-fat dairy'
    ],
    pros: ['NIH-backed, evidence-based cholesterol management', 'Clear numerical targets', 'Reduces LDL comparably to low-dose statins', 'Heart-healthy lifestyle approach', 'Well-researched protocols'],
    cons: ['Very low saturated fat target is restrictive', 'Requires precise tracking of fat types', 'Low dietary cholesterol limits eggs/organ meats', 'Plant sterol supplements can be expensive', 'Strong food focus may miss other lifestyle factors'],
    bestFor: 'Individuals with elevated LDL cholesterol who want to avoid or complement statin therapy. Those with cardiovascular disease or high risk.',
    provenBy: 'NIH NCEP ATP III (2002); Jenkins et al. (2011), JAMA; Brown et al. (1999)',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'portfolio-diet',
    name: 'Portfolio Diet — Dr. David Jenkins',
    category: 'mediterranean',
    goal: 'Maximum LDL reduction through a portfolio of cholesterol-lowering foods',
    difficulty: 'intermediate',
    description: 'Developed by Dr. David Jenkins (creator of the glycemic index), the Portfolio Diet combines four key cholesterol-lowering components: plant sterols (1–2 g/day), viscous fibre (oats, barley, psyllium, okra), soy/plant protein (beans, tofu, nuts), and nuts (especially almonds and walnuts). When combined, these produce a synergistic cholesterol-lowering effect comparable to statins.',
    scientificBasis: 'Jenkins et al. (2003, JAMA) showed the Portfolio Diet reduced LDL cholesterol by 28%—comparable to first-line statin therapy (simvastatin 20 mg). A 2011 JAMA follow-up confirmed sustained 28% LDL reduction over 6 months. The four components work through different mechanisms: sterols block absorption, fibre binds bile acids, plant proteins replace animal proteins, and nuts provide healthy fats.',
    whatYouWillGain: 'LDL reduction of 25–30% (statin-like effects); improved total cholesterol/HDL ratio; high fibre intake; plant-focused eating; significant cardiovascular risk reduction.',
    typicalMacros: { protein: '15–20% (plant-emphasis with soy/legumes)', carbs: '45–55% (high-fibre whole grains, vegetables)', fat: '25–30% (primarily unsaturated, limited saturated)', calories: 'Per goal' },
    sampleMeals: [
      'Breakfast: 1 cup oatmeal (viscous fibre) with 300 ml soy milk (plant protein) + 1 tbsp psyllium + 1 banana + 2 tbsp ground almonds + 1 tsp plant sterol margarine',
      'Lunch: Large salad with chickpeas, 100 g tofu, avocado, olive oil dressing, 1 whole-grain roll',
      'Dinner: Lentil and vegetable stew with barley, side of steamed okra, 1 tbsp flaxseed oil dressing',
      'Snacks: Apple with 30 g almonds, soy yoghurt with walnuts, carrots with hummus',
      'Daily portfolio: 1–2 g plant sterols, 10+ g viscous fibre, 30+ g nuts, soy protein',
      'Limited: Saturated fat <7% calories, dietary cholesterol <200 mg/day'
    ],
    pros: ['Proven 28% LDL reduction (statin-like)', 'Synergistic effect of multiple components', 'Whole foods approach', 'High fibre intake (gut health benefits)', 'Plant-focused and environmentally friendly'],
    cons: ['Very high fibre can cause digestive distress initially', 'Requires specific foods daily', 'Soy-heavy (controversial for some)', 'Plant sterol supplements needed', 'Very structured and demanding', 'Time-intensive preparation'],
    bestFor: 'Individuals with elevated LDL who want a non-pharmacological approach or want to complement statin therapy. Ideal for those committed to plant-based eating.',
    provenBy: 'Jenkins et al. (2003, 2011), JAMA; University of Toronto clinical trials',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'greyskull-lp']
  },
  {
    id: 'ornish-diet',
    name: 'Ornish Diet (Very Low Fat/Plant-Based)',
    category: 'mediterranean',
    goal: 'Reverse heart disease through very low-fat, plant-based eating',
    difficulty: 'intermediate',
    description: 'Created by Dr. Dean Ornish, the Ornish Diet (also called the "Spectrum" or "Ultra Diet") is a very low-fat (10%), vegetarian-style eating plan designed to reverse coronary heart disease. It emphasises fruits, vegetables, whole grains, legumes, and soy products. Fat is severely limited (no oils, nuts limited, avocado limited). The programme also includes exercise, stress management, and social support.',
    scientificBasis: 'The Lifestyle Heart Trial (Ornish et al., 1990, The Lancet) showed for the first time that coronary artery blockages could be reversed through lifestyle changes alone. After 5 years (Ornish et al., 1998, JAMA), 99% of adherent participants had regression of atherosclerosis. However, the programme is more than just diet—it includes exercise, group support, and stress management.',
    whatYouWillGain: 'Coronary artery regression (reversal of heart disease); significant weight loss; reduced blood pressure, cholesterol, and blood sugar; improved quality of life; stress reduction.',
    typicalMacros: { protein: '10–15% (primarily from plants)', carbs: '70–75% (vegetables, fruits, whole grains, legumes)', fat: '<10% (no added oils, nuts limited)', calories: 'Not explicitly restricted (very low calorie density)' },
    sampleMeals: [
      'Breakfast: Oatmeal with berries and unsweetened soy milk, 1 piece fresh fruit',
      'Lunch: Large bean and vegetable soup with whole-grain bread (no butter or oil)',
      'Dinner: Stir-fried vegetables (water-sautéed) with tofu and brown rice, no oil',
      'Snack: Fresh fruit, raw vegetables with salsa, air-popped popcorn (no oil)',
      'NOT allowed: All oils, nuts/seeds (limited), avocado (limited), all animal products (optional), all processed foods',
      'Protein sources: Beans, lentils, tofu, tempeh, seitan, soy milk (no animal protein)'
    ],
    pros: ['First diet proven to reverse coronary atherosclerosis', 'Comprehensive lifestyle programme', 'Significant weight loss', 'Very high nutrient density', 'Addresses stress and social support'],
    cons: ['Extremely low fat—may cause hormonal issues', 'No added oils makes cooking challenging', 'Very restrictive diet component', 'Socially difficult', 'High dropout rate (adherence is critical)', 'Very low in B12, DHA, iron (supplementation essential)'],
    bestFor: 'Individuals with diagnosed coronary artery disease who are highly motivated to reverse it through lifestyle change. NOT for general wellness or weight loss alone.',
    provenBy: 'Ornish et al. (1990), The Lancet; Ornish et al. (1998), JAMA; Lifestyle Heart Trial',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5']
  },
  {
    id: 'pritikin-diet',
    name: 'Pritikin Diet',
    category: 'mediterranean',
    goal: 'Very low-fat, high-fibre eating for cardiovascular health',
    difficulty: 'intermediate',
    description: 'Developed by Nathan Pritikin in the 1970s, the Pritikin Diet is a very low-fat (<10%), high-fibre eating plan that emphasises whole grains, vegetables, fruits, and beans while severely limiting fat, animal products, and processed foods. Fatty fish is allowed but red meat, poultry, and dairy are excluded. The diet was one of the first to demonstrate that lifestyle changes could prevent and treat heart disease.',
    scientificBasis: 'Pritikin pioneered the concept of dietary heart disease reversal. Barnard (1991) studied 4,587 Pritikin programme participants and found significant reductions in blood pressure, cholesterol (25% reduction), and triglycerides (33% reduction). The diet\'s very low fat content reduces postprandial lipemia and improves endothelial function (Vogel et al., 1997).',
    whatYouWillGain: 'Reduced blood pressure and cholesterol; improved vascular function; weight loss on ad libitum diet; increased fibre intake (35–50 g/day); reduced cardiovascular risk.',
    typicalMacros: { protein: '10–15% (plant-based with limited fish)', carbs: '75–80% (whole grains, vegetables, fruits, beans)', fat: '<10% (<3% saturated)', calories: 'Ad libitum (high volume, low density)' },
    sampleMeals: [
      'Breakfast: Oatmeal with fresh fruit, cinnamon, and unsweetened soy milk',
      'Lunch: Large salad with chickpeas, shredded carrot, cucumber, tomato, lemon-herb dressing (no oil)',
      'Dinner: Large bowl of minestrone soup with vegetables, beans, and whole-grain pasta',
      'Snack: Fresh fruit basket, air-popped popcorn, raw vegetables with salsa',
      'Animal products: Limited fatty fish (3 oz, 3x/week maximum), no meat, poultry, dairy, eggs',
      'NOT allowed: All added oils (including olive oil), nuts, seeds, avocado, all animal products except limited fish'
    ],
    pros: ['Pioneering heart disease reversal research', 'Very high fibre intake', 'Ad libitum eating (no portion control)', 'Reduces cholesterol and blood pressure significantly', 'Nutrient-dense food choices'],
    cons: ['Extremely low fat can cause dry skin, hormone issues', 'No added oils is very restrictive', 'Almost no fat-soluble vitamin absorption', 'Socially impossible for most settings', 'High carbohydrate content problematic for some', 'Supplements essential (B12, DHA, iron)'],
    bestFor: 'Individuals with established cardiovascular disease ready for intensive lifestyle intervention. NOT for general population or athletes.',
    provenBy: 'Pritikin (1979); Barnard (1991); Vogel et al. (1997)',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5']
  }
];

// ============================================================
// BODYBUILDING / COMPETITION DIETS (10)
// ============================================================

const bodybuildingDiets: DietProgram[] = [
  {
    id: 'peak-week-protocol',
    name: 'Peak Week Protocol',
    category: 'bodybuilding',
    goal: 'Maximum muscle definition and vascularity for competition day',
    difficulty: 'advanced',
    description: 'The final week before a bodybuilding competition, designed to manipulate water, sodium, and carbohydrates to produce maximum muscle definition, vascularity, and separation. Specific protocols vary between coaches but typically involve strategic carbohydrate loading, water manipulation, and electrolyte management to achieve sub-4% body fat appearance on stage.',
    scientificBasis: 'Peak week manipulates the relationship between glycogen, water, and subcutaneous fluid. Carbohydrate loading supercompensates muscle glycogen (Bergström & Hultman, 1966) while sodium manipulation reduces subcutaneous water retention. The goal is to maximise intramuscular glycogen (which makes muscles full) while minimising extracellular water (which blurs definition).',
    whatYouWillGain: 'Competition-ready muscle definition; enhanced vascularity; muscle fullness from glycogen loading; dry, striated appearance; contest-ready conditioning.',
    typicalMacros: { protein: '2.0–2.5 g/kg (maintained throughout)', carbs: 'Variable—depletion then loading (50 g → 300–600 g/day)', fat: 'Very low (<30 g/day)', calories: 'Variable per phase' },
    sampleMeals: [
      'Monday (depletion): 200 g chicken breast + 1 cup broccoli × 4 meals, no carbs, 2 gallons water',
      'Wednesday (loading start): 200 g chicken + 300 g white rice + 100 g sweet potato, reduce water',
      'Friday (final day): 200 g lean beef + 400 g white potatoes, minimal water, frequent small meals',
      'Show day: Chicken breast + white rice + rice cakes + honey (small frequent meals)',
      'Sodium manipulation: High sodium early week → low sodium final 2 days',
      'Potassium: Increase potassium-rich foods or supplements to displace sodium'
    ],
    pros: ['Produces dramatic contest-ready conditioning', 'Short-term commitment (1 week)', 'Can transform 7-day-out look significantly', 'Customisable to individual response', 'Rapid visual changes'],
    cons: ['Extremely precise execution required', 'Risk of flatness if carb load fails', 'Water retention if sodium manipulation is off', 'Very uncomfortable (thirsty, flat, irritable)', 'Weight fluctuations of 2–5 kg in the week', 'Not a health protocol—temporary aesthetic tool'],
    bestFor: 'Competitive bodybuilders, bikini/figure athletes, and fitness models in the final week before a show or photoshoot.',
    provenBy: 'Bodybuilding competition tradition; Bergström & Hultman (1966) glycogen supercompensation',
    recommendedProgramTypes: ['phul', 'phat', 'nsuns-lp', 'german-volume-training']
  },
  {
    id: 'water-manipulation',
    name: 'Water Manipulation Protocol',
    category: 'bodybuilding',
    goal: 'Reduce subcutaneous water for competition day dryness',
    difficulty: 'advanced',
    description: 'A 5–7 day protocol where water intake is systematically increased (up to 10+ litres/day in early week) then severely restricted (0.5–1 litre) in the final 24–36 hours before competition. The body\'s natural diuretic response (the "rebound effect") causes increased urination when water is cut, creating a dry, striated appearance.',
    scientificBasis: 'The mechanism is the body\'s fluid homeostasis system. High water intake days suppress antidiuretic hormone (ADH) and aldosterone. When water is then severely restricted, the suppressed hormonal response takes 24–48 hours to recover, resulting in continued diuresis (peeing more than you drink) during the restriction phase—creating a net water loss (Tiwari et al., 2014).',
    whatYouWillGain: 'Extremely dry, striated muscle appearance; visible muscle separations; enhanced vascularity; competition-ready skin tightness.',
    typicalMacros: { protein: '2.0 g/kg (maintained)', carbs: 'Per peak week plan (moderate-to-high)', fat: 'Very low', calories: 'Moderate' },
    sampleMeals: [
      'Monday–Tuesday: 8–12 L water/day, high sodium, moderate carbs',
      'Wednesday: 6–8 L water/day, moderate sodium, start carb depletion',
      'Thursday: 4–6 L water/day, low sodium, carb load starts',
      'Friday (day before show): 1–2 L water/day, very low sodium, continue carb load',
      'Show day: Sips of water, small carb meals, no sodium',
      'NOT used by all athletes—some prefer minimal water manipulation, focusing on sodium/carbs'
    ],
    pros: ['Produces maximum on-stage dryness', 'Can dramatically improve appearance in final 48 hours', 'Short-term protocol', 'Customisable to individual'],
    cons: ['Dangerous if done incorrectly (hypernatremia risk)', 'Extreme discomfort during restriction phase', 'Headaches, dizziness, fatigue', 'Can cause flatness if too aggressive', 'Requires precise electrolyte monitoring', 'Not medically supervised for most athletes'],
    bestFor: 'Competition bodybuilders in the final 48–72 hours before a show. ONLY for experienced athletes under coach supervision.',
    provenBy: 'Bodybuilding competition tradition; Tiwari et al. (2014) on fluid homeostasis',
    recommendedProgramTypes: ['phul', 'phat', 'german-volume-training']
  },
  {
    id: 'sodium-load-depletion',
    name: 'Sodium Loading/Depletion Protocol',
    category: 'bodybuilding',
    goal: 'Manipulate sodium to reduce subcutaneous water retention',
    difficulty: 'advanced',
    description: 'A strategic manipulation where sodium intake is increased early in peak week (loading phase), then severely restricted in the final 2–3 days (depletion phase). The theory: loading sodium causes the body to excrete it more readily, and when sodium is cut, the continued sodium excretion pulls water with it, creating a drier appearance.',
    scientificBasis: 'Similar hormonal principle to water manipulation. High sodium intake downregulates aldosterone (the sodium-retaining hormone). When sodium is suddenly restricted, the suppressed aldosterone takes time to recover, resulting in continued sodium excretion (and attached water) through the kidneys (Tiwari et al., 2014). This "rebound diuresis" creates the dry look.',
    whatYouWillGain: 'Very dry, conditioned appearance; reduced subcutaneous water; enhanced muscle striations; competition-ready definition.',
    typicalMacros: { protein: '2.0 g/kg (maintained)', carbs: 'Per coach plan', fat: 'Very low', calories: 'Moderate' },
    sampleMeals: [
      'Sodium load (5–6 days out): Add 1–2 tsp salt to meals, salted chicken broth, soy sauce with rice',
      'Sodium depletion (2–3 days out): No added salt, no processed foods, low-sodium water (distilled or reverse osmosis)',
      'Typical meals during depletion: Unsalted chicken breast, unsalted rice, unsalted potatoes, unsalted vegetables',
      'Monitor: Urine colour, body weight daily, visual changes in a mirror',
      'Combine with: Water manipulation and carbohydrate loading',
      'NOT recommended: Extreme depletion beyond 3 days—risk of hyponatremia'
    ],
    pros: ['Enhances peak week conditioning significantly', 'Short window of discomfort', 'Can differentiate 1st from 2nd place', 'Customisable approach'],
    cons: ['Very precise timing required (too early = flat, too late = bloated)', 'Risk of hyponatremia (dangerously low sodium)', 'Extreme thirst during restriction', 'Headaches, dizziness, fatigue', 'Requires experienced coach supervision'],
    bestFor: 'Competitive bodybuilders in the final 3 days before a show. NOT for general use.',
    provenBy: 'Bodybuilding competition tradition; Tiwari et al. (2014) on electrolyte homeostasis',
    recommendedProgramTypes: ['phul', 'phat']
  },
  {
    id: 'carb-load-protocol',
    name: 'Carb Loading Protocol',
    category: 'bodybuilding',
    goal: 'Supercompensate muscle glycogen for full, vascular appearance',
    difficulty: 'intermediate',
    description: 'A 3–7 day protocol combining glycogen depletion (2–3 days of low carbs + high-volume training) followed by glycogen loading (2–4 days of high carbs + reduced training). The depletion phase empties muscle glycogen stores, and the loading phase causes glycogen supercompensation—muscles store 50–100% more glycogen than normal, creating a full, round, vascular appearance.',
    scientificBasis: 'The classic glycogen supercompensation model (Bergström & Hultman, 1966, Scandinavian Journal of Clinical and Laboratory Investigation) showed that muscle glycogen stores could be doubled after depletion-loading cycles. Sherman et al. (1981) refined the protocol for athletes. Glycogen binds ~3–4 g of water per gram, creating the "full" muscle appearance.',
    whatYouWillGain: 'Full, round muscle appearance; enhanced vascularity; improved muscle separation; increased training performance during load days; competition-ready muscularity.',
    typicalMacros: { protein: '2.0 g/kg (maintained)', carbs: 'Depletion: <50 g/day → Load: 400–800 g/day', fat: 'Very low during load', calories: 'High during load' },
    sampleMeals: [
      'Depletion day: 200 g chicken + 1 cup broccoli × 5 meals, no carbs, high water',
      'Load day 1: 200 g chicken + 300 g white rice + 200 g sweet potato + 1 banana × 4 meals',
      'Load day 2: 200 g lean beef + 400 g white rice + 300 g potato + 2 cups juice × 4 meals',
      'Load day 3: 200 g chicken + 300 g white rice + rice cakes with honey + 1 banana × 5 meals',
      'Added dextrose: 50–100 g in post-workout shake during load days',
      'Water: High during depletion, moderate during load, tapered before show'
    ],
    pros: ['Dramatic improvement in muscle fullness', 'Enhanced vascularity and separation', 'Short-term protocol (3–7 days)', 'Scientific basis in glycogen physiology', 'Noticeable difference in 24–48 hours'],
    cons: ['Significant water weight gain (glycogen binds water)', 'May cause bloating and flatness if done wrong', 'Depletion phase is physically demanding', 'Carb choice matters (wrong foods can cause bloating)', 'Overshooting can cause spilling over (subcutaneous glycogen)'],
    bestFor: 'Competitive bodybuilders, physique athletes, and endurance athletes before events requiring peak performance.',
    provenBy: 'Bergström & Hultman (1966); Sherman et al. (1981)',
    recommendedProgramTypes: ['phul', 'phat', 'german-volume-training', 'nsuns-lp']
  },
  {
    id: 'posing-diet',
    name: 'Posing Diet (Pre-Competition Meal Timing)',
    category: 'bodybuilding',
    goal: 'Optimal timing and composition of pre-show meals for stage presentation',
    difficulty: 'advanced',
    description: 'The posing diet is the specific meal protocol followed on competition day. It involves small, frequent meals composed of easily digestible proteins and carbohydrates, eaten at specific times before stepping on stage. The goal is to maintain fullness, energy, and dryness throughout prejudging and finals—potentially 8–12 hours of performing.',
    scientificBasis: 'Based on practical experience showing that slow-digesting proteins (chicken, lean beef) provide sustained amino acid release during the long show day, while simple carbohydrates (rice cakes, honey, dextrose) provide immediate energy for posing on stage. Water is sipped to maintain hydration without causing water retention.',
    whatYouWillGain: 'Maintained muscle fullness throughout show day; sustained energy for multiple stage appearances; continued dryness and conditioning; prevention of mid-show flatness or cramps.',
    typicalMacros: { protein: 'Small portions (30–40 g) per meal', carbs: 'Simple + complex (rice cakes, honey, rice)', fat: 'Very low (<5 g/meal)', calories: 'Distributed across 5–7 small meals' },
    sampleMeals: [
      'Pre-judging breakfast (5:00 AM): 1/2 cup oatmeal, 1 scoop whey, 1 banana, 1 rice cake with honey',
      'Meal 2 (7:30 AM): 100 g chicken breast + 1/2 cup white rice + 1 rice cake',
      'Meal 3 (9:30 AM): 100 g lean beef or salmon + 1/2 sweet potato + rice cake with honey',
      'Backstage: Rice cakes with honey (every 30–60 min), dextrose tabs, sips of water',
      'Post-prejudging meal: Lean protein + simple carbs to fill back up',
      'Finals: Same pattern repeated for evening show'
    ],
    pros: ['Prevents mid-show flatness', 'Provides sustained stage energy', 'Maintains muscle fullness', 'Customisable to individual response', 'Reduces show-day anxiety (clear plan)'],
    cons: ['Requires precise timing', 'Portable food organizational challenges', 'Digestive issues from nerves can disrupt plan', 'Different foods work for different athletes', 'Limited food availability at venues'],
    bestFor: 'Competition bodybuilders, figure, bikini, and physique athletes on show day.',
    provenBy: 'Bodybuilding competition tradition; practical experience from coaches and athletes',
    recommendedProgramTypes: ['phul', 'phat', 'german-volume-training']
  },
  {
    id: 'competition-diet-12-weeks',
    name: 'Bodybuilding Competition Diet (12 Weeks Out)',
    category: 'bodybuilding',
    goal: 'Systematic fat loss while preserving muscle mass for competition',
    difficulty: 'advanced',
    description: 'A 12-week structured diet protocol starting from off-season conditioning and progressing to stage-ready leanness. Typically begins with a moderate calorie deficit (TDEE – 500) and increases gradually. Protein is high (2.2–2.6 g/kg). Carbohydrates and fats are reduced as the diet progresses. Diet breaks and refeeds are scheduled to manage metabolic adaptation.',
    scientificBasis: 'Based on Helms et al. (2014, Sports Medicine) guidelines for natural bodybuilding contest preparation. The protocol emphasises high protein to prevent muscle loss during the prolonged deficit, gradual deficit increases rather than aggressive cuts, and scheduled diet breaks to maintain metabolic rate and hormonal health.',
    whatYouWillGain: 'Competition-ready body fat levels (5–8% men, 12–16% women); preserved lean mass; stage-ready conditioning; long-term body composition skills.',
    typicalMacros: { protein: '2.2–2.6 g/kg lean mass', carbs: '4 g/kg early → 2–3 g/kg mid → optional lower late', fat: '0.8 g/kg early → 0.5–0.6 g/kg late', calories: 'TDEE – 500 (early) to TDEE – 1,000 (late)' },
    sampleMeals: [
      'Week 1–4: 200 g chicken + 300 g rice + vegetables × 3 meals + 2 snacks (moderate deficit)',
      'Week 5–8: 200 g chicken + 200 g rice + vegetables × 3 meals + 1 snack (deeper deficit)',
      'Week 9–12: 200 g chicken + 150 g rice + vegetables × 3 meals (aggressive deficit)',
      'Weekly refeed: Double carbohydrate intake for 1 day to restore leptin',
      'Diet break (weeks 6–7): Eat at maintenance for 1 week to reset metabolism',
      'Supplements: Whey protein, casein (pre-bed), multivitamin, omega-3s, vitamin D'
    ],
    pros: ['Proven contest prep structure', 'Muscle-preserving protein recommendations', 'Scheduled refeeds prevent metabolic crash', 'Gradual progression reduces shock', '12-week time frame is manageable'],
    cons: ['Very demanding mentally and physically', 'Social life essentially stops', 'Hormonal disruption common (low libido, amenorrhea)', 'Energy and performance decline significantly', 'Risk of binge after competition', 'Requires precise tracking and adjustments'],
    bestFor: 'Natural bodybuilders preparing for their first or subsequent competition. Must have >12 weeks to prepare from off-season conditioning.',
    provenBy: 'Helms et al. (2014), Sports Medicine; practical bodybuilding coaching experience',
    recommendedProgramTypes: ['phul', 'phat', 'nsuns-lp', '531-bbb', 'german-volume-training']
  },
  {
    id: 'competition-diet-2-weeks',
    name: '2-Week Out Diet',
    category: 'bodybuilding',
    goal: 'Final conditioning refinement in the last 2 weeks before competition',
    difficulty: 'advanced',
    description: 'The final 2 weeks of contest prep focus on refining conditioning to peak level. The deficit is maintained or slightly reduced, and peak week adjustments begin in the second week. This phase typically involves very low calories, precise macro control, and the beginning of water, sodium, and carbohydrate manipulation for show day.',
    scientificBasis: 'Same scientific basis as the 12-week diet with added peak week adjustments. The final 2 weeks are critical for achieving the "separation" and "dryness" that judges look for. The deficit continues but at a reduced rate to avoid muscle catabolism just before the show.',
    whatYouWillGain: 'Refined conditioning and separation; maintained muscle mass at very low body fat; readiness for peak week manipulations; competition-ready leanness.',
    typicalMacros: { protein: '2.2–2.6 g/kg lean mass', carbs: 'Low (1–2 g/kg, depending on coach preference)', fat: 'Very low (0.3–0.5 g/kg)', calories: 'TDEE – 800 to –1,000' },
    sampleMeals: [
      'Meal 1: 150 g egg whites + 2 whole eggs + 1/2 cup oats',
      'Meal 2: 200 g chicken breast + 100 g white rice + 1 cup broccoli',
      'Meal 3: 200 g white fish (cod/tilapia) + 100 g sweet potato + asparagus',
      'Meal 4: 200 g chicken breast + 1 cup green beans + 1 tsp olive oil',
      'Meal 5: 2 scoops casein + water (before bed)',
      'Last 7 days: Transition to peak week protocol'
    ],
    pros: ['Very clear target (show date)', 'Refined conditioning achievable', 'Motivation is high (close to show)', 'Peak week adjustments coming', 'All the hard work is almost done'],
    cons: ['Extremely low energy and libido', 'Very limited food choices', 'Hormonal disruption peaks', 'Hunger is significant', 'Risk of illness (immune function compromised)'],
    bestFor: 'Bodybuilders already at low body fat (<10% men, <18% women) who need final conditioning refinement.',
    provenBy: 'Helms et al. (2014); practical contest prep experience',
    recommendedProgramTypes: ['phul', 'german-volume-training', 'phat']
  },
  {
    id: 'competition-diet-1-week',
    name: '1-Week Out Diet',
    category: 'bodybuilding',
    goal: 'Peak week manipulations for maximum stage presentation',
    difficulty: 'advanced',
    description: 'The final week before competition, focusing entirely on peak week strategy: carbohydrate loading, water manipulation, sodium manipulation, and electrolyte management. Training volume drops significantly or stops entirely to allow full glycogen storage. Every meal is precisely calculated to produce the optimal stage appearance.',
    scientificBasis: 'Combines all peak week science: glycogen supercompensation (Bergström & Hultman, 1966), sodium/water hormonal manipulation, and the relationship between subcutaneous water and muscle definition.',
    whatYouWillGain: 'Competition-ready peak conditioning; vascularity, fullness, and dryness; stage-ready muscle separation; last-minute improvements in visual presentation.',
    typicalMacros: { protein: '2.0–2.5 g/kg (maintained)', carbs: 'Depletion then load (50 g → 400–700 g/day)', fat: 'Very low', calories: 'Variable' },
    sampleMeals: [
      'Monday (depletion): Chicken + broccoli + brown rice (low carb), 2 gallons water',
      'Wednesday (load start): Chicken + white rice + sweet potato, 1 gallon water',
      'Friday (final full day): Lean beef + white potatoes + rice cakes + honey, minimal water',
      'Saturday (show day): Rice cakes + honey every hour, chicken breast, sips of water',
      'Meal frequency: 6–7 small meals/day for consistent nutrient delivery',
      'No training Thursday–Saturday (full rest or light posing only)'
    ],
    pros: ['Peak conditioning achievable', 'Short-term protocol', 'Dramatic visual changes possible', 'Clear schedule', 'Finish line is visible'],
    cons: ['Extremely low energy', 'Severe thirst during water restriction', 'Mental fog and irritability', 'Sleep disruption common', 'Digestive issues from carb loading'],
    bestFor: 'Competition bodybuilders, figure, and physique athletes in the final week of contest prep.',
    provenBy: 'Bodybuilding competition tradition; Bergström & Hultman (1966)',
    recommendedProgramTypes: ['phul', 'phat']
  },
  {
    id: 'show-day-protocol',
    name: 'Show Day Protocol',
    category: 'bodybuilding',
    goal: 'Optimal presentation, energy, and fullness on competition day',
    difficulty: 'advanced',
    description: 'The exact hour-by-hour protocol for competition day eating, supplementation, and posing preparation. Includes: specific pre-judging and finals meal timing, pump-up nutrition, tan maintenance, and hydration strategy designed to keep the athlete looking their best from early morning weigh-ins through evening finals.',
    scientificBasis: 'Based on the practical physiology of show day: maintaining blood glucose during prolonged competition stress, preventing muscle catabolism during long waiting periods, managing the pump-up window, and staying hydrated without losing dryness. Each athlete has an individualised protocol refined through trial and error.',
    whatYouWillGain: 'Peak appearance throughout show day; maintained muscle fullness and vascularity; sustained energy for posing; prevention of mid-show flatness or "deflating."',
    typicalMacros: { protein: 'Small portions (30–40 g) each meal', carbs: 'Simple carbs (rice cakes, honey, dextrose) frequent', fat: 'Very low', calories: 'Distributed across 6–8 small meals' },
    sampleMeals: [
      '6:00 AM (wake): 16 oz water, 1 rice cake with honey, 1/2 banana, BCAA/EAA',
      '7:30 AM (breakfast): 100 g chicken + 1/2 cup white rice + 1 rice cake with honey',
      '9:30 AM (pre-judging): 1 rice cake with honey every 30–60 min, small sips of water',
      '12:00 PM (post-prejudging): 150 g lean beef or salmon + 1 cup white rice + 1 banana',
      '2:00 PM: Rice cakes with honey, dextrose tabs, sipped water',
      'Finals (evening): Same pattern repeated, pump-up meal 30 min before stage'
    ],
    pros: ['Clear, stress-reducing schedule', 'Optimised stage performance', 'Prevents mid-day flatness', 'Customisable per experience', 'Reduces show-day anxiety'],
    cons: ['Stress can disrupt digestion', 'Need to prepare and carry all food', 'Venue constraints (no refrigeration)', 'Nerves may reduce appetite', 'One plan doesn\'t fit all—needs rehearsal'],
    bestFor: 'Competition bodybuilders, figure, bikini, and physique athletes on show day.',
    provenBy: 'Bodybuilding competition tradition; practical coaching experience',
    recommendedProgramTypes: ['phul', 'phat']
  },
  {
    id: 'reverse-diet',
    name: 'Reverse Diet',
    category: 'bodybuilding',
    goal: 'Gradually increase calories post-competition to restore metabolic rate without fat gain',
    difficulty: 'intermediate',
    description: 'A structured post-competition protocol where calories are systematically increased by 50–100 kcal/day per week over 4–12 weeks. The goal is to gradually restore metabolic rate (which has adapted to the low-calorie contest prep) and feed the body back to maintenance without excessive fat gain. Created and popularised by coaches like Layne Norton and the RP team.',
    scientificBasis: 'Metabolic adaptation (adaptive thermogenesis) reduces energy expenditure by 15–30% during prolonged dieting (Rosenbaum & Leibel, 2010). Reverse dieting aims to reverse this by slow, incremental calorie increases that minimise fat storage while restoring metabolic rate. Trexler et al. (2014, JISSN) reviewed metabolic adaptation and the rationale for post-diet recovery protocols.',
    whatYouWillGain: 'Restored metabolic rate; minimal fat regain post-contest; stabilised hormones (leptin, thyroid, reproductive hormones); psychological recovery from severe restriction; long-term weight maintenance.',
    typicalMacros: { protein: '1.6–2.2 g/kg (maintained throughout)', carbs: 'Increase by 25–50 g/week', fat: 'Increase by 5–10 g/week', calories: '+50–100 kcal/week from post-diet baseline' },
    sampleMeals: [
      'Week 1 (start): 200 g chicken + 200 g rice + vegetables × 3 + 2 snacks (~1,800 kcal)',
      'Week 4: 200 g chicken + 250 g rice + vegetables × 3 + 2 snacks + 1 fruit (~2,100 kcal)',
      'Week 8: 200 g chicken + 300 g rice + 100 g potato + vegetables × 3 + 2 snacks + 2 fruit (~2,500 kcal)',
      'Week 12: 200 g protein + 350 g carbs + vegetables × 3 + 2 snacks + 2 fruit + 1 treat (~2,800 kcal)',
      'Weekly increase: 25–50 g carbs OR 10 g fat (not both simultaneously)',
      'Track: Daily weight, weekly DEXA or progress photos to monitor fat gain'
    ],
    pros: ['Minimises post-contest fat regain', 'Restores metabolic rate and hormones', 'Structured transition to normal eating', 'Reduces binge risk after severe restriction', 'Promotes long-term weight maintenance'],
    cons: ['Very slow process (3–4+ months)', 'Requires ongoing precise tracking', 'Weight gain is psychologically challenging after being lean', 'Some fat gain is inevitable', 'No clear "end point" for some'],
    bestFor: 'All competition athletes transitioning from contest prep back to normal eating or a gaining phase.',
    provenBy: 'Norton & RP team; Trexler et al. (2014), JISSN; Rosenbaum & Leibel (2010)',
    recommendedProgramTypes: ['phul', 'phat', 'nsuns-lp', '531-bbb', 'gzlp']
  }
];

// ============================================================
// PERFORMANCE / NUTRITION TIMING DIETS (8)
// ============================================================

const performanceDiets: DietProgram[] = [
  {
    id: 'peri-workout-nutrition',
    name: 'Peri-Workout Nutrition — Alan Aragon',
    category: 'performance',
    goal: 'Optimise nutrient timing around training for performance and body composition',
    difficulty: 'intermediate',
    description: 'Alan Aragon\'s evidence-based approach to peri-workout nutrition challenges the dogma that precise nutrient timing is critical. Aragon argues that total daily intake is far more important than specific timing, but provides flexible guidelines: a pre-workout meal 1–2 hours before training (protein + moderate carbs), and a post-workout meal within 2 hours (protein + carbs if needed).',
    scientificBasis: 'Aragon & Schoenfeld (2013, JISSN) published the definitive review on nutrient timing, concluding that the anabolic window is much wider than previously thought (up to 4–6 hours). While total daily intake dominates, peri-workout nutrition can benefit performance in trained athletes, especially for multiple daily sessions.',
    whatYouWillGain: 'Optimised training performance without obsessing over precise timing; simplified peri-workout nutrition; adequate recovery without rigid schedules; evidence-based confidence to skip the "urgent post-workout window."',
    typicalMacros: { protein: 'Pre: 20–40 g; Post: 20–40 g', carbs: 'Pre: 30–60 g if needed; Post: dependent on training demands', fat: 'Minimal pre-workout (delays digestion)', calories: 'Distributed across pre + post meals' },
    sampleMeals: [
      'Pre-workout (1–2 hrs before): 150 g chicken + 200 g sweet potato + vegetables',
      'OR pre-workout (shorter window): 1 scoop whey + 1 banana + 1 tbsp peanut butter',
      'Post-workout (within 2 hrs): 200 g salmon + 200 g rice + roasted vegetables',
      'OR post-workout shake: 2 scoops whey + 500 ml milk + 1 banana',
      'Training duration <60 min: Mostly about protein, carbs less critical',
      'Training >90 min or high volume: Carbs become important for glycogen restoration'
    ],
    pros: ['Evidence-based, not dogmatic', 'Reduces stress about "exact timing"', 'Flexible around schedule', 'Supports performance without complexity', 'Widely respected source'],
    cons: ['May be too flexible for those needing structure', 'High-volume athletes still need strategic timing', 'Some athletes genuinely benefit from precise timing', 'Doesn\'t account for individual variability'],
    bestFor: 'Natural lifters, bodybuilders, and fitness enthusiasts who want evidence-based peri-workout guidance without unnecessary complexity.',
    provenBy: 'Alan Aragon & Schoenfeld (2013), JISSN; Aragon\'s ongoing research review work',
    recommendedProgramTypes: ['phul', 'phat', 'nsuns-lp', '531', 'starting-strength']
  },
  {
    id: 'nutrient-timing-protocol',
    name: 'Nutrient Timing Protocol (Skolnik & Chernus)',
    category: 'performance',
    goal: 'Precise nutrient timing for competitive athletic performance',
    difficulty: 'intermediate',
    description: 'Based on the book "Nutrient Timing for Peak Performance" by Heidi Skolnik and Andrea Chernus, this protocol breaks the day into specific nutritional phases: pre-fuel, pre-workout, during-exercise, post-workout, and recovery. Each phase has specific macronutrient and hydration targets designed to maximise performance and recovery for competitive athletes.',
    scientificBasis: 'The protocol synthesises sports nutrition research on glycogen loading, protein synthesis, and hydration. Key principles: pre-exercise carbs improve endurance (Coyle et al., 1986), during-exercise carbs maintain performance for >90 min sessions (Jeukendrup, 2011), and post-exercise protein + carbs optimise recovery (Ivy et al., 2002).',
    whatYouWillGain: 'Optimised athletic performance; improved recovery; reduced risk of bonking/hitting the wall; strategic hydration; competition-ready nutrition preparation.',
    typicalMacros: { protein: 'Pre: 10–20 g; Post: 20–40 g', carbs: 'Pre: 1–4 g/kg (3–4 hrs before); During: 30–60 g/hr (for >90 min)', fat: 'Low pre-workout; included in recovery meals', calories: 'Periodised across training/rest days' },
    sampleMeals: [
      'Pre-fuel (3–4 hrs before): 200 g chicken + 250 g rice + vegetables (balanced meal)',
      'Pre-workout snack (30–60 min before): 1 banana + 1 tbsp honey + water',
      'During exercise (>90 min): 30–60 g carbs/hour (sports drink, gels, chews)',
      'Post-workout (within 30 min): 2 scoops whey + 500 ml sports drink',
      'Recovery meal (1–2 hrs post): 200 g salmon + 200 g sweet potato + vegetables',
      'Evening recovery: 200 g Greek yoghurt + berries + casein protein'
    ],
    pros: ['Comprehensive, evidence-based framework', 'Phased approach covers all training periods', 'Good for serious athletes', 'Hydration integrated into protocol', 'Practical and actionable'],
    cons: ['Complex for casual exercisers', 'Requires planning and preparation', 'During-exercise eating isn\'t needed for <90 min sessions', 'May promote over-hydration in some', 'Too much structure for recreational athletes'],
    bestFor: 'Competitive athletes training >90 minutes daily, especially endurance, team sport, and CrossFit athletes needing precise competition nutrition.',
    provenBy: 'Skolnik & Chernus, "Nutrient Timing for Peak Performance"; Coyle et al. (1986); Ivy et al. (2002)',
    recommendedProgramTypes: ['juggernaut-method', 'cube-method', '531', 'phul']
  },
  {
    id: 'rp-performance-diet',
    name: 'Renaissance Periodization Diet',
    category: 'performance',
    goal: 'Periodised nutrition for optimal performance and body composition year-round',
    difficulty: 'intermediate',
    description: 'The complete Renaissance Periodization system by Dr. Mike Israetel applies training periodisation principles to nutrition. The diet cycles through massing (gaining), cutting (fat loss), and maintenance phases, each with specific macronutrient templates. Carbohydrates are periodised daily (higher training days, lower rest days) and weekly phases adjust surplus/deficit targets.',
    scientificBasis: 'Based on the principle that nutritional needs vary across training cycles. During high-volume hypertrophy phases, carbohydrate needs increase. During deload or rest weeks, intake should decrease. Israetel et al. synthesised research on energy balance, nutrient timing, and periodisation into a coherent system.',
    whatYouWillGain: 'Year-round body composition management with phase-appropriate nutrition; training-day fuel optimisation; structured transition between bulk/cut/maintain; evidence-based mesocycle planning.',
    typicalMacros: { protein: '1.8–2.2 g/kg bodyweight', carbs: 'Training days: 4–6 g/kg; Rest days: 2–3 g/kg', fat: '0.5–0.8 g/kg', calories: 'Phase-dependent: surplus (mass), deficit (cut), maintenance' },
    sampleMeals: [
      'High training day breakfast: 3 eggs, 1 cup oatmeal, 200 ml milk, 1 banana',
      'High training day lunch: 200 g chicken, 300 g white rice, 1 cup vegetables',
      'High training day dinner: 200 g lean beef, 250 g potato, 1 cup vegetables',
      'Rest day breakfast: 3 eggs, 100 g sweet potato, spinach',
      'Rest day lunch: 200 g chicken, 150 g rice, vegetables',
      'Rest day dinner: 200 g salmon, 100 g rice, large salad'
    ],
    pros: ['Systematic periodised approach', 'Training day/rest day carb cycling', 'Full year-round system (not just one goal)', 'Backed by legitimate sports nutrition science', 'Detailed templates available'],
    cons: ['Complex for beginners', 'Requires phase planning and tracking', 'RP app is paid', 'Not designed for sports other than physique/strength', 'Rest days feel very restrictive'],
    bestFor: 'Serious physique and strength athletes who want structured, periodised nutrition year-round.',
    provenBy: 'Dr. Mike Israetel, Renaissance Periodization; sports nutrition literature synthesis',
    recommendedProgramTypes: ['phul', 'phat', 'nsuns-lp', '531-bbb', 'juggernaut-method', 'gzcl-method']
  },
  {
    id: 'team-sky-performance',
    name: 'Team Sky Performance Diet (High-Performance Cycling)',
    category: 'performance',
    goal: 'Marginal gains through precision nutrition for endurance cycling',
    difficulty: 'advanced',
    description: 'The nutrition protocol used by Team Sky (now INEOS Grenadiers), British Cycling\'s WorldTour team, under the "marginal gains" philosophy of Sir Dave Brailsford. Every aspect of nutrition is optimised: precise pre-race fuelling, during-race carbohydrate intake (up to 120 g/hr using multiple transportable carbs), post-race recovery with precise timing, and body composition management through the season.',
    scientificBasis: 'Team Sky\'s approach popularised the concept of multiple transportable carbohydrates (glucose + fructose) during exercise, allowing athletes to absorb up to 120 g carbs/hour versus 60–90 g/hr with glucose alone (Jentjens et al., 2004; Jeukendrup, 2010). Their in-race fuelling strategy is now standard across professional cycling.',
    whatYouWillGain: 'Race-day performance optimisation; understanding of multiple transportable carbs; precision fuelling for endurance events; post-race recovery protocols; marginal gains methodology.',
    typicalMacros: { protein: '1.5–2.0 g/kg (recovery focus)', carbs: 'Pre-race: 8–10 g/kg; During: up to 120 g/hr', fat: 'Moderate (emphasis on unsaturated)', calories: 'Very high on race days (4,000–7,000+); moderate on rest days' },
    sampleMeals: [
      'Pre-race breakfast: Porridge with honey, banana, white toast with jam (3+ hours before start)',
      'During race: 2 bottles (1 water + electrolytes, 1 carb mix), energy gels, rice cakes, bananas—aiming 90–120 g carbs/hr',
      'Post-race immediate: Recovery shake (whey protein + maltodextrin) within 15 minutes',
      'Post-race meal (1–2 hrs): Large balanced meal—salmon, rice, vegetables (emphasis on carb replenishment)',
      'Evening: High-quality protein, vegetables, moderate carbs',
      'Off-season/rest days: Reduced carb intake, higher protein, maintenance calories'
    ],
    pros: ['Elite-level proven performance', 'Cutting-edge carb periodisation', 'Multiple transportable carb innovation', 'Precision post-race recovery protocol', 'Marginal gains philosophy applicable to any athlete'],
    cons: ['Extremely complex and precise', 'Not practical for most athletes (requires a team)', 'Race-day carb intake is very high (only for elite endurance)', 'Body composition focus can be intense', 'Expensive supplements and food costs'],
    bestFor: 'Serious competitive cyclists, triathletes, and endurance athletes who train >15+ hours/week and compete in events >3 hours.',
    provenBy: 'Team Sky / INEOS Grenadiers; Jentjens et al. (2004); Jeukendrup (2010)',
    recommendedProgramTypes: ['juggernaut-method', 'cube-method']
  },
  {
    id: 'cyclist-diet',
    name: 'Cyclist\'s Diet (General Endurance Cycling)',
    category: 'performance',
    goal: 'Year-round nutrition for cycling performance and body composition',
    difficulty: 'intermediate',
    description: 'A comprehensive cycling nutrition protocol covering base training, intensity blocks, race season, and off-season. Emphasises high carbohydrate intake during high-volume periods, strategic periodisation of carb intake around training demands, and careful body composition management (weight is critical for climbing performance).',
    scientificBasis: 'Cycling performance is highly dependent on carbohydrate availability (Coyle et al., 1986), body weight (power-to-weight ratio for climbing), and recovery nutrition. The periodised approach follows the principle of "fuelling for the work required" rather than constant high-carb intake (Impey et al., 2018).',
    whatYouWillGain: 'Optimised power-to-weight ratio; sustained energy for long rides; improved recovery between training sessions; race-day fuelling strategies; year-round nutrition periodisation.',
    typicalMacros: { protein: '1.5–2.0 g/kg (recovery and lean mass)', carbs: 'High-volume: 8–10 g/kg; Easy days: 3–5 g/kg; Races: 90–120 g/hr', fat: 'Moderate (20–30% of calories)', calories: 'Variable—very high on ride days, moderate on rest' },
    sampleMeals: [
      'Pre-ride breakfast: Porridge with banana, honey, peanut butter (3 hrs before)',
      'During ride (3+ hrs): 2 bottles carb mix (90 g carbs/hr), rice cakes, bananas, gels, flapjacks',
      'Post-ride recovery: 1 scoop protein + 50 g maltodextrin + 500 ml milk immediately',
      'Post-ride meal: 200 g chicken + 300 g pasta + tomato sauce + vegetables + parmesan',
      'Easy/rest day: 3 eggs + avocado, salad with fish, lean meat + vegetables + moderate carbs',
      'Off-season: Higher protein, moderate carbs, slight calorie surplus for strength training'
    ],
    pros: ['Performance-optimised carbohydrate periodisation', 'Clear high/low day structure', 'Race-day fuelling protocols', 'Body composition management integrated', 'Backed by cycling sports science'],
    cons: ['High food volume is challenging', 'Requires significant planning', 'During-ride eating requires practice', 'Weight focus can be unhealthy for some', 'Very high carbohydrate budget can be expensive'],
    bestFor: 'Competitive and serious amateur cyclists who train >10 hours/week and want to optimise performance while managing weight.',
    provenBy: 'Coyle et al. (1986); Impey et al. (2018); professional cycling nutrition practice',
    recommendedProgramTypes: ['cube-method', 'juggernaut-method']
  },
  {
    id: 'runner-high-carb',
    name: 'Runner\'s High Carb Protocol',
    category: 'performance',
    goal: 'Maximum glycogen storage for running performance',
    difficulty: 'intermediate',
    description: 'A carbohydrate periodisation protocol specifically for runners. On hard training days and before races, carbohydrate intake is high (8–10 g/kg). On easy/recovery days, intake is moderate (5–6 g/kg). Before half-marathons and marathons, a 3-day carb load is standard. The protocol also emphasises iron intake (critical for runners due to foot-strike hemolysis) and calcium.',
    scientificBasis: 'Glycogen stores are the limiting factor in endurance running performance (Karlsson & Saltin, 1971). Pre-race carb loading can increase glycogen stores by 50–100% (Bergström & Hultman, 1966). During-race carbohydrate supplementation improves performance for runs >90 minutes (Burke et al., 2011).',
    whatYouWillGain: 'Maximised glycogen stores for race day; sustained running performance; reduced risk of "bonking" or "hitting the wall"; improved recovery between runs; iron optimisation for running-specific needs.',
    typicalMacros: { protein: '1.4–1.8 g/kg (recovery focus)', carbs: 'Hard days: 8–10 g/kg; Easy days: 4–6 g/kg; Race week: 10–12 g/kg', fat: 'Moderate (20–25% of calories)', calories: 'High on hard days, moderate on easy days' },
    sampleMeals: [
      'Pre-long run (evening before): 200 g pasta with meat sauce + bread + fruit + 500 ml juice',
      'Pre-run breakfast: 2 slices toast with jam + 1 banana + 200 ml sports drink (2–3 hrs before)',
      'During run (>90 min): Sports drink (60 g carbs/hr), energy gels as needed',
      'Post-run recovery: 500 ml chocolate milk (ideal 4:1 carb:protein ratio) + 1 banana',
      'Post-run meal: 200 g chicken + 300 g rice + vegetables + 1 fruit',
      'Easy day: 3-egg omelette, salad, fish + vegetables + moderate rice/potato'
    ],
    pros: ['Proven race-day performance improvement', 'Clear high/low day structure', 'Simple pre-race carb load protocol', 'Chocolate milk is a perfect recovery drink', 'Practical and well-researched'],
    cons: ['Very high carb intake may cause digestive distress', 'Weight gain from glycogen (temporary but unsettling)', 'Not suitable for runners trying to lose weight', 'Requires significant carb budgeting', 'Gels and sports drinks can cause GI issues in some'],
    bestFor: 'Half-marathon, marathon, and ultramarathon runners wanting to optimise glycogen stores and race-day performance.',
    provenBy: 'Karlsson & Saltin (1971); Bergström & Hultman (1966); Burke et al. (2011)',
    recommendedProgramTypes: ['cube-method', 'juggernaut-method']
  },
  {
    id: 'swimmer-nutrition',
    name: 'Swimmer\'s Nutrition Protocol',
    category: 'performance',
    goal: 'High-calorie, high-carb diet for competitive swimming performance',
    difficulty: 'intermediate',
    description: 'Competitive swimmers require very high calorie intake to support 8–20 training sessions per week (6,000–15,000+ kcal/day for elite males). The protocol emphasises high carbohydrate intake (8–10 g/kg) for glycogen replenishment between sessions, adequate protein (1.6–2.0 g/kg) for recovery, and frequent meals (6–8/day) to maintain energy. Iron is additionally important for swimmers.',
    scientificBasis: 'Swimmers face unique nutritional challenges: cold water suppresses appetite, training multiple times daily demands rapid glycogen recovery, and high training volumes require energy availability rarely seen in other sports (Mujika & Burke, 2010). Post-session carbohydrate timing is critical for recovery before the next session in ~4–6 hours.',
    whatYouWillGain: 'Sustained energy across multiple daily training sessions; improved recovery between sessions; maintained lean mass during high-volume training; adequate calorie intake despite appetite suppression; competition-day fuelling strategies.',
    typicalMacros: { protein: '1.6–2.0 g/kg bodyweight', carbs: '8–12 g/kg (very high for elite)', fat: '1.0–1.5 g/kg (calorie density needed)', calories: '3,000–7,000+ (elite males); 2,000–5,000+ (elite females)' },
    sampleMeals: [
      'Pre-AM session: 1–2 bananas + 500 ml sports drink + 1 slice toast with jam',
      'Post-AM session (immediate): Recovery shake or chocolate milk',
      'Post-AM session meal: Porridge with fruit, 4 eggs, toast, juice',
      'Lunch: 200 g chicken + large pasta portion + vegetables + 2 pieces fruit',
      'Pre-PM session snack: 2 rice cakes with jam + 1 banana + sports drink',
      'Post-PM session meal: 250 g salmon + 350 g rice + vegetables + juice + Greek yoghurt'
    ],
    pros: ['Supports very high training volumes', 'Multiple daily recovery strategies', 'Competition-day fuelling protocols', 'Addresses appetite suppression in cold water', 'Years of Olympian-level practice'],
    cons: ['Extremely high food volume and cost', 'Requires eating even when not hungry', '6–8 meals/day is demanding', 'Digestive issues from constant fuelling', 'Risk of relative energy deficiency (RED-S)'],
    bestFor: 'Competitive swimmers training 15–30+ hours/week. Applicable to other multiple-daily-session athletes (water polo, open water swimmers).',
    provenBy: 'Mujika & Burke (2010); practical Olympic swimming team nutrition',
    recommendedProgramTypes: ['cube-method', 'juggernaut-method']
  },
  {
    id: 'crossfit-competition-diet',
    name: 'CrossFit Competition Diet',
    category: 'performance',
    goal: 'Mixed-modal performance nutrition for CrossFit athletes',
    difficulty: 'intermediate',
    description: 'CrossFit competition nutrition must support strength, power, and endurance simultaneously across varied, unknown workouts. The diet typically follows a Zone or IIFYM macro split (40% carbs, 30% protein, 30% fat) with higher carbohydrate around training. The emphasis is on metabolic capacity (ability to burn both fat and carbs) and quick recovery between competition events. Popularised by the CrossFits Games dietition team and programs like Eat to Perform.',
    scientificBasis: 'CrossFit demands high rates of both glycolytic and oxidative energy production. Wisbøff et al. (2014) showed CrossFit competitions impose metabolic demands comparable to both strength and endurance events. The Zone diet was historically promoted by CrossFit, though IIFYM and RP templates are more common now.',
    whatYouWillGain: 'Mixed-modal energy system support; quick recovery between WODs; metabolic flexibility for varied demands; competition-day fuelling strategies; optimal body composition for performance.',
    typicalMacros: { protein: '1.8–2.2 g/kg bodyweight', carbs: '3–5 g/kg (higher on competition days)', fat: '0.8–1.0 g/kg', calories: 'Phase-dependent (higher during competition training)' },
    sampleMeals: [
      'Competition day breakfast: 4 eggs, 1 cup oatmeal, 1 banana, black coffee',
      'Between events: Rice cakes with honey + protein shake + banana + BCAA/EAAs',
      'Post-competition meal: 250 g salmon + 300 g sweet potato + large salad + avocado',
      'Training day lunch: 200 g chicken + 250 g rice + vegetables + olive oil',
      'Training day dinner: 200 g lean beef + 300 g potato + vegetables + mixed berries',
      'Recovery focus: 2 scoops whey + 500 ml skim milk + 1 banana + 5 g glutamine'
    ],
    pros: ['Mixed-modal energy system support', 'Competition-day event fuelling protocols', 'Flexible macro split', 'Strong community/coach support', 'Applicable to similar sports (OBstacle Racing, HYROX, Spartan)'],
    cons: ['Contradictory recommendations in CrossFit community (Zone vs IIFYM)', 'Very high metabolic demand is hard to fuel', 'Games-level nutrition isn\'t right for recreational CrossFitters', 'Competition day logistics (no set event schedule)', 'Digestive stress from high volume between events'],
    bestFor: 'Competitive CrossFit athletes, HYROX competitors, and obstacle course racers needing mixed-modal fuelling strategies.',
    provenBy: 'CrossFit Games competitors; Wisbøff et al. (2014); Eat to Perform methodology',
    recommendedProgramTypes: ['juggernaut-method', 'cube-method', 'conjugate-method', '531']
  }
];

// ============================================================
// PALEO / ANCESTRAL DIETS (6)
// ============================================================

const paleoDiets: DietProgram[] = [
  {
    id: 'standard-paleo',
    name: 'Standard Paleo Diet',
    category: 'paleo',
    goal: 'Whole-foods eating based on ancestral dietary patterns',
    difficulty: 'beginner',
    description: 'The Paleo diet emulates the presumed diet of pre-agricultural hunter-gatherers: meat, fish, vegetables, fruit, nuts, seeds, and healthy fats. Excluded are grains, legumes, dairy, refined sugar, processed oils, and artificial additives. The premise is that human genetics have not adapted to agricultural and industrial foods, and returning to ancestral eating patterns reduces chronic disease risk.',
    scientificBasis: 'Cordain et al. (2005) proposed the evolutionary discordance hypothesis. Randomized controlled trials show Paleo diets improve glycemic control, reduce triglycerides, and lower blood pressure more than standard low-fat diets (Jönsson et al., 2009; Manheimer et al., 2015). The elimination of processed foods alone accounts for many benefits.',
    whatYouWillGain: 'Improved blood sugar regulation; reduced inflammation; better lipid profile; natural appetite regulation via higher protein and fat intake; elimination of ultra-processed foods.',
    typicalMacros: { protein: '25–35% of calories (higher meat intake)', carbs: '20–35% of calories (from vegetables and fruit only)', fat: '35–45% of calories (nuts, seeds, animal fats, avocado)', calories: 'Ad libitum (self-regulated)' },
    sampleMeals: [
      'Breakfast: 3-egg omelette with spinach, mushrooms, bell peppers, and avocado cooked in coconut oil',
      'Lunch: Grilled chicken breast (200 g) over large mixed salad with olive oil vinaigrette, walnuts, and berries',
      'Dinner: Grass-fed beef steak (250 g) with roasted sweet potato, steamed broccoli, and garlic butter',
      'Snack: Apple with almond butter; carrot sticks; handful of macadamia nuts',
      'Post-workout: Baked salmon (150 g) with roasted vegetables and sweet potato',
      'Dessert: Mixed berries with coconut cream'
    ],
    pros: ['Eliminates ultra-processed foods', 'High satiety from protein and fat', 'Nutrient-dense whole foods', 'Improves metabolic health markers', 'Simple rules: no grains, legumes, or dairy'],
    cons: ['Expensive (quality meat and fresh produce)', 'Difficult social dining (restaurants, gatherings)', 'Eliminates entire food groups unnecessarily', 'Low in calcium without dairy', 'Can be high in saturated fat depending on choices'],
    bestFor: 'Individuals seeking metabolic health improvement, those with autoimmune or inflammatory conditions, and anyone wanting to eliminate processed foods from their diet.',
    provenBy: 'Cordain et al. (2005); Jönsson et al. (2009); Manheimer et al. (2015); numerous RCTs',
    recommendedProgramTypes: ['starting-strength', 'greyskull-lp', 'full-body-3x', 'convict-conditioning']
  },
  {
    id: 'autoimmune-protocol',
    name: 'Autoimmune Protocol (AIP)',
    category: 'paleo',
    goal: 'Identify and eliminate autoimmune triggers through strict elimination diet',
    difficulty: 'advanced',
    description: 'The Autoimmune Protocol is a stringent elimination diet designed to reduce inflammation, heal the gut, and identify food triggers in autoimmune conditions (Hashimoto\'s, rheumatoid arthritis, lupus, IBD, psoriasis, etc.). It removes all potential immune triggers: grains, legumes, dairy, eggs, nuts, seeds, nightshade vegetables, alcohol, coffee, chocolate, NSAIDs, and food additives. Foods are then systematically reintroduced.',
    scientificBasis: 'The AIP is based on the concept of molecular mimicry, gut permeability (leaky gut), and the role of dietary antigens in triggering autoimmune flares. Abbott et al. (2019) showed improvements in IBD symptoms and inflammatory markers. Konijeti et al. (2017) found AIP induced remission in active Crohn\'s disease.',
    whatYouWillGain: 'Identification of personal food triggers; reduced systemic inflammation; improved gut barrier function; autoimmune symptom management; improved energy and quality of life.',
    typicalMacros: { protein: '20–30% of calories', carbs: '25–35% of calories (from allowed vegetables and fruit)', fat: '35–45% of calories (animal fats, olive oil, avocado, coconut)', calories: 'Variable depending on individual needs' },
    sampleMeals: [
      'Breakfast: Turmeric-ginger bone broth with shredded chicken and sautéed kale (no nightshades)',
      'Lunch: Wild-caught salmon (200 g) with roasted carrots, parsnips, and beetroot with olive oil and rosemary',
      'Dinner: Grass-fed lamb chops (250 g) with roasted butternut squash, sautéed spinach, and fermented sauerkraut',
      'Snack: Plantain chips with avocado; coconut yogurt; bone broth',
      'Fermented foods: Sauerkraut, kombucha, kimchi (non-nightshade), coconut kefir',
      'Reintroduction phase: One new food every 5-7 days, monitoring symptoms'
    ],
    pros: ['Very effective for identifying triggers', 'Dramatic symptom improvement for many', 'Whole-food nutrient density', 'Gut-healing emphasis (bone broth, fermented foods)', 'Structured reintroduction protocol'],
    cons: ['Extremely restrictive (most eliminated initially)', 'Socially isolating and difficult to maintain', 'Requires meticulous meal planning and prep', 'Risk of nutrient deficiencies if prolonged', 'Limited high-quality clinical evidence'],
    bestFor: 'Individuals diagnosed with autoimmune conditions (autoimmune thyroiditis, rheumatoid arthritis, IBD, psoriasis, lupus) who have not responded to conventional dietary changes.',
    provenBy: 'Konijeti et al. (2017); Abbott et al. (2019); Wahls protocol integration',
    recommendedProgramTypes: ['foundation-training', 'recovery-mobility', 'senior-fitness', 'yoga-for-athletes']
  },
  {
    id: 'primal-blueprint',
    name: 'Primal Blueprint',
    category: 'paleo',
    goal: 'Ancestral health template with flexible exercise and lifestyle principles',
    difficulty: 'beginner',
    description: 'Mark Sisson\'s Primal Blueprint expands on Paleo by adding "Primal" exercise (sprinting, lifting heavy, walking lots) and lifestyle principles (sleep, sun exposure, play, stress management). Dairy is allowed if tolerated (especially raw/fermented). The mantra is "eat meat, vegetables, nuts and seeds, some fruit, little starch, no sugar." It is more flexible than strict Paleo and emphasises long-term habit change.',
    scientificBasis: 'Sisson synthesised evolutionary biology, exercise physiology, and sleep science into an accessible framework. The 80/20 rule (80% compliance yields 100% benefits) is supported by adherence research showing near-perfect diets are unsustainable (Dansinger et al., 2005). The Primal approach has strong community-based outcomes.',
    whatYouWillGain: 'Sustainable ancestral eating without perfectionism; improved metabolic flexibility; "Primal" exercise prescription (lift, sprint, walk); better sleep and stress management; long-term habit change.',
    typicalMacros: { protein: '20–30% of calories', carbs: '15–25% of calories (moderate, from fruit and vegetables)', fat: '50–65% of calories (generous healthy fats)', calories: 'Ad libitum, with intuitive eating encouraged' },
    sampleMeals: [
      'Breakfast: Bacon and eggs (pasture-raised) with sautéed mushrooms and half an avocado',
      'Lunch: Large salad with grilled salmon, olive tapenade, avocado, cucumber, bell peppers, and lemon-tahini dressing',
      'Dinner: Grass-fed ribeye steak with roasted asparagus, sweet potato wedges with ghee, and side salad',
      'Snack: Hard-boiled eggs; raw cheese (if tolerated); macadamia nuts; celery with almond butter',
      'Post-workout: Protein shake with raw milk (if tolerated) or coconut milk, banana, and collagen',
      'Allow 20% flexibility: Dark chocolate (85%+), wine, white rice (if tolerated)'
    ],
    pros: ['More flexible than strict Paleo', 'Holistic (exercise + sleep + sun + play)', 'Allows dairy if tolerated', '80/20 rule reduces guilt', 'Strong community and resources'],
    cons: ['Still quite expensive', 'High fat may not suit everyone', 'Exercise component requires access to equipment', 'Some principles contradict mainstream guidelines (high sat fat)', 'Subjective "primal" health markers'],
    bestFor: 'Individuals wanting a comprehensive ancestral health lifestyle (not just diet) who appreciate the 80/20 approach to long-term adherence.',
    provenBy: 'Mark Sisson; large community-based evidence; Dansinger et al. (2005) adherence research',
    recommendedProgramTypes: ['starting-strength', '5x5-strong', 'full-body-3x', 'convict-conditioning', 'walking-program']
  },
  {
    id: 'whole30',
    name: 'Whole30',
    category: 'paleo',
    goal: '30-day elimination reset to identify food sensitivities',
    difficulty: 'intermediate',
    description: 'Whole30 is a 30-day strict elimination diet designed as a "short-term nutritional reset." For 30 days, you eliminate sugar, grains, legumes, dairy, alcohol, and all processed foods. No cheating ("no slips, no cheats, no excuses"). After 30 days, foods are reintroduced systematically to identify sensitivities. No weighing or measuring food — focus on eating compliant foods to satiety.',
    scientificBasis: 'Founded by Dallas and Melissa Hartwig, Whole30 is based on the elimination-reintroduction model used in clinical allergy testing and functional medicine (Vlieg-Boerstra et al., 2004). Although no direct RCTs exist for Whole30 specifically, elimination diets are well-established for identifying food sensitivities and reducing inflammation.',
    whatYouWillGain: 'Reset relationship with food; identify food sensitivities; break sugar/craving cycles; reduced bloating and inflammation; improved energy and sleep quality.',
    typicalMacros: { protein: '25–35% of calories', carbs: '20–30% of calories (vegetables, fruit)', fat: '35–50% of calories (animal fats, avocado, nuts, seeds)', calories: 'Ad libitum (no calorie counting)' },
    sampleMeals: [
      'Breakfast: Sweet potato hash with ground beef, kale, and fried eggs cooked in ghee',
      'Lunch: Tuna salad (olive oil mayo) over mixed greens with avocado, cherry tomatoes, cucumber, and balsamic vinegar',
      'Dinner: Roasted chicken thighs with lemon-garlic sauce, roasted Brussels sprouts, and butternut squash',
      'Snack: Handful of almonds; apple; carrot sticks with guacamole; RXBAR (check ingredients)',
      'Compliant condiments: Tessemae\'s dressings, primal kitchen mayo, coconut aminos (instead of soy sauce)',
      'Reintroduction day 31: Add legumes first, then dairy, then grains (monitor symptoms)'
    ],
    pros: ['Clear 30-day protocol with defined rules', 'Effective reset for cravings and habits', 'Strong community support', 'Structured reintroduction', 'No calorie counting or tracking'],
    cons: ['Very strict (zero tolerance for slip-ups)', 'Expensive (must buy compliant everything)', '30 days eliminates many foods unnecessarily', 'Low-calorie risk for some', 'No food flexibility for social events'],
    bestFor: 'Individuals who need a hard reset on eating habits and want to identify food sensitivities through a structured 30-day elimination protocol.',
    provenBy: 'Dallas & Melissa Hartwig; elimination diet clinical models (Vlieg-Boerstra et al., 2004)',
    recommendedProgramTypes: ['full-body-3x', 'convict-conditioning', 'walking-program', 'foundation-training']
  },
  {
    id: 'carnivore-diet',
    name: 'Carnivore Diet',
    category: 'paleo',
    goal: 'Zero-plant, meat-only elimination diet',
    difficulty: 'advanced',
    description: 'The Carnivore Diet is an extreme elimination diet consisting exclusively of animal products: meat, fish, eggs, and sometimes dairy. All plant foods are excluded (vegetables, fruit, grains, legumes, nuts, seeds). Proponents argue that plant toxins (lectins, oxalates, phytates, tannins, goitrogens) cause inflammation and digestive issues in susceptible individuals. The diet is used therapeutically for autoimmune conditions, mental health, and gut disorders.',
    scientificBasis: 'The Carnivore diet lacks large-scale RCTs but has accumulating case report evidence for autoimmune and mental health benefits (Ziats et al., 2021). The "zero plant" approach is based on the lectin hypothesis (Cordain, 1999) and oxalate sensitivity. Critics note the lack of fibre, phytonutrients, and the long-term safety concerns of high red meat intake.',
    whatYouWillGain: 'Complete elimination of potential plant food triggers; dramatic reduction in digestive symptoms for some; autoimmune symptom relief; mental clarity (anecdotal); simplified eating (one food group).',
    typicalMacros: { protein: '30–40% of calories (very high)', carbs: '0–5% of calories (negligible from animal glycogen)', fat: '55–70% of calories (high fat from meat, butter, tallow)', calories: 'Ad libitum (appetite-regulated on meat)' },
    sampleMeals: [
      'Breakfast: 3–4 eggs fried in butter with beef bacon or pork belly',
      'Lunch: 300 g ribeye steak, cooked in tallow, salted to taste',
      'Dinner: 400 g grilled salmon with butter, 2 additional eggs',
      'Snack: Beef jerky; canned sardines; hard-boiled eggs; bone broth',
      'Daily staple: 500 g–1 kg meat (red meat, fish, poultry, organ meats recommended)',
      'Variation: "Lion Diet" (beef, salt, water only for extreme elimination)'
    ],
    pros: ['Extreme elimination identifies triggers', 'Zero food-prep complexity', 'Very high satiety on meat', 'Dramatic results for some autoimmune cases', 'No counting or measuring required'],
    cons: ['Zero fibre and phytonutrients', 'Long-term cardiovascular safety unknown', 'Socially and practically very difficult', 'Expensive (quality meat)', 'Often causes initial digestive changes (diarrhoea/constipation)'],
    bestFor: 'Therapeutic use for severe autoimmune conditions, gut disorders (IBD, SIBO), and mental health conditions where plant elimination is necessary. Not recommended for general population.',
    provenBy: 'Ziats et al. (2021); Cordain (1999) lectin hypothesis; extensive case reports',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'full-body-3x', 'convict-conditioning']
  },
  {
    id: 'paleo-keto-hybrid',
    name: 'Paleo-Keto Hybrid (Pegan Diet)',
    category: 'paleo',
    goal: 'Combination of Paleo and Keto principles for metabolic health',
    difficulty: 'intermediate',
    description: 'The Pegan diet, created by Dr Mark Hyman, combines principles from Paleo and Vegan diets (not keto). However, the Paleo-Keto hybrid is a distinct approach combining Paleo\'s whole-food focus with Keto\'s ketosis state. It eliminates grains, legumes, and dairy (Paleo influence) while keeping carbohydrates very low (20–50 g/day) to maintain ketosis (Keto influence). Emphasis is on high-quality fats, moderate protein, and low-glycaemic vegetables.',
    scientificBasis: 'Combines the ancestral food philosophy of Cordain with the ketogenic metabolic state of Volek & Phinney. The synergies include stable blood glucose, reduced inflammation, and high satiety. Hyman\'s "Pegan" formulation adds plant-heavy emphasis but the Paleo-Keto hybrid is more common in athletic populations.',
    whatYouWillGain: 'Metabolic flexibility training; sustained ketosis without dairy (standard keto is dairy-heavy); reduced inflammation; stable energy throughout the day; body composition improvement.',
    typicalMacros: { protein: '20–25% of calories (moderate for ketosis)', carbs: '5–10% of calories (20–50 g from vegetables only)', fat: '65–75% of calories (avocado, coconut, nuts, seeds, animal fats)', calories: 'Typically 1,800–2,800 (goal-dependent)' },
    sampleMeals: [
      'Breakfast: 3-egg omelette with spinach, mushrooms, and avocado cooked in coconut oil',
      'Lunch: Grass-fed beef patty (200 g) over mixed greens with olive oil, avocado, and pumpkin seeds',
      'Dinner: Wild-caught salmon (200 g) with roasted asparagus and broccoli drizzled with olive oil and lemon',
      'Snack: Macadamia nuts; celery with almond butter; bone broth; coconut chips',
      'Fat sources: Avocado, olive oil, coconut oil, macadamia oil, tallow, lard, duck fat',
      'Avoid: Dairy (except ghee), legumes, grains, sugar, fruit (except berries)'
    ],
    pros: ['Combines benefits of both approaches', 'Very stable blood sugar', 'High-quality food choices', 'Good for dairy-sensitive individuals wanting keto', 'Clear rules (no grains, legumes, dairy, sugar)'],
    cons: ['Extremely restrictive', 'Very low carb may impair athletic performance', 'Dairy-free keto is challenging', 'Expensive (quality fats + meat)', 'Limited food choices lead to low diet variety'],
    bestFor: 'Individuals who respond well to ketosis but cannot tolerate dairy, or those wanting to combine ancestral food principles with metabolic benefits of ketosis.',
    provenBy: 'Dr Mark Hyman (Pegan); Volek & Phinney (keto athletic adaption)',
    recommendedProgramTypes: ['starting-strength', 'greyskull-lp', 'full-body-3x', 'convict-conditioning']
  }
];

// ============================================================
// SPECIFIC MEDICAL / THERAPEUTIC DIETS (6)
// ============================================================

const specificDiets: DietProgram[] = [
  {
    id: 'dash-diet',
    name: 'DASH Diet (Dietary Approaches to Stop Hypertension)',
    category: 'specific',
    goal: 'Blood pressure reduction through dietary modification',
    difficulty: 'beginner',
    description: 'The DASH diet was developed by the National Heart, Lung, and Blood Institute to lower blood pressure without medication. It emphasises fruits, vegetables, whole grains, lean protein, and low-fat dairy while limiting sodium (2,300 mg/day, with 1,500 mg/day for greater reduction), saturated fat, and added sugars. It is consistently ranked as one of the best overall diets by US News & World Report.',
    scientificBasis: 'The landmark DASH trial (Appel et al., 1997) showed the diet reduced systolic BP by 11.4 mmHg in hypertensive participants—comparable to single-drug therapy. The DASH-Sodium trial (Sacks et al., 2001) confirmed lower sodium amplified benefits. The PREMIER trial added exercise for combined effects.',
    whatYouWillGain: 'Significant blood pressure reduction (11/6 mmHg on average); improved lipid profile; reduced cardiovascular disease risk; sustainable healthy eating pattern; weight loss if calorie-controlled.',
    typicalMacros: { protein: '18–25% of calories (lean sources)', carbs: '55–60% of calories (emphasises whole grains, fruits, vegetables)', fat: '25–30% of calories (lower saturated fat, emphasis on unsaturated)', calories: '~2,000 kcal/day (adjustable based on weight goals)' },
    sampleMeals: [
      'Breakfast: Oatmeal with berries and low-fat milk; 1 banana; orange juice',
      'Lunch: Turkey sandwich on whole-grain bread with lettuce, tomato, and mustard; side carrot sticks; apple; low-fat yoghurt',
      'Dinner: Baked salmon (150 g) with brown rice, steamed broccoli, and a mixed green salad with vinaigrette',
      'Snack: Almonds (unsalted); mixed fruit; low-fat cheese stick; celery with hummus',
      'DASH daily servings: 6–8 grains, 4–5 vegetables, 4–5 fruits, 2–3 low-fat dairy, 6 or fewer lean meat',
      'Limit: Sodium <1,500–2,300 mg, sweets <5/week, saturated fat <6–7% of calories'
    ],
    pros: ['Clinically proven blood pressure reduction', 'Nutrient-dense and heart-healthy', 'Flexible and widely applicable', 'Top-ranked diet overall by health professionals', 'Simple portion-size guidelines'],
    cons: ['Modest weight loss without calorie restriction', 'High carbohydrate may not suit all', 'Low-fat dairy emphasis contradicts some research', 'Requires label-reading for sodium content', 'Can be difficult dining out (hidden sodium)'],
    bestFor: 'Individuals with hypertension, pre-hypertension, or those wanting a clinically-proven heart-healthy dietary pattern. Also recommended for cardiovascular disease risk reduction.',
    provenBy: 'Appel et al. (1997); Sacks et al. (2001); NHLBI; US News & World Report #1 ranking',
    recommendedProgramTypes: ['walking-program', 'foundation-training', 'senior-fitness', 'couch-to-5k']
  },
  {
    id: 'low-fodmap',
    name: 'Low FODMAP Diet',
    category: 'specific',
    goal: 'Identify fermentable carbohydrate triggers in IBS',
    difficulty: 'advanced',
    description: 'The Low FODMAP diet was developed by Monash University to manage Irritable Bowel Syndrome (IBS). FODMAPs (Fermentable Oligo-, Di-, Mono-saccharides And Polyols) are short-chain carbohydrates that are poorly absorbed in the small intestine and fermented by gut bacteria, causing gas, bloating, and pain in sensitive individuals. The diet has three phases: elimination (2–6 weeks), reintroduction (identifying specific triggers), and personalisation (long-term modified diet).',
    scientificBasis: 'Monash University research (Gibson & Shepherd, 2010) established the FODMAP concept. Multiple RCTs show ~50–80% of IBS patients improve on the Low FODMAP diet (Halmos et al., 2014; Staudacher et al., 2017). It is now the first-line dietary therapy in IBS guidelines worldwide (NICE, ACG, WGO).',
    whatYouWillGain: 'Significant reduction in IBS symptoms (bloating, gas, diarrhoea, constipation); identification of specific FODMAP triggers; long-term symptom management tool; improved quality of life; reduced medication dependence.',
    typicalMacros: { protein: 'Variable (depends on tolerated foods)', carbs: 'Variable (limited by FODMAP restrictions during elimination)', fat: 'Variable', calories: 'Sufficient for individual needs (may be lower during elimination)' },
    sampleMeals: [
      'Breakfast: Oats with lactose-free milk, banana, and peanut butter (small serve)',
      'Lunch: Grilled chicken (200 g) with quinoa, spinach, carrot, cucumber, and olive oil dressing',
      'Dinner: Salmon (200 g) with potatoes, green beans, carrots, and rosemary-infused olive oil',
      'Snack: Rice cakes with peanut butter; orange; hard cheese (cheddar, Swiss); strawberries',
      'High FODMAP foods to revisit: Garlic, onion, wheat, milk, yoghurt, beans, lentils, apples, pears, honey',
      'Reintroduction: Challenge one FODMAP subgroup (e.g., lactose) over 3 days, monitor symptoms'
    ],
    pros: ['~70% of IBS patients improve significantly', 'Science-backed protocol from Monash University', 'Structured reintroduction phase', 'Free Monash University app for guidance', 'Does not eliminate entire food groups permanently'],
    cons: ['Very restrictive during elimination phase', 'Requires significant education and planning', 'Risk of inadequate fibre intake during elimination', 'Monash app required for accurate guidance', 'Not intended for long-term use (2–6 weeks only)'],
    bestFor: 'Individuals diagnosed with IBS (IBS-D, IBS-C, IBS-M) under medical supervision. Not for self-diagnosed digestive issues without professional guidance.',
    provenBy: 'Gibson & Shepherd (2010); Halmos et al. (2014); Staudacher et al. (2017); Monash University; NICE/ACG guidelines',
    recommendedProgramTypes: ['recovery-mobility', 'stress-relief', 'foundation-training', 'yoga-for-athletes']
  },
  {
    id: 'anti-inflammatory-diet',
    name: 'Anti-Inflammatory Diet',
    category: 'specific',
    goal: 'Reduce chronic systemic inflammation through dietary modification',
    difficulty: 'beginner',
    description: 'The Anti-Inflammatory Diet is not a single rigid protocol but a pattern of eating emphasising foods that reduce inflammation and minimising pro-inflammatory foods. It is rich in omega-3 fatty acids (fatty fish, flax, walnuts), polyphenols (berries, colourful vegetables, tea, dark chocolate), fibre (whole grains, vegetables), and adequate protein. It limits refined carbohydrates, fried foods, sugary beverages, processed meats, and trans fats.',
    scientificBasis: 'Chronic low-grade inflammation is now recognised as a driver of cardiovascular disease, diabetes, dementia, and arthritis (Libby, 2006). The Dietary Inflammatory Index (DII) quantifies inflammatory potential (Shivappa et al., 2014). The PREDIMED trial (Estruch et al., 2018) showed anti-inflammatory diets reduce cardiovascular events by 30%, with C-reactive protein reductions directly correlating with benefits.',
    whatYouWillGain: 'Reduced C-reactive protein and inflammatory markers; lower cardiovascular disease risk; improved joint pain in arthritis; better cognitive function; reduced risk of chronic disease.',
    typicalMacros: { protein: '15–25% of calories (emphasises fish, legumes, lean poultry)', carbs: '45–55% of calories (low-glycaemic, high-fibre sources)', fat: '25–35% of calories (emphasis on omega-3s and monounsaturated fats)', calories: 'Sufficient for individual needs and weight management' },
    sampleMeals: [
      'Breakfast: Green smoothie (spinach, kale, half banana, berries, flaxseed, unsweetened almond milk)',
      'Lunch: Grilled sardines or mackerel (150 g) over quinoa, arugula, cherry tomatoes, cucumber, and olive-limon dressing',
      'Dinner: Turmeric-ginger chicken curry (with coconut milk) over cauliflower rice with sautéed bok choy',
      'Snack: Handful of walnuts; blueberries; dark chocolate (85%+); green tea; goji berries',
      'Anti-inflammatory spices: Turmeric (+ black pepper), ginger, garlic, cinnamon, rosemary, oregano',
      'Foods to limit: Refined oils, sugar, processed meats, fried foods, alcohol, refined grains'
    ],
    pros: ['Broad health benefits across multiple conditions', 'Easy to follow (add more of the good stuff)', 'Strong clinical trial evidence', 'Compatible with most other dietary approaches (Paleo, Med, Vegan)', 'No strict rules or calorie counting required'],
    cons: ['Less structured than named diets', 'Can be more expensive (fresh produce, fish)', 'Some anti-inflammatory claims are overstated', 'Requires understanding of inflammatory vs anti-inflammatory foods', 'Results take weeks to months to manifest'],
    bestFor: 'Individuals with chronic inflammatory conditions (arthritis, cardiovascular disease, metabolic syndrome), or anyone wanting a science-backed disease-prevention diet.',
    provenBy: 'Libby (2006); Shivappa et al. (2014); Estruch et al. (2018) PREDIMED; multiple meta-analyses',
    recommendedProgramTypes: ['walking-program', 'couch-to-5k', 'recovery-mobility', 'yoga-for-athletes', 'foundation-training']
  },
  {
    id: 'diabetic-glycemic-diet',
    name: 'Glycemic Control Diet (Diabetic Diet)',
    category: 'specific',
    goal: 'Blood glucose management for diabetes and pre-diabetes',
    difficulty: 'intermediate',
    description: 'The Glycemic Control Diet is designed to manage blood glucose levels in type 2 diabetes, type 1 diabetes, and pre-diabetes through carbohydrate management. It emphasises low-glycaemic index (GI) foods, portion control, consistent carbohydrate intake at meals, and high fibre intake. Multiple approaches exist: carbohydrate counting, glycaemic load tracking, the plate method, and continuous glucose monitor (CGM)-guided eating.',
    scientificBasis: 'The Diabetes Control and Complications Trial (DCCT, 1993) established that intensive glucose control reduces diabetes complications. The Look AHEAD trial (Wing et al., 2013) showed lifestyle intervention achieves diabetes remission. Low-carb approaches show the best glycaemic outcomes (Hallberg et al., 2018). The ADA now recommends "carbohydrate reduction" as an acceptable approach.',
    whatYouWillGain: 'Improved HbA1c and fasting glucose; reduced medication dependence; weight loss; better glycaemic variability; reduced risk of diabetic complications.',
    typicalMacros: { protein: '20–30% of calories (assists satiety and glucose stability)', carbs: '20–40% of calories (varies: low-carb for diabetics is 50–100 g/day)', fat: '35–45% of calories (emphasis on unsaturated fats)', calories: '1,500–2,500 (weight-loss or maintenance adjusted)' },
    sampleMeals: [
      'Breakfast: 2 eggs scrambled with spinach and mushrooms + half avocado + 1 slice whole-grain toast',
      'Lunch: Grilled chicken breast (150 g) over large salad with olive oil vinaigrette + quinoa (75 g cooked)',
      'Dinner: Baked cod (200 g) with roasted non-starchy vegetables (broccoli, cauliflower, bell peppers) + small sweet potato',
      'Snack: Handful of almonds; celery with almond butter; Greek yoghurt; berries',
      'Plate method (non-starchy): Fill 1/2 plate vegetables, 1/4 plate lean protein, 1/4 plate low-GI carbs',
      'CGM-guided: Adjust insulin/medication dosing based on real-time glucose readings and meal composition'
    ],
    pros: ['Clinically essential for diabetes management', 'Multiple evidence-based approaches (counting, low-GI, low-carb)', 'CGM integration for personalised eating', 'Can reduce or eliminate medication', 'Widespread professional support (endocrinologists, dietitians)'],
    cons: ['Requires carbohydrate counting and planning', 'Different approaches give conflicting advice (ADA vs low-carb)' , 'Social dining is challenging', 'Hypoglycaemia risk if medication not adjusted', 'Low-GI labels can be misleading'],
    bestFor: 'Individuals with type 2 diabetes, pre-diabetes, gestational diabetes, or type 1 diabetes. Also for individuals with metabolic syndrome or insulin resistance.',
    provenBy: 'DCCT (1993); Look AHEAD (Wing et al., 2013); Hallberg et al. (2018); ADA clinical guidelines',
    recommendedProgramTypes: ['walking-program', 'couch-to-5k', 'foundation-training', 'recovery-mobility', 'stress-relief']
  },
  {
    id: 'low-residue-fiber',
    name: 'Low Residue / Low Fibre Diet',
    category: 'specific',
    goal: 'Reduce bowel movement frequency for medical recovery',
    difficulty: 'intermediate',
    description: 'The Low Residue diet reduces the amount of undigested material passing through the colon by limiting high-fibre foods, raw fruits and vegetables, whole grains, nuts, and seeds. It is a therapeutic diet used temporarily before or after bowel surgery, during IBD flares (Crohn\'s, ulcerative colitis), diverticulitis episodes, or before colonoscopy. The goal is to minimise stool volume and frequency, giving the GI tract rest.',
    scientificBasis: 'The diet is based on the principle that insoluble fibre increases faecal bulk, which irritates inflamed or healing bowel tissue. Vanhauwaert et al. (2015) reviewed the evidence for low-residue diets in clinical practice. The diet is widely recommended by gastroenterologists, though evidence quality varies by condition.',
    whatYouWillGain: 'Reduced bowel movement frequency; less abdominal pain and cramping; minimised irritation during IBD flares; proper bowel preparation for surgery/colonoscopy; nutrition support during GI recovery.',
    typicalMacros: { protein: '20–30% of calories (easily digestible sources)', carbs: '50–60% of calories (refined grains, well-cooked vegetables)', fat: '20–30% of calories (tolerated fats)', calories: 'Sufficient for recovery needs' },
    sampleMeals: [
      'Breakfast: Refined wheat cereal (e.g., Corn Flakes) with lactose-free milk; white toast with butter; strained fruit juice',
      'Lunch: Chicken noodle soup (strained broth); white bread sandwich with turkey and mayonnaise (no raw vegetables)',
      'Dinner: Baked white fish (150 g) with well-cooked carrots, white rice, and a small portion of peeled potato',
      'Snack: Ripe banana; applesauce; plain crackers; yoghurt without seeds/fruit; smooth peanut butter on white bread',
      'Avoid: Whole grains, raw vegetables, dried fruits, nuts, seeds, legumes, tough/stringy meat',
      'Texture modifications: Peeling fruit, cooking vegetables thoroughly, removing seeds, straining soups'
    ],
    pros: ['Medically necessary in certain conditions', 'Reduces pain and discomfort during flares', 'Short-term restriction is manageable', 'Clear food lists available from hospitals', 'Prevents complications from bowel obstructions'],
    cons: ['Very low fibre (constipating for healthy individuals)', 'Not nutritionally adequate long-term', 'Low in phytonutrients and antioxidants', 'Very restrictive food choices', 'Must be supervised by physician/dietitian'],
    bestFor: 'Temporary medical use in pre/post bowel surgery, IBD flares, diverticulitis episodes, or pre-colonoscopy preparation. Requires medical supervision.',
    provenBy: 'Vanhauwaert et al. (2015); standard gastroenterology clinical practice',
    recommendedProgramTypes: ['recovery-mobility', 'stress-relief', 'foundation-training', 'senior-fitness']
  },
  {
    id: 'renal-diet',
    name: 'Renal (Kidney-Friendly) Diet',
    category: 'specific',
    goal: 'Manage chronic kidney disease through dietary modification',
    difficulty: 'advanced',
    description: 'The Renal Diet is a therapeutic diet for chronic kidney disease (CKD) that modifies protein, sodium, potassium, phosphorus, and fluid intake based on disease stage. The diet aims to reduce the kidneys\' workload, prevent electrolyte imbalances, manage blood pressure, and slow disease progression. It is highly individualised based on blood work (GFR, potassium, phosphorus, calcium levels) and dialysis status.',
    scientificBasis: 'The MDRD study (Klahr et al., 1994) showed dietary protein restriction slows CKD progression in non-diabetic kidney disease. The KDOQI and KDIGO guidelines provide evidence-based nutrition recommendations. Management of hyperkalemia, hyperphosphatemia, and fluid balance is critical in advanced CKD.',
    whatYouWillGain: 'Slowed progression of kidney disease; controlled blood pressure; managed electrolyte balance; reduced uremic symptoms; improved outcomes on dialysis.',
    typicalMacros: { protein: '0.6–1.2 g/kg (varies: low for pre-dialysis, higher for dialysis patients)', carbs: '45–55% of calories (complex sources)', fat: '25–35% of calories (unsaturated emphasis)', calories: '1,500–2,500 (weight-adjusted, depends on dialysis status)' },
    sampleMeals: [
      'Breakfast: French toast (white bread) with low-potassium fruit (cranberry juice, apple, grapes)',
      'Lunch: Chicken salad (150 g chicken, mayonnaise) on white bread with lettuce; steamed green beans; apple',
      'Dinner: Baked fish (150 g) with white rice and steamed zucchini and carrots (leached)',
      'Snack: Low-potassium fruits (apples, grapes, berries, pineapple); unsalted pretzels; rice cakes; butter cookies',
      'Limit: High-potassium foods (bananas, oranges, potatoes, tomatoes, beans); high-phosphorus foods (dairy, nuts, seeds, cola), sodium <2,000 mg',
      'Note: Education required for food selection + portion management + blood work-guided adjustments'
    ],
    pros: ['Medically essential for CKD patients', 'Evidence-based slowing of disease progression', 'Reduces dialysis complications', 'Guided by objective lab values', 'Team support (nephrologist + dietitian)'],
    cons: ['Extremely restrictive and complex', 'Requires constant blood monitoring', 'Quality of life impact from food restrictions', 'Risk of malnutrition if poorly managed', 'Advice changes with CKD stage and dialysis status'],
    bestFor: 'Individuals diagnosed with chronic kidney disease (stage 3–5), especially those on dialysis or approaching dialysis. Must be managed by a nephrologist and renal dietitian.',
    provenBy: 'Klahr et al. (1994) MDRD study; KDOQI guidelines; KDIGO guidelines',
    recommendedProgramTypes: ['recovery-mobility', 'senior-fitness', 'walking-program', 'stress-relief']
  }
];

// ============================================================
// SPECIALIZED PROTOCOLS (6)
// ============================================================

const specializedDiets: DietProgram[] = [
  {
    id: 'vertical-diet',
    name: 'Vertical Diet (Stan Efferding)',
    category: 'specific',
    goal: 'Digestible high-calorie diet for strength athletes',
    difficulty: 'intermediate',
    description: 'The Vertical Diet was created by powerlifter Stan Efferding (first man to squat 1,000 lbs raw). It is built on easily digestible carbohydrate sources (white rice, potatoes, fruit) with lean red meat as the primary protein source. "Vertical" refers to stacking easily digestible, nutrient-dense foods. The diet emphasises reducing digestive stress while achieving very high calorie intake for size and strength gains.',
    scientificBasis: 'Efferding developed the diet through self-experimentation and work with elite powerlifters. The focus on easily digestible carbs (white rice) reduces GI distress during heavy training. The preponderance of red meat provides bioavailable iron, creatine, and amino acids. Multiple elite powerlifters have used variations (Barnett, 2017).',
    whatYouWillGain: 'Improved digestion during high-calorie intake; sustained energy for heavy training; reduced bloating and GI distress; optimal micronutrient intake (esp. iron and zinc); simplified meal prepping.',
    typicalMacros: { protein: '2.0–2.5 g/kg bodyweight (primarily red meat)', carbs: '4–6 g/kg bodyweight (rice, potatoes, fruit)', fat: '0.8–1.0 g/kg (from meat, eggs, added fats)', calories: '3,500–6,000+ kcal/day (goal-dependent)' },
    sampleMeals: [
      'Breakfast: 200 g ground beef (93/7) + 300 g white rice + 2 whole eggs + 1 cup orange juice',
      'Lunch: 250 g sirloin steak + 400 g white rice + 1 cup mixed berries',
      'Dinner: 250 g salmon + 350 g potatoes + spinach sautéed in olive oil + 1 cup yoghurt',
      'Snack: 2 bananas; rice cakes with honey; intra-workout carb drink (Gatorade or similar)',
      'Key foods: Red meat (beef, bison, lamb), white rice, potatoes, eggs, oranges, peppers, bone broth',
      'Avoid: Whole grains, beans, lentils, broccoli, cauliflower (gas-producing foods)'
    ],
    pros: ['Proven by elite powerlifters', 'Easily digestible at high volumes', 'Nutrient-dense and simple', 'Reduces bloating and GI distress', 'Clear "eat this" food list'],
    cons: ['Very high food cost (quality beef)', 'Low dietary variety (rice + beef + potatoes)', 'High red meat intake concerns', 'Not suitable for general population', 'Low in fibre from avoidance of whole grains and legumes'],
    bestFor: 'Advanced strength athletes, powerlifters, and bodybuilders needing high-calorie intake with minimal digestive distress. Also useful for individuals with sensitive digestion.',
    provenBy: 'Stan Efferding; elite powerlifter adoption; Derek Barnett (2017)',
    recommendedProgramTypes: ['starting-strength', 'stronglifts-5x5', 'madcow-5x5', 'smolov', 'sheiko', 'westside-barbell']
  },
  {
    id: 'rp-diet',
    name: 'Renaissance Periodization Diet',
    category: 'bodybuilding',
    goal: 'Phased nutrition based on training block goals (hypertrophy or cut)',
    difficulty: 'intermediate',
    description: 'The Renaissance Periodization (RP) Diet, created by Dr Eric Helms and the RP team, provides a systematic framework for adjusting calories and macros based on training phases: maintenance, massing (hypertrophy/high calories), and cutting (fat loss/low calories). Each phase has specific macro guidelines, meal frequency, and daily calorie targets that change weekly as body composition changes. The approach uses templates rather than meal plans.',
    scientificBasis: 'RP is built on sports nutrition periodisation concepts: higher carbohydrate and calories during hypertrophy phases support training volume and recovery (Slater et al., 2019). The templates are based on lean body mass calculation and activity level. The RP approach has been validated through thousands of client outcomes and the RP strength app.',
    whatYouWillGain: 'Optimised body composition in all phases; structured overfeeding (no dirty bulk) and dieting (sustainable cuts); weekly macro adjustments based on progress; training phase-specific nutrition; long-term adherence system.',
    typicalMacros: { protein: '1.8–2.5 g/kg LBM (high throughout all phases)', carbs: 'Massing: 4–7 g/kg; Cutting: 2–3 g/kg (highest around training)', fat: 'Massing: 0.6–0.8 g/kg; Cutting: 0.5–0.7 g/kg', calories: 'Massing: +10–20% maintenance; Cutting: deficit of 300–500 kcal/day' },
    sampleMeals: [
      'Phase 1 (massing) breakfast: 2 whole eggs + 150 g oatmeal + 1 banana + 30 g whey protein',
      'Phase 1 (massing) lunch: 200 g chicken + 300 g rice + vegetables + 1 tbsp olive oil',
      'Phase 1 (massing) dinner: 250 g beef + 350 g potato + vegetables + 1 tbsp butter',
      'Phase 2 (cutting) breakfast: 3 eggs + 100 g oatmeal + 1 scoop whey',
      'Phase 2 (cutting) lunch: 200 g chicken + 150 g rice + vegetables (minimal fat)',
      'Phase 2 (cutting) dinner: 200 g white fish + 200 g potato + large vegetable portion'
    ],
    pros: ['Scientifically periodised nutrition', 'Adjusts to individual progress and training phase', 'Templates instead of rigid meal plans', 'Proven in bodybuilding/physique populations', 'App-based macro tracking available'],
    cons: ['Complex to set up without the app or coach', 'Requires consistent food tracking', 'Template learning curve', 'Expensive (app subscription or coaching)', 'Massing phase can cause excessive fat gain if not followed precisely'],
    bestFor: 'Bodybuilders, physique athletes, and trained individuals wanting phase-based nutrition aligned to hypertrophy (massing) and cutting cycles.',
    provenBy: 'Dr Eric Helms; RP Strength; Slater et al. (2019); thousands of physique athlete outcomes',
    recommendedProgramTypes: ['phul', 'phat', 'german-volume-training', 'smolov', 'sheiko', 'dc-training']
  },
  {
    id: 'carb-cycling',
    name: 'Carb Cycling',
    category: 'fat-loss',
    goal: 'Alternating low and high carbohydrate days for fat loss and performance',
    difficulty: 'intermediate',
    description: 'Carb Cycling systematically varies carbohydrate intake across the week, with high-carb days on training days (to fuel performance and recovery) and low-carb days on rest days (to enhance fat adaptation). A typical week has 2–4 high-carb days, 2–4 moderate days, and 1–2 low/no-carb days. Protein remains consistently high. This approach aims to retain the metabolic benefits of both high and low carbohydrate intake.',
    scientificBasis: 'Carb cycling aims to take advantage of the "carb backfill" effect: post-exercise carbohydrate intake replenishes glycogen and drives leucine into muscle tissue (Ivy et al., 1988). Low-carb days increase fat oxidation and improve insulin sensitivity (Zajac et al., 2014). Periodised carbohydrate intake outperforms both constant low-carb and constant high-carb in some body composition studies.',
    whatYouWillGain: 'Flexible fat loss with maintained training performance; insulin sensitivity management; improved metabolic flexibility; higher compliance through "carb rewards" on training days; body recomposition potential.',
    typicalMacros: { protein: '2.0–2.5 g/kg bodyweight (constant high)', carbs: 'High days: 4–6 g/kg; Moderate: 2–3 g/kg; Low: 0.5–1.0 g/kg', fat: 'High days: 0.5 g/kg; Low days: up to 1.2 g/kg (higher to compensate for energy)', calories: 'High days: maintenance or surplus; Low days: 400–800 kcal deficit' },
    sampleMeals: [
      'High carb training day breakfast: Porridge with banana, honey, berries + 4 eggs + toast + juice',
      'High carb training day lunch: 200 g chicken + 400 g rice + vegetables + piece fruit',
      'High carb training day dinner: 250 g sweet potato + 200 g lean beef + vegetables',
      'Low carb rest day breakfast: 3-egg omelette with cheese, spinach, mushrooms + avocado + coffee',
      'Low carb rest day lunch: 200 g salmon + large salad with olive oil + nuts + seeds',
      'Low carb rest day dinner: 200 g chicken thigh + stir-fried vegetables in coconut oil'
    ],
    pros: ['Training and rest day optimisation', 'Flexibility aids long-term adherence', 'Maintains performance during deficit', 'Better than constant low-carb for athletes', 'Shortcut to macros approach'],
    cons: ['Complex to plan and track multiple day types', 'Risk of "carb creep" on low days', 'Requires high food awareness', 'May be unnecessary for general population', 'Can lead to disordered eating patterns'],
    bestFor: 'Trained individuals wanting body recomposition (losing fat while maintaining/building muscle) who train on a defined weekly schedule.',
    provenBy: 'Ivy et al. (1988); Zajac et al. (2014); practical bodybuilding/nutrition coaching',
    recommendedProgramTypes: ['phul', 'phat', 'ppl', 'upper-lower-split', 'nsuns-lp']
  },
  {
    id: 'f-factor-diet',
    name: 'F-Factor Diet (High Fibre)',
    category: 'maintenance',
    goal: 'High-fibre, moderate carbohydrate diet for weight management and health',
    difficulty: 'beginner',
    description: 'The F-Factor Diet, created by registered dietitian Tanya Zuckerbrot, is built on a foundation of high fibre intake (35–50 g/day), moderate carbohydrates, lean protein, and healthy fats. It uses fibre as the "secret weapon" for satiety, appetite control, blood sugar stabilisation, and digestive health. The diet follows a three-phase approach: Phase 1 (strict, low-cal), Phase 2 (transition), Phase 3 (maintenance).',
    scientificBasis: 'High fibre intake is consistently associated with lower body weight, reduced cardiovascular disease risk, better glycaemic control, and improved gut health (Anderson et al., 2009). The Institute of Medicine recommends 25–38 g fibre/day for adults, and most people consume only 12–16 g/day. Fibre’s satiety effects are well-documented (Slavin, 2005).',
    whatYouWillGain: 'Improved satiety and appetite control; regular bowel movements; stable blood glucose; reduced cholesterol; sustainable weight loss without extreme restriction.',
    typicalMacros: { protein: '20–25% of calories (lean sources)', carbs: '50–55% of calories (primarily fibre-dense sources)', fat: '20–25% of calories (emphasis on unsaturated)', calories: 'Phase 1: ~1,200–1,500 (women); 1,500–1,800 (men). Higher in later phases' },
    sampleMeals: [
      'Phase 1 breakfast: High-fibre cereal (e.g., Fibre One) with skim milk and berries; coffee',
      'Phase 1 lunch: Tuna salad (light mayo) on rye crispbread with cucumber slices; apple; sugar-free gelatin',
      'Phase 1 dinner: Grilled chicken (150 g) with broccoli, cauliflower, and green beans + brown rice (½ cup)',
      'Phase 1 snack: Air-popped popcorn; celery with hummus; fibre-rich crackers',
      'Emphasised foods: Bran cereals, beans/legumes, raspberries, pears, artichokes, broccoli, chia seeds, popcorn',
      'Phase 3 (maintenance): 35–50 g fibre daily; more flexibility with calorie-dense foods'
    ],
    pros: ['High satiety due to fibre volume', 'Cardiovascular health benefits', 'Simple principle (get more fibre)', 'Structured phases', 'Regular digestive health'],
    cons: ['Very high fibre can cause gas/bloating at start', 'Phase 1 is quite low calorie', 'Requires fibre counting at first', 'Many processed "high fibre" foods exist', 'Excess fibre can impair mineral absorption'],
    bestFor: 'Individuals wanting a structured, satiety-focused weight management approach with strong digestive health benefits.',
     provenBy: 'Tanya Zuckerbrot MS RD; Anderson et al. (2009); Slavin (2005); Institute of Medicine',
    recommendedProgramTypes: ['walking-program', 'full-body-3x', 'foundation-training', 'senior-fitness']
  },
  {
    id: 'seed-oil-avoidance',
    name: 'Seed Oil Avoidance Protocol',
    category: 'specific',
    goal: 'Eliminate industrial seed oils to reduce inflammation',
    difficulty: 'intermediate',
    description: 'The Seed Oil Avoidance Protocol eliminates industrially refined seed oils high in omega-6 polyunsaturated fatty acids (linoleic acid): soybean oil, canola oil, corn oil, cottonseed oil, sunflower oil, safflower oil, grapeseed oil, rice bran oil, and peanut oil. These oils are ubiquitous in ultra-processed foods, restaurant cooking, and salad dressings. The protocol replaces them with traditional fats: butter, ghee, tallow, lard, coconut oil, olive oil, and avocado oil.',
    scientificBasis: 'The "seed oil hypothesis" proposes that the massive increase in dietary linoleic acid (LA) since the early 20th century contributes to obesity, inflammation, and chronic disease (Simopoulos, 2002; Ramsden et al., 2010). LA-rich seed oils accumulate in adipose tissue and may increase oxidative stress. However, major health organisations (AHA) continue to recommend PUFAs for heart health, creating significant controversy.',
    whatYouWillGain: 'Reduced dietary omega-6 intake; elimination of industrial processing byproducts (trans fats, aldehydes); improved omega-3:6 ratio; reduced inflammatory markers (anecdotal); elimination of ultra-processed foods by default.',
    typicalMacros: { protein: '20–30% of calories', carbs: '20–35% of calories (depends on overall approach)', fat: '35–50% of calories (from traditional sources only)', calories: 'Variable (goal-dependent)' },
    sampleMeals: [
      'Breakfast: 3-egg omelette cooked in butter with vegetables and avocado',
      'Lunch: Grilled chicken salad with olive oil and vinegar dressing (no restaurant dressing)',
      'Dinner: Ribeye steak cooked in tallow with roasted potatoes (tossed in olive oil) and steamed broccoli',
      'Snack: Apple with almond butter; nuts; cheese; olives; beef jerky (check ingredients)',
      'Approved cooking fats: Butter, ghee, tallow, lard, coconut oil, extra-virgin olive oil, avocado oil',
      'Avoid: All restaurant fried foods, mayonnaise (most brands use soybean oil), packaged snacks, most vinaigrettes'
    ],
    pros: ['Eliminates many ultra-processed foods', 'Uses traditional, time-tested fats', 'Reduces omega-6 overload', 'Clear which fats to use', 'Aligns with many ancestral/whole-foods approaches'],
    cons: ['Very difficult dining out (hidden oils everywhere)', 'Controversial scientific consensus', 'Some seed oils are unavoidable in the food supply', 'Requires meticulous label reading', 'Labelling "seed oils = poison" may be overstated'],
    bestFor: 'Health-conscious individuals wanting to minimise industrial food processing byproducts and rebalance omega-3:6 ratios. Useful for those with suspected inflammatory responses to seed oils.',
    provenBy: 'Simopoulos (2002); Ramsden et al. (2010); Tucker et al. (2014) (omega-6 oxidation)',
    recommendedProgramTypes: ['starting-strength', 'full-body-3x', 'greyskull-lp', 'convict-conditioning']
  },
  {
    id: 'bulletproof-diet',
    name: 'Bulletproof Diet',
    category: 'keto',
    goal: 'Biohacked ketogenic eating for mental performance and weight loss',
    difficulty: 'intermediate',
    description: 'The Bulletproof Diet, created by Dave Asprey, is a modified ketogenic approach emphasising "high-quality" fats (grass-fed butter, MCT oil from coconut), moderate protein, and low-carbohydrate vegetables. It introduces the Bulletproof Coffee (coffee blended with grass-fed butter and MCT oil) as a breakfast replacement. The diet has a "biohacking" philosophy: specific food choices optimise cognitive function, mitochondrial health, and cellular performance.',
    scientificBasis: 'The Bulletproof diet draws on several established concepts: MCT oils produce ketones more efficiently than LCTs (St-Pierre et al., 2019), caffeine improves cognitive performance, and grass-fed dairy has a more favourable fatty acid profile. The "upgraded" food quality claims are Asprey\'s synthesis of existing nutrition science with varying levels of evidence.',
    whatYouWillGain: 'Sustained mental energy without blood sugar crashes; stable ketosis facilitated by MCT oil; reduced food cravings; improved focus and cognitive performance; simplified meal timing with breakfast replacement.',
    typicalMacros: { protein: '20–25% of calories (moderate)', carbs: '5–10% of calories (from vegetables only)', fat: '65–75% of calories (MCT oil, butter, ghee, avocado, nuts)', calories: 'Ad libitum (Bulletproof Coffee suppresses appetite)' },
    sampleMeals: [
      'Breakfast: Bulletproof Coffee (brewed coffee + 1–2 tbsp grass-fed butter + 1–2 tbsp Brain Octane MCT oil)',
      'Lunch: Large salad with grilled wild salmon, avocado, pumpkin seeds, olive oil, and lemon juice',
      'Dinner: Grass-fed ribeye steak with roasted asparagus and broccoli dressed in ghee',
      'Snack: Macadamia nuts; celery with almond butter; bone broth; collagen protein shake',
      '"Upgraded" foods: Pasture-raised eggs, grass-fed meat, wild-caught fish, organic vegetables',
      'Avoid: Grains, legumes, sugar, industrial seed oils, conventional dairy (except grass-fed butter/ghee)'
    ],
    pros: ['Very high satiety via fat + coffee', 'Mental clarity benefits (anecdotal)', 'Stable energy without blood sugar swings', 'Collective of supportive "biohacking" community', 'Clear food hierarchy (avoid/caution/enjoy tiers)'],
    cons: ['Expensive ("upgraded" foods are premium priced)', 'Coffee breakfast replacement is controversial', 'High MCT oil causes GI distress in many', 'Some claims lack rigorous scientific backing', 'Is socially isolating (no grains, no sugar, special coffee)'],
    bestFor: 'Biohacking enthusiasts, individuals wanting to pair ketosis with mental performance optimisation, and people who prefer a structured "tiered" food system.',
    provenBy: 'Dave Asprey; St-Pierre et al. (2019) (MCT metabolism); extensive community outcomes',
    recommendedProgramTypes: ['full-body-3x', 'starting-strength', 'convict-conditioning', 'walking-program']
  }
];

// ============================================================
// RECOVERY / HEALTH DIETS (5)
// ============================================================

const recoveryDiets: DietProgram[] = [
  {
    id: 'post-surgery-nutrition',
    name: 'Post-Surgery Recovery Protocol',
    category: 'specific',
    goal: 'Optimise surgical recovery through targeted nutrition',
    difficulty: 'intermediate',
    description: 'The Post-Surgery Recovery Protocol provides nutritional support for wound healing, infection prevention, and strength restoration after surgery. It emphasises high protein (1.5–2.5 g/kg for wound healing), adequate calories to prevent catabolism, vitamin C (collagen synthesis), zinc (wound healing), and iron (blood loss recovery). The protocol adapts to surgery type (orthopaedic, abdominal, cardiac) and post-operative metabolic state.',
    scientificBasis: 'Surgery induces a hypermetabolic, catabolic state requiring 15–30 kcal/kg/day and 1.5–2.0 g/kg protein (Weimann et al., 2006). Vitamin C deficiency impairs collagen synthesis (Boyera et al., 1998). The ERAS (Enhanced Recovery After Surgery) protocol shows that early oral nutrition reduces complications and hospital stays (Gustafsson et al., 2012).',
    whatYouWillGain: 'Accelerated wound healing; reduced infection risk; maintained lean mass during recovery; reduced post-operative fatigue; faster return to normal function.',
    typicalMacros: { protein: '1.5–2.5 g/kg bodyweight (higher than normal)', carbs: '50–60% of calories (adequate glucose for healing)', fat: '25–30% of calories (essential fatty acids for inflammation)', calories: '25–35 kcal/kg/day (higher for burns, sepsis, major trauma)' },
    sampleMeals: [
      'Breakfast: 3–4 eggs + 1 cup oatmeal with protein powder + orange juice (vitamin C)',
      'Lunch: 200 g chicken + 250 g rice + large portion steamed vegetables + glass milk',
      'Dinner: 200 g salmon + 200 g sweet potato + broccoli + side salad with olive oil',
      'Snack: Greek yoghurt with berries; protein shake; bone broth; zinc-rich foods (pumpkin seeds)',
      'Key nutrients: Protein (meat, eggs, dairy), vitamin C (citrus, bell peppers), zinc (oysters, beef, seeds)',
      'Hydration: 2–3 L/day (increase if fever, drains, or vomiting)'
    ],
    pros: ['Clinically proven to improve outcomes', 'Reduces hospital stay duration', 'Speeds wound healing and recovery', 'Prevents muscle wasting during inactivity', 'Adaptable to different surgery types'],
    cons: ['Appetite often suppressed after surgery', 'Nausea may limit food intake', 'Requires meal support during early recovery', 'Specific nutrient supplementation may be needed', 'Must coordinate with medical team and restrictions'],
    bestFor: 'Individuals recovering from surgery (esp. orthopaedic, GI, cardiac, or general surgery). Requires coordination with surgical team.',
    provenBy: 'Weimann et al. (2006); Gustafsson et al. (2012) ERAS protocol; ESPEN guidelines',
    recommendedProgramTypes: ['recovery-mobility', 'foundation-training', 'walking-program', 'stress-relief']
  },
  {
    id: 'bone-broth-diet',
    name: 'Bone Broth & Gut Healing Protocol',
    category: 'specific',
    goal: 'Gut barrier repair and collagen support through bone broth-based nutrition',
    difficulty: 'intermediate',
    description: 'The Bone Broth Protocol centres on slow-simmered animal bone broth (rich in collagen, gelatin, glycine, glutamine, and minerals) as a therapeutic food for gut barrier repair, joint health, and recovery. It typically includes 1–3 cups of bone broth daily alongside a whole-foods, gut-friendly diet that eliminates known irritants (grains, dairy, processed foods). The protocol is used in functional medicine for leaky gut syndrome, digestive disorders, and joint health.',
    scientificBasis: 'Bone broth is a rich source of gelatin (hydrolysed collagen), glycine, glutamine, and minerals. Glutamine is the primary fuel for enterocytes and supports gut barrier integrity (Rao & Samak, 2012). Collagen supplementation improves skin elasticity and joint pain (Clark et al., 2008; Choi et al., 2014). Glycine has anti-inflammatory and sleep-promoting effects.',
    whatYouWillGain: 'Improved gut barrier function; reduced intestinal permeability; joint pain reduction; improved skin health; better sleep quality (glycine effect); enhanced recovery from exercise.',
    typicalMacros: { protein: '25–35% of calories (broth + whole foods)', carbs: '20–30% of calories (easily digestible vegetables)', fat: '35–45% of calories (emphasises anti-inflammatory fats)', calories: '1,800–2,800 (individualised)' },
    sampleMeals: [
      'Morning: 1 cup bone broth upon waking + collagen peptides in warm water',
      'Breakfast: 3-egg omelette with vegetables cooked in ghee + 1 cup bone broth on the side',
      'Lunch: 200 g chicken + roasted vegetables + fermented sauerkraut + bone broth-based sauce',
      'Dinner: Slow-cooked beef stew (made with bone broth base) with carrots, celery, and herbs',
      'Snack: Bone broth; collagen gummies; gelatin-based panna cotta (with coconut milk)',
      'Daily minimum: 1–3 cups bone broth (chicken, beef, fish) ideally homemade or high-quality prepared'
    ],
    pros: ['Food-based approach to gut health', 'Supports joint health and skin', 'Glycine promotes deeper sleep', 'Glutamine supports gut barrier', 'Broth is warming and easily digestible'],
    cons: ['Homemade broth is very time-consuming to prepare', 'Quality prepared broth is expensive ($6–10/pint)', 'Evidence is largely mechanistic (few human RCTs)', 'The "leaky gut" diagnosis is controversial', 'Broth can be high in lead if animals were not grass-fed'],
    bestFor: 'Individuals with gut health concerns (leaky gut, IBS, IBD recovery), joint pain, skin issues, or those wanting a nutrient-dense recovery food to add to their diet.',
    provenBy: 'Rao & Samak (2012); Clark et al. (2008); Choi et al. (2014); functional medicine practice',
    recommendedProgramTypes: ['recovery-mobility', 'yoga-for-athletes', 'foundation-training', 'stress-relief']
  },
  {
    id: 'longevity-blue-zone',
    name: 'Blue Zone / Longevity Diet',
    category: 'maintenance',
    goal: 'Extend healthspan and lifespan through dietary and lifestyle patterns',
    difficulty: 'beginner',
    description: 'The Blue Zone diet is based on the eating habits of populations in five regions with the highest concentrations of centenarians: Okinawa (Japan), Sardinia (Italy), Nicoya (Costa Rica), Ikaria (Greece), and Loma Linda (California). Common patterns include: 95% plant-based (beans, greens, sweet potatoes, whole grains, nuts), small amounts of fish, minimal meat (mostly on special occasions), no processed food, moderate wine intake (1–2 glasses/day), and calorie restriction through mindful eating (Hara Hachi Bu: eat until 80% full).',
    scientificBasis: 'The Blue Zones research by Buettner & Skemp (2016) identified dietary patterns common across longevity hotspots. The Okinawan diet\'s low-calorie density and high phytonutrient content correlates with exceptional longevity (Willcox et al., 2009). The Mediterranean components (Ikaria) are supported by the PREDIMED trial.',
    whatYouWillGain: 'Reduced chronic disease risk; extended healthspan; better weight management; improved cardiovascular health; lower cancer risk; stronger community and lifestyle habits.',
    typicalMacros: { protein: '12–18% of calories (mostly plant-based)', carbs: '65–75% of calories (vegetables, beans, whole grains, sweet potatoes)', fat: '15–20% of calories (emphasises unsaturated; very low saturated fat)', calories: 'Typically 1,800–2,200 (Hara Hachi Bu: 80% full)' },
    sampleMeals: [
      'Okinawan breakfast: Miso soup with tofu, seaweed, and green onions; brown rice; green tea',
      'Sardinian lunch: Whole-grain flatbread (pane carasau), minestrone soup, feta cheese, olives, red wine (1 glass)',
      'Ikarian dinner: Lentil soup with vegetables, wild greens, whole-grain bread, olive oil, lemon',
      'Snack: Nuts (especially almonds, walnuts); fresh fruit; beans/legume spreads; green tea throughout the day',
      'Loma Linda style: Plant-based "Creation Diet" (vegetarian/vegan), nuts, avocado, water',
      'Daily pillars: Beans/legumes, whole grains, nuts, greens, fruit, water, tea, and wine in moderation'
    ],
    pros: ['Extremely strong epidemiological evidence', 'Simple and flexible approach', 'Emphasises plant-based whole foods', 'Combines diet + lifestyle + community', 'No calorie counting needed'],
    cons: ['Long-term adherence to very low animal products', 'May be too low in protein for active individuals', 'Requires lifestyle changes beyond diet', 'Some Blue Zone specific foods are not widely available', 'Observational data cannot prove causation'],
    bestFor: 'Anyone wanting a science-backed longevity diet with strong epidemiological evidence. Especially suitable for older adults and those prioritising healthspan extension.',
    provenBy: 'Buettner & Skemp (2016); Willcox et al. (2009); PREDIMED; extensive epidemiological research',
    recommendedProgramTypes: ['walking-program', 'yoga-for-athletes', 'senior-fitness', 'foundation-training']
  },
  {
    id: 'fertility-diet',
    name: 'Fertility Diet',
    category: 'specific',
    goal: 'Optimise reproductive health and fertility through nutrition',
    difficulty: 'intermediate',
    description: 'The Fertility Diet is a nutrient-dense eating pattern designed to improve reproductive function in both women and men. It emphasises monounsaturated fats (avocado, olive oil, nuts) instead of trans fats, high-quality plant protein, slow-digesting carbohydrates with low glycaemic load, full-fat dairy (instead of skim), and key micronutrients: folate, zinc, selenium, vitamin D, omega-3s, iodine, and CoQ10. It limits alcohol, caffeine, and processed foods.',
    scientificBasis: 'The Nurses\' Health Study (Chavarro et al., 2007) found that following the Fertility Diet pattern reduced ovulatory infertility by 66%. Key mechanisms: trans fats impair insulin sensitivity and ovulation, full-fat dairy improves ovarian function, plant protein reduces anovulation, and antioxidants improve sperm quality (Showell et al., 2014).',
    whatYouWillGain: 'Improved ovulation regularity; better sperm quality (count, motility, morphology); increased IVF success rates; reduced risk of ovulatory infertility; healthier pregnancy outcomes.',
    typicalMacros: { protein: '20–25% of calories (emphasis on plant sources + fish)', carbs: '40–50% of calories (low-GI, high-fibre sources)', fat: '30–35% of calories (emphasis on unsaturated, full-fat dairy, omega-3s)', calories: 'Sufficient for healthy BMI; slight surplus may improve fertility in underweight women' },
    sampleMeals: [
      'Breakfast: Full-fat Greek yoghurt with berries, walnuts, and ground flaxseed (omega-3s + folate)',
      'Lunch: Lentil and vegetable soup with a side of whole-grain bread + 1 tbsp olive oil + piece fruit',
      'Dinner: Grilled wild salmon (omega-3s) with quinoa, asparagus, and a mixed green salad with avocado',
      'Snack: Brazil nuts (selenium 1–2/day); orange; full-fat cheese; carrot sticks with hummus',
      'Key nutrients: Folate (leafy greens, lentils), zinc (oysters, pumpkin seeds), vitamin D (salmon, eggs, sunlight), CoQ10 (organ meats, sardines)',
      'Limit: Caffeine (<200 mg/day during conception attempts), alcohol (avoid during fertile window), trans fats (fully avoid)'
    ],
    pros: ['Proven to improve fertility outcomes', 'Addresses male and female fertility', 'Nutrient-dense and heart-healthy', 'Compatible with IVF support', 'Promotes healthy BMI for conception'],
    cons: ['Requires limiting or eliminating alcohol and caffeine', 'Some foods (organ meats) are not popular', 'Full-fat dairy goes against conventional diet advice', 'May require supplements for key nutrients', 'Stress around "optimising" diet can be counterproductive'],
    bestFor: 'Couples trying to conceive, especially those with ovulatory infertility or male factor infertility. Also useful for those undergoing IVF or other fertility treatments.',
    provenBy: 'Chavarro et al. (2007); Showell et al. (2014); Nurses\' Health Study; ESHRE guidelines',
    recommendedProgramTypes: ['yoga-for-athletes', 'walking-program', 'stress-relief', 'foundation-training']
  },
  {
    id: 'detox-support-protocol',
    name: 'Detoxification Support Protocol',
    category: 'specific',
    goal: 'Support the liver\'s natural detoxification pathways through targeted nutrition',
    difficulty: 'intermediate',
    description: 'The Detox Support Protocol is a short-term nutritional approach designed to support the liver\'s phase I and phase II detoxification pathways. It emphasises cruciferous vegetables (sulforaphane), allium vegetables (garlic, onions, sulfur compounds), antioxidant-rich fruits (berries, citrus), adequate protein (for conjugation pathways), hydration, and specific nutrients (methylation donors, B vitamins, glutathione precursors). It is not a "cleanse" or "fast" but rather a targeted whole-foods pattern.',
    scientificBasis: 'The liver detoxification system involves phase I (cytochrome P450 activation) and phase II (conjugation) pathways. Sulforaphane from broccoli sprouts induces phase II enzymes (Fahey et al., 1997). Methylation pathways require folate, B12, B6, choline, and methionine. N-acetylcysteine (NAC) is a glutathione precursor. Calcium-D-glucarate supports glucuronidation (Walaszek, 1990).',
    whatYouWillGain: 'Enhanced liver detoxification capacity; improved elimination of environmental toxins; increased antioxidant status; better energy and digestion; reduced oxidative stress.',
    typicalMacros: { protein: '20–25% of calories (adequate for conjugation)', carbs: '45–55% of calories (vegetables, low-glycaemic fruit)', fat: '25–30% of calories (anti-inflammatory fats)', calories: 'Adequate to avoid catabolism (malnutrition impairs detox)' },
    sampleMeals: [
      'Breakfast: Green smoothie (kale, broccoli sprouts, half green apple, ginger, lemon, cucumber, water)',
      'Lunch: Large mixed salad with grilled chicken, roasted broccoli, beetroot, walnuts, and olive oil dressing',
      'Dinner: Baked cod with turmeric cauliflower, garlic sautéed kale, and roasted sweet potato',
      'Snack: Celery with almond butter; berries; green tea; Brazil nuts (1–2 selenium)',
      'Key foods: Broccoli sprouts, garlic, onions, turmeric, beetroot, green tea, berries, Brazil nuts, cilantro',
      'Supporting nutrients: NAC, milk thistle (silymarin), calcium-D-glucarate, methylated B vitamins'
    ],
    pros: ['Science-based liver support', '"Detox" without dangerous fasting/cleanses', 'Emphasises antioxidant-rich foods', 'Short-term (2–4 weeks) is manageable', 'Encourages vegetables (most are deficient)'],
    cons: ['The "detox" label is clinically controversial', 'Market overpromises what diet can achieve', 'May be used to justify dangerous "cleanse" behaviour', 'Evidence is mainly mechanistic', 'Not a substitute for reducing toxin exposure'],
    bestFor: 'Short-term (2–4 weeks) nutritional support for individuals with known toxin exposure, those wanting to reduce processed food intake, or those following a period of dietary excess (holiday, travel).',
    provenBy: 'Fahey et al. (1997); Walaszek (1990); clinical detox pathway science',
    recommendedProgramTypes: ['recovery-mobility', 'yoga-for-athletes', 'walking-program', 'foundation-training']
  }
];

// ============================================================
// MAINTENANCE / BALANCED DIETS (5)
// ============================================================

const maintenanceDiets: DietProgram[] = [
  {
    id: 'balanced-macros-maintenance',
    name: 'Balanced Macros Maintenance',
    category: 'maintenance',
    goal: 'Sustain body composition with flexible, balanced nutrition',
    difficulty: 'beginner',
    description: 'The Balanced Macros Maintenance approach is a flexible eating pattern designed to maintain current body composition and weight. It uses a moderate macronutrient split (40% carbs, 30% protein, 30% fat) with calories set to maintenance level. There is no restriction on food types; the approach emphasises portion control, food quality, and sustainable habits rather than elimination. It is the default recommendation for individuals at their goal who want a long-term, non-restrictive eating pattern.',
    scientificBasis: 'Set-point theory suggests the body defends a weight range, making maintenance less metabolically demanding than losing or gaining (Leibel et al., 1995). Energy balance equations (Hall et al., 2012) show weight stability with calorie intake matching expenditure. Adherence research shows flexible approaches outperform rigid restriction in the long term (West et al., 2011).',
    whatYouWillGain: 'Stable weight and body composition; freedom from dieting cycles; flexible eating for social situations; balanced energy throughout the day; nutrient adequacy without restriction.',
    typicalMacros: { protein: '1.6–2.2 g/kg bodyweight', carbs: '40–50% of calories (varied sources)', fat: '25–30% of calories (emphasis on unsaturated)', calories: 'Maintenance level (TDEE; typically 1,800–2,800 kcal/day)' },
    sampleMeals: [
      'Breakfast: Greek yoghurt parfait with granola, mixed berries, and honey',
      'Lunch: Turkey and avocado wrap with whole-grain tortilla, lettuce, tomato, and mustard + side fruit',
      'Dinner: Grilled chicken breast (200 g) with quinoa, roasted vegetables, and a drizzle of tahini dressing',
      'Snack: Trail mix; protein bar; apple with peanut butter; cheese and crackers',
      'Flexible approach: 80–90% nutrient-dense foods, 10–20% discretionary (dessert, dining out, treats)',
      'Tracking: Optional once maintenance is established (every-other-day weighing, mindful eating)'
    ],
    pros: ['Sustainable without food restriction', 'Flexible enough for all social situations', 'Balanced macro distribution suits most people', 'No "bad" foods — all foods fit', 'Easy to follow long-term'],
    cons: ['May be too flexible for those who need structure', 'Maintenance mindset doesn\'t drive progress', 'Easy to overeat without tracking', 'Not designed for specific health issues', 'No optimisation for athletic performance'],
    bestFor: 'Individuals at their goal body composition who want a sustainable, flexible eating pattern without dietary restriction or competitive pressures.',
    provenBy: 'Leibel et al. (1995); Hall et al. (2012); West et al. (2011)',
    recommendedProgramTypes: ['full-body-3x', 'phul', 'upper-lower-split', 'ppl', 'walking-program']
  },
  {
    id: 'intuitive-eating',
    name: 'Intuitive Eating',
    category: 'maintenance',
    goal: 'Rebuild a healthy relationship with food through body trust',
    difficulty: 'beginner',
    description: 'Intuitive Eating (IE) is a non-diet framework developed by dietitians Evelyn Tribole and Elyse Resch. It rejects diet mentality and guides individuals to trust their internal hunger/fullness cues. The 10 principles include: reject the diet mentality, honour your hunger, make peace with food, challenge the food police, respect your fullness, discover the satisfaction factor, honour your feelings without using food, respect your body, movement — feel the difference, and honour your health with gentle nutrition.',
    scientificBasis: 'Intuitive Eating is supported by over 100 studies showing association with lower BMI, better psychological well-being, reduced disordered eating, and improved cholesterol levels (Bruce & Ricciardelli, 2016; Van Dyke & Drinkwater, 2014). IE is associated with lower weight cycling and better diet quality compared to restrictive approaches. Long-term studies show maintained improvements.',
    whatYouWillGain: 'Freedom from diet/binge cycles; restored hunger and fullness cues; reduced guilt around food; improved body image and self-esteem; sustainable weight stability; reduced disordered eating patterns.',
    typicalMacros: { protein: 'Variable (body-guided appetite)', carbs: 'Variable (no restrictions, all foods fit)', fat: 'Variable (includes all types of fats)', calories: 'Body-regulated (unrestricted, based on hunger signals)' },
    sampleMeals: [
      'No prescribed meals (the individual chooses based on cravings + hunger + gentle nutrition)',
      'Example day: Breakfast when hungry (eggs and toast, or just coffee if not hungry)',
      'Lunch: Satisfying meal (sandwich, salad with protein, leftovers — whatever sounds good)',
      'Dinner: Cooked meal with protein + starch + vegetables (gentle nutrition principle)',
      'Snack: Permission to eat whenever physically hungry (fruit, chocolate, chips, yoghurt — all foods fit)',
      'Key principle: "You can eat anything" — removing scarcity mindset reduces bingeing'
    ],
    pros: ['Eliminates diet/binge cycling', 'Improves mental health and body image', 'Strong research base', 'Applicable for life (not temporary)', 'Reduces eating disorder risk'],
    cons: ['Not designed for weight loss', 'Difficult for people who need structure', 'Initial anxiety when removing rules', '"Gentle nutrition" phase requires food literacy', 'Not suitable for competition prep'],
    bestFor: 'Individuals with a history of dieting, disordered eating, or poor body image who need to rebuild a healthy relationship with food. Also for those tired of restrictive dieting.',
    provenBy: 'Tribole & Resch (1995, 2020); Bruce & Ricciardelli (2016); Van Dyke & Drinkwater (2014); 100+ studies',
    recommendedProgramTypes: ['walking-program', 'yoga-for-athletes', 'foundation-training', 'recovery-mobility']
  },
  {
    id: '80-20-diet',
    name: '80/20 Nutrition Rule',
    category: 'maintenance',
    goal: 'Flexible, balanced eating with 80% whole foods and 20% flexibility',
    difficulty: 'beginner',
    description: 'The 80/20 Nutrition Rule is a flexible approach where 80% of calories come from nutrient-dense whole foods (vegetables, fruits, lean proteins, whole grains, healthy fats) and 20% come from discretionary foods (desserts, alcohol, treats, dining out). The principle is adherence-friendly: rather than eliminating "bad" foods, you incorporate them in controlled amounts. No food tracking required — it\'s a visual/mental guideline.',
    scientificBasis: 'The 80/20 principle (Pareto principle) applied to nutrition aligns with research showing that near-perfect adherence is unnecessary for good health outcomes (Dansinger et al., 2005). Nutritional flexibility improves long-term adherence and psychological well-being (Schaumberg et al., 2016). The approach removes the "all-or-nothing" mentality that causes diet dropout.',
    whatYouWillGain: 'Sustainable healthy eating without deprivation; flexibility for social situations; reduced guilt around treats; consistent nutritional quality (80% whole foods); improved adherence compared to strict diets.',
    typicalMacros: { protein: '15–25% of calories', carbs: '45–55% of calories', fat: '25–35% of calories', calories: 'Ad libitum (indirectly controlled by food quality)' },
    sampleMeals: [
      'Breakfast (80% portion): Oatmeal with berries, nuts, and a dollop of Greek yoghurt',
      'Breakfast (20% option): Same oatmeal but add chocolate chips or brown sugar',
      'Lunch (80%): Large salad with grilled chicken, quinoa, avocado, and varied vegetables',
      'Dinner (80%): Baked salmon, roasted sweet potato, and steamed green beans',
      '20% allowance: 1 glass wine with dinner; small dessert; slice of pizza; restaurant meal',
      'Mental rule: "Most of the time choose whole foods; sometimes enjoy treats without guilt"'
    ],
    pros: ['Extremely flexible and sustainable', 'Eliminates "all-or-nothing" diet mentality', 'Works for social eating', 'No tracking or counting required', 'Reduces dietary guilt and anxiety'],
    cons: ['Easy to let 20% become 40% (slippery slope)', '"80%" and "20%" are subjectively defined', 'Not specific enough for medical or performance needs', 'May not produce weight loss in calorie surplus', 'Requires honest self-assessment'],
    bestFor: 'Individuals who want a flexible, sustainable approach to healthy eating without the rigour of tracking macros or following a strict protocol. Ideal for long-term maintenance.',
    provenBy: 'Dansinger et al. (2005); Schaumberg et al. (2016); general diet adherence research',
    recommendedProgramTypes: ['full-body-3x', 'phul', 'upper-lower-split', 'walking-program']
  },
  {
    id: 'reverse-dieting',
    name: 'Reverse Dieting Protocol',
    category: 'maintenance',
    goal: 'Restore metabolism after prolonged dieting through gradual calorie increase',
    difficulty: 'intermediate',
    description: 'Reverse dieting is a structured approach to increase calorie intake after prolonged dieting or significant weight loss. Starting from the dieting endpoint, calories are increased slowly (50–100 kcal/day per week) while tracking body weight and composition. The goal is to restore metabolic rate, normalise hunger hormones, minimise fat regain, and transition to maintenance calories without the rapid weight regain common after restrictive dieting.',
    scientificBasis: 'Prolonged calorie restriction reduces resting metabolic rate (RMR) beyond predicted weight loss — "metabolic adaptation" or "adaptive thermogenesis" (Leibel et al., 1995; Müller & Bosy-Westphal, 2013). Slow calorie increase may normalise thyroid hormones (T3), leptin, and ghrelin (Sumithran et al., 2011). Reverse dieting is widely used in physique coaching, though controlled trials are limited.',
    whatYouWillGain: 'Metabolic rate restoration; reduced hunger drive; psychological relief from restriction; minimal fat regain during weight stabilisation; improved energy and libido; sustainable transition to maintenance.',
    typicalMacros: { protein: '1.8–2.3 g/kg bodyweight (high to protect lean mass)', carbs: 'Start low (~2 g/kg), increase by 10–15 g/day each week', fat: 'Start moderate (~0.6 g/kg), increase slowly', calories: 'Start at current dieting intake, +50–100 kcal/day each week for 4–10 weeks' },
    sampleMeals: [
      'Week 1 (starting): 3 eggs + 1/2 cup oatmeal; 150 g chicken + 200 g rice; 150 g fish + 200 g potato + veg',
      'Week 4 (+300 kcal): Same as week 1 + add 1 banana, extra 50 g rice at lunch, extra 50 g potato at dinner',
      'Week 8 (+600 kcal): Additional 1/2 cup oats + extra egg at breakfast; 1 tbsp peanut butter snack added',
      'Week 12 (+900 kcal): Full maintenance macros — additional snacks, larger portions, higher fat intake',
      'Typical progression: Protein stays high throughout; carbs increase first; fats increase in later weeks',
      'Monitoring: Weekly weight + waist measurement + scale trend; adjust macros if scale moves too fast'
    ],
    pros: ['Minimises post-diet fat regain', 'Restores metabolic rate and energy', 'Improves hunger and mood', 'Structured approach reduces anxiety', 'Focus on health markers beyond weight'],
    cons: ['Slow process (weeks to months)', 'Requires meticulous tracking', 'Weight gain (even if minimal fat) can distress former dieters', 'Limited clinical research specific to reverse dieting', 'Not suitable for those with disordered eating'],
    bestFor: 'Individuals who have been on prolonged calorie restriction (8+ weeks) or significant weight loss and want to transition to maintenance without rapid fat regain.',
    provenBy: 'Leibel et al. (1995); Sumithran et al. (2011); Müller & Bosy-Westphal (2013); physique coaching practice',
    recommendedProgramTypes: ['full-body-3x', 'phul', 'upper-lower-split', 'walking-program']
  },
  {
    id: 'weight-maintenance-after-loss',
    name: 'Weight Loss Maintenance Protocol',
    category: 'maintenance',
    goal: 'Prevent weight regain after successful weight loss',
    difficulty: 'intermediate',
    description: 'The Weight Loss Maintenance protocol is a structured approach to preventing the common problem of weight regain after dieting (within 1–5 years, most dieters regain 50–100% of lost weight). It combines moderate calorie deficit maintenance, high protein intake, consistent exercise, regular self-weighing, and behavioural strategies (stimulus control, problem-solving, and relapse prevention). The approach acknowledges that maintenance requires different strategies than weight loss.',
    scientificBasis: 'The National Weight Control Registry (NWCR) tracks >10,000 individuals who maintained ≥13.6 kg weight loss for ≥1 year. Key maintenance strategies: high physical activity (≥1 hour/day), low-fat diet, breakfast regularity, consistent weighing, minimal TV, and few dietary "vacations" (Wing & Hill, 2001). Metabolic adaptation persists during maintenance (Fothergill et al., 2016).',
    whatYouWillGain: 'Proven strategies to prevent weight regain; understanding of your "maintenance" calorie level; tools to handle high-risk situations; exercise integration for weight stability; early relapse detection through consistent monitoring.',
    typicalMacros: { protein: '1.6–2.0 g/kg bodyweight (high for satiety and metabolic rate)', carbs: '40–50% of calories (whole food sources)', fat: '25–30% of calories', calories: 'Maintenance + slight buffer (TDEE; may be 200–300 kcal higher than weight loss endpoint)' },
    sampleMeals: [
      'Breakfast: 3 eggs with vegetables and half avocado + 1/2 cup oatmeal with cinnamon',
      'Lunch: 200 g chicken breast + large salad + 1 tbsp olive oil + 1 piece fruit',
      'Dinner: 200 g salmon + roasted vegetables + 200 g sweet potato + Greek yoghurt',
      'Snack: Protein shake; apple; handful of almonds; raw vegetables with hummus',
      'NWCR habits: Weighing ≥1x/week, consistent meal patterns, >10,000 steps/day, limited fast food',
      'High-risk situations: Holidays, vacations, stress periods — have a "maintenance plan" prepared'
    ],
    pros: ['Based on NWCR long-term successful maintainers', 'Practical, evidence-based strategies', 'Flexible approach', 'Includes exercise and behavioural components', 'Addresses psychological aspects of maintenance'],
    cons: ['Requires permanent lifestyle changes', 'Exercise requirement (1 hr/day) is significant', 'Metabolic adaptation makes maintenance harder than expected', 'Weight regain is still possible despite adherence', 'May feel restrictive long-term'],
    bestFor: 'Individuals who have successfully lost significant weight (≥10% body weight) and want evidence-based strategies to prevent weight regain.',
    provenBy: 'Wing & Hill (2001); Fothergill et al. (2016); National Weight Control Registry',
    recommendedProgramTypes: ['walking-program', 'full-body-3x', 'couch-to-5k', 'foundation-training']
  }
];

// ============================================================
// HIGH-CARB DIETS (4)
// ============================================================

const highCarbDiets: DietProgram[] = [
  {
    id: 'carb-centric-nutrition',
    name: 'Carb-Centric Nutrition for Endurance',
    category: 'high-carb',
    goal: 'High-carbohydrate intake for endurance performance',
    difficulty: 'intermediate',
    description: 'Endurance athletes require high carbohydrate availability to support training and race performance. This approach prescribes 6–12 g/kg carbohydrate daily (depending on training intensity and volume), adequate protein for recovery, and low fat to meet high-carb targets within calorie budgets. The principle is "eating for the work you do" — carb intake varies daily based on training load. Race-day fuelling (pre, during, post) is a key component.',
    scientificBasis: 'Carbohydrate loading increases muscle glycogen storage, improving endurance performance (Hawley et al., 1997). ACSM/Academy of Nutrition and Dietetics guidelines recommend 6–10 g/kg/day for moderate endurance training and 8–12 g/kg/day for extreme volume. The concept of "train low, race high" (periodised carbohydrate availability) adds nuance (Burke, 2010).',
    whatYouWillGain: 'Optimal muscle glycogen stores; improved endurance performance; delayed fatigue; better training quality; race-day fuelling expertise; faster post-exercise recovery.',
    typicalMacros: { protein: '1.2–1.6 g/kg bodyweight (adequate for endurance)', carbs: '6–12 g/kg bodyweight (high, load-dependent)', fat: '15–25% of calories (kept low to meet carb targets)', calories: '2,500–6,000+ kcal/day (expenditure-dependent)' },
    sampleMeals: [
      'Pre-race breakfast: 2 bagels with jam, 1 banana, 500 ml sports drink, coffee',
      'During race: Gels + sports drink + bananas (30–90 g carb/hour depending on duration)',
      'Post-race recovery: Recovery shake; defuelling starts immediately with high-GI carbs',
      'Training day lunch: 200 g chicken + 400 g pasta with marinara + bread roll + juice',
      'Training day dinner: 250 g salmon + 350 g rice + vegetables + large glass juice',
      'Rest day: 5 g/kg carb (lower) — 3 eggs, salad, lighter portions'
    ],
    pros: ['Optimal for endurance performance', 'Proven to improve race times', 'Supports high training volumes', 'Compatible with sports nutrition guidelines', 'Flexibility in food choices'],
    cons: ['Requires precise carbohydrate periodisation', 'Very high food volume', 'Can cause GI distress during events', 'Not suitable for sedentary individuals', 'Potential for weight gain if activity drops'],
    bestFor: 'Endurance athletes (marathon, triathlon, cycling, cross-country skiing) with training volume >10–15 hours/week needing optimal carbohydrate fuelling.',
    provenBy: 'Hawley et al. (1997); Burke (2010); ACSM/Academy of Nutrition and Dietetics guidelines',
    recommendedProgramTypes: ['distance-running-plans', 'triathlon-training', 'cycling-performance', 'rowing-intervals']
  },
  {
    id: 'traditional-asian-diet',
    name: 'Traditional Asian Diet (High-Carb, Plant-Forward)',
    category: 'high-carb',
    goal: 'High-carbohydrate, plant-forward diet following traditional Asian dietary patterns',
    difficulty: 'beginner',
    description: 'The Traditional Asian Diet varies by region (Japanese, Korean, Chinese, Vietnamese, Thai) but shares common elements: very high carbohydrate intake from rice and noodles, plant-forward eating (vegetables, legumes, soy), moderate fish and seafood, small portions of meat (mostly as flavouring), and fermented foods. It is naturally high in fibre, low in saturated fat, and low in processed foods.',
    scientificBasis: 'Traditional Asian populations have historically had low rates of cardiovascular disease and obesity despite very high carbohydrate intake (70–80% of calories). The Okinawan diet (Willcox et al., 2009) is the best-studied example. The benefits likely come from low calorie density, high vegetable intake, fermented foods (probiotics), and limited processed foods rather than carb content per se.',
    whatYouWillGain: 'Low obesity rates in native contexts; high micronutrient density; gut health from fermented foods; sustainable eating pattern; cardiovascular health when in traditional form.',
    typicalMacros: { protein: '10–15% of calories (lower than Western diets)', carbs: '70–80% of calories (rice, noodles, vegetables)', fat: '10–15% of calories (very low, mostly from fish and sesame)', calories: '2,000–2,500 (naturally lower due to low calorie density)' },
    sampleMeals: [
      'Japanese breakfast: Miso soup, grilled fish, rice, natto (fermented soybeans), pickled vegetables, green tea',
      'Korean lunch: Bibimbap (rice bowl with vegetables, egg, beef, gochujang), kimchi, seaweed soup',
      'Chinese dinner: Steamed fish with ginger and spring onion, stir-fried bok choy, steamed rice',
      'Vietnamese pho: Rice noodle soup with beef, herbs (mint, basil), bean sprouts, lime, chilli',
      'Snacks: Edamame, seaweed snacks, rice cakes, green tea, citrus fruit',
      'Western adaptation: Brown rice, more protein (chicken/tofu), roasted vegetables with soy-ginger sauce'
    ],
    pros: ['Very high carbohydrate tolerance (Okinawan longevity)', 'Naturally low in processed foods', 'High vegetable consumption', 'Fermented foods for gut health', 'Plant-forward and sustainable'],
    cons: ['Very high carb may not suit all metabolisms', 'Low protein for active individuals', 'Westernised versions are less healthy (fried rice, sugary sauces)', 'Some ingredients are unfamiliar or hard to source', 'Low fat can impair hormone function in athletes'],
    bestFor: 'Individuals wanting a plant-forward, high-carbohydrate eating pattern based on traditional Asian cuisines, or those adapted to high-carb metabolic types.',
    provenBy: 'Willcox et al. (2009); traditional population studies',
    recommendedProgramTypes: ['walking-program', 'yoga-for-athletes', 'foundation-training', 'couch-to-5k']
  },
  {
    id: 'carb-loading-protocol',
    name: 'Carb Loading Protocol',
    category: 'high-carb',
    goal: 'Maximise muscle glycogen stores before endurance events',
    difficulty: 'advanced',
    description: 'Carb loading (glycogen supercompensation) is a pre-event nutritional strategy to maximise muscle glycogen stores above baseline levels. The classic protocol (Astrand, 1967) involved a depletion phase followed by a loading phase. Modern protocols (Sherman et al., 1981) simply increase carbohydrate to 8–12 g/kg for 24–48 hours before an event lasting >90 minutes. The goal is 150–200 mmol/kg of glycogen.',
    scientificBasis: 'Classical carb loading increases glycogen stores by 40–80% above baseline (Bergström & Hultman, 1967). Modern one-day loading (8–12 g/kg for 24–36 hours) achieves similar supercompensation without the depletion phase (Bussau et al., 2002). Carb loading improves endurance performance by 2–3% in >90-minute events (Hawley et al., 1997).',
    whatYouWillGain: 'Maximised muscle glycogen stores (150–200+ mmol/kg); 2–3% performance improvement in events >90 minutes; delayed fatigue; improved race pace sustainability; psychological confidence.',
    typicalMacros: { protein: 'Moderate (1.2–1.5 g/kg, not prioritised during loading)', carbs: '8–12 g/kg bodyweight (exclusively carb focus)', fat: '<20% of calories (kept low to maximise carb intake)', calories: '3,000–6,000+ kcal/day (carb-dense foods only)' },
    sampleMeals: [
      'Breakfast: 2 cups oatmeal with honey, 2 bananas, toast with jam, juice',
      'Lunch: 200 g pasta with marinara sauce, 2 bread rolls, 1 large juice, 1 apple',
      'Dinner: 300 g white rice with teriyaki sauce, 2 large sweet potatoes, 1 banana, juice',
      'Snack: Fig bars; bagels; sports drinks; rice cakes with honey; dried fruit; jelly lollies',
      'Key foods: White rice, pasta, bread, bagels, potatoes, fruit juice, bananas, sports drinks',
      'IMPORTANT: Test protocol during training first (never on race day for the first time)'
    ],
    pros: ['2–3% performance improvement (significant in elite sport)', 'Well-established protocol with decades of research', 'Simple: just eat more carbs', 'Psychological confidence boost', 'Reversible (glycogen returns to normal in 2–3 days)'],
    cons: ['Can cause water retention (1 g glycogen = 3–4 g water)', 'GI distress risk from high carb volume', 'Temporary weight gain (3–5 lbs water) can be concerning', 'Unnecessary for events <90 minutes', 'Not for daily eating — pre-event only'],
    bestFor: 'Endurance athletes (marathon, half-marathon, triathlon, cycling centuries, cross-country skiing) preparing for events lasting >90 minutes.',
    provenBy: 'Bergström & Hultman (1967); Sherman et al. (1981); Hawley et al. (1997); Bussau et al. (2002)',
    recommendedProgramTypes: ['distance-running-plans', 'triathlon-training', 'cycling-performance', 'rowing-intervals']
  },
  {
    id: 'high-carb-plant-strong',
    name: 'Plant-Strong High Carb (Engine 2 / Starch Solution)',
    category: 'high-carb',
    goal: 'Very high carbohydrate, whole-food plant-based eating',
    difficulty: 'beginner',
    description: 'Plant-Strong high-carb eating, popularised by Rip Esselstyn (Engine 2) and Dr John McDougall (Starch Solution), is a whole-food, plant-based (WFPB) approach with very high carbohydrate intake (70–80%+) from starches (potatoes, rice, oats, corn, beans, lentils, whole grains). It excludes all animal products and limits added oils, processed foods, and refined sugars. The premise is that starch-based eating provides all necessary macronutrients.',
    scientificBasis: 'The Starch Solution is based on the work of Dr John McDougall, who argues traditional starch-based populations had low chronic disease rates. Engine 2 was developed for firefighter health. The WFPB approach is supported by the Adventist Health Studies (Orlich et al., 2013) showing lower all-cause mortality in plant-based individuals. The portfolio diet studies (Jenkins et al., 2003) confirm cholesterol-lowering effects.',
    whatYouWillGain: 'Very low saturated fat intake; high fibre intake (40–80 g/day); improved cholesterol and blood pressure; weight loss (naturally calorie-dilute); reduced chronic disease risk; high satiety from fibre volume.',
    typicalMacros: { protein: '10–15% of calories (adequate from whole plants)', carbs: '70–80% of calories (overwhelmingly from starches and vegetables)', fat: '<10% of calories (very low, no added oils)', calories: 'Ad libitum (naturally regulated by low calorie density)' },
    sampleMeals: [
      'Breakfast: Oatmeal with berries, banana, and ground flaxseed (made with water/plant milk)',
      'Lunch: Black bean tacos with corn tortillas, salsa, lettuce, tomato, and guacamole (no oil)',
      'Dinner: Baked potato topped with lentil chili, steamed broccoli, and nutritional yeast "cheese"',
      'Snack: Fresh fruit; rice cakes with hummus; raw vegetables; air-popped popcorn',
      'Engine 2 staple: "Mushroom Marinara" — portobello mushrooms, marinara sauce, whole-grain pasta',
      'Avoid: Oil (all types), animal products (meat, dairy, eggs), processed foods, refined sugars'
    ],
    pros: ['Extremely high fibre and nutrient density', 'Proven cholesterol reduction', 'Low calorie density aids weight management', 'Ethically and environmentally aligned', 'Simple "no animal products" rules'],
    cons: ['Very low fat (<10%) may impair hormone function', 'Requires supplementing B12, vitamin D, iron, DHA', 'Socially difficult (no animal products ever, no oil)', 'May not support athletic performance (low protein)', 'Some individuals do poorly on very low fat'],
    bestFor: 'Individuals wanting maximum cardiovascular disease risk reduction, ethical vegans, and those who thrive on a very high carbohydrate, low-fat approach.',
    provenBy: 'Esselstyn (Engine 2); McDougall (Starch Solution); Orlich et al. (2013) Adventist Health Study; Jenkins et al. (2003)',
    recommendedProgramTypes: ['walking-program', 'couch-to-5k', 'foundation-training', 'senior-fitness']
  }
];

// ============================================================
// ADDITIONAL LOW-CARB DIETS (3)
// ============================================================

const moreLowCarbDiets: DietProgram[] = [
  {
    id: 'atkins-20',
    name: 'Atkins 20 (Classic Atkins)',
    category: 'low-carb',
    goal: 'Structured low-carb weight loss through four phases',
    difficulty: 'intermediate',
    description: 'The Atkins 20 diet is the original low-carb approach by Dr Robert Atkins, structured in four phases: Induction (20 g net carbs/day for 2 weeks), Ongoing Weight Loss (OWL, gradually increase carbs by 5 g/week), Pre-Maintenance (25–50 g net carbs), and Lifetime Maintenance (50–100 g net carbs). Protein and fat are unlimited. Induction produces rapid water weight loss that motivates continued adherence.',
    scientificBasis: 'The Atkins diet has been studied in multiple RCTs including Gardner et al. (2007) A TO Z Study, which found Atkins produced the greatest weight loss among four diets at 12 months. Shai et al. (2008) found Atkins comparable to Mediterranean and low-fat diets for weight loss, with better lipid outcomes. The diet induces ketosis during Induction, though later phases include moderate carbs.',
    whatYouWillGain: 'Rapid initial weight loss (motivational); improved triglycerides and HDL cholesterol; reduced appetite via ketosis; structured four-phase approach; sustainable long-term low-carb pattern.',
    typicalMacros: { protein: '25–30% of calories (unlimited)', carbs: 'Induction: 20 g/day net; OWL: +5 g/week; Lifetime: 50–100 g/day net', fat: '60–70% of calories (unlimited, including saturated fat)', calories: 'Ad libitum (appetite-suppressed on Induction)' },
    sampleMeals: [
      'Induction breakfast: 3-egg omelette with cheese, bacon, and sautéed mushrooms',
      'Induction lunch: Grilled chicken Caesar salad (no croutons) with full-fat dressing',
      'Induction dinner: Ribeye steak with butter, steamed broccoli with hollandaise sauce',
      'Induction snack: Celery with cream cheese; hard-boiled eggs; string cheese; olives',
      'OWL additions: +5 g carbs/week from vegetables, berries, nuts, seeds',
      'Pre-Maintenance: Add legumes, whole grains, and higher-carb fruits slowly'
    ],
    pros: ['Very effective initial weight loss', 'Structured phases create a clear plan', 'Protein/fat unlimited = high satiety', 'Strong RCT evidence base', 'Greater weight loss than low-fat in head-to-head trials'],
    cons: ['Induction too restrictive for many', 'High saturated fat intake concerns', 'Very low fibre during Induction', 'Bad breath, fatigue, and constipation during Induction', 'Long-term adherence is challenging'],
    bestFor: 'Individuals who need a structured, phased low-carb approach with clear rules, especially those who are motivated by rapid initial weight loss.',
    provenBy: 'Dr Robert Atkins; Gardner et al. (2007) A TO Z Study; Shai et al. (2008)',
    recommendedProgramTypes: ['starting-strength', 'full-body-3x', 'greyskull-lp', 'walking-program']
  },
  {
    id: 'south-beach-diet',
    name: 'South Beach Diet',
    category: 'low-carb',
    goal: 'Low-glycaemic, heart-healthy weight loss approach',
    difficulty: 'beginner',
    description: 'The South Beach Diet, created by cardiologist Dr Arthur Agatston, is a moderate low-carb diet that distinguishes between "good" and "bad" carbohydrates and fats. Phase 1 (2 weeks) eliminates all carbs except vegetables (including fruit). Phase 2 reintroduces low-glycaemic fruits and whole grains. Phase 3 is lifelong maintenance. The diet is lower in saturated fat than Atkins and emphasises heart-healthy choices.',
    scientificBasis: 'Based on the glycaemic index concept (Jenkins et al., 1981), South Beach emphasises low-GI carbohydrates to stabilise blood sugar and insulin. Agatston\'s clinical experience showed reduced cardiovascular risk markers. Weight loss in Phase 1 is primarily water (glycogen depletion) but the GI-based approach provides sustainable glucose control.',
    whatYouWillGain: 'Blood sugar stabilisation; reduced cravings (especially for sugar and refined carbs); heart-healthy lipid improvements; structured reintroduction of carbs; flexibility for long-term maintenance.',
    typicalMacros: { protein: '25–30% of calories (lean sources)', carbs: 'Phase 1: 10–15%; Phase 2: 30–35% (low-GI); Phase 3: 35–40%', fat: '35–40% of calories (emphasis on unsaturated)', calories: 'Ad libitum (Phase 1 appetite suppression)' },
    sampleMeals: [
      'Phase 1 breakfast: 2 eggs + turkey bacon + tomato juice (unsweetened)',
      'Phase 1 lunch: Grilled salmon over spinach with olive oil vinaigrette',
      'Phase 1 dinner: Grilled chicken breast with sautéed broccoli and bell peppers',
      'Phase 1 snack: String cheese; almonds; vegetable sticks; ricotta cheese',
      'Phase 2 additions: ½ cup brown rice, whole-grain bread, berries, low-fat yoghurt',
      'Phase 3: All food groups allowed, but choose low-GI options'
    ],
    pros: ['Structured phases with clear reintroduction', 'Heart-healthy emphasis (cardiologist-created)', 'Less restrictive than Atkins Phase 1 (some fruit)', 'Good blood sugar stabilisation', 'Simple "good vs bad" categorisation'],
    cons: ['Phase 1 is very restrictive', '"Good/bad" food classification is oversimplified', 'Processed South Beach products are expensive', 'Weight regain if Phase 3 rules are not followed', 'Original recommendations slightly outdated'],
    bestFor: 'Individuals with metabolic syndrome, pre-diabetes, or those wanting a heart-healthy, low-glycaemic approach with clearer structure than general low-carb.',
    provenBy: 'Dr Arthur Agatston; Jenkins et al. (1981) GI concept; clinical practice outcomes',
    recommendedProgramTypes: ['walking-program', 'full-body-3x', 'couch-to-5k', 'foundation-training']
  },
  {
    id: 'sugar-busters',
    name: 'Sugar Busters',
    category: 'low-carb',
    goal: 'Eliminate refined sugar and high-glycaemic carbohydrates',
    difficulty: 'beginner',
    description: 'Sugar Busters is a low-glycaemic, low-sugar diet developed by three physicians. It eliminates all refined sugar, white flour, white rice, potatoes, corn, and high-glycaemic fruits. It emphasises whole-grain products, lean protein, healthy fats, vegetables, and low-glycaemic fruits (berries, citrus). Unlike strict low-carb diets, it allows moderate amounts of whole-wheat bread, whole-grain pasta, and legumes.',
    scientificBasis: 'The premise is that refined sugar and high-GI foods cause insulin spikes that promote fat storage, increase appetite, and contribute to metabolic disease. The glycaemic index concept (Jenkins et al., 1981) supports blood sugar management. The diet is less restrictive than Atkins or Keto.',
    whatYouWillGain: 'Improved blood sugar control; reduced sugar cravings; gradual weight loss; healthier overall food choices; elimination of added sugars and refined carbohydrates.',
    typicalMacros: { protein: '25–30% of calories', carbs: '35–40% of calories (low-GI sources only)', fat: '30–35% of calories (emphasis on unsaturated)', calories: 'Ad libitum (target 1,600–2,000 for weight loss)' },
    sampleMeals: [
      'Breakfast: Oatmeal (steel-cut) with berries and cinnamon; 2 poached eggs; coffee',
      'Lunch: Turkey lettuce wraps with hummus, tomato, cucumber, and avocado',
      'Dinner: Grilled salmon with quinoa, roasted asparagus, and salad with olive oil dressing',
      'Snack: Apple with peanut butter; cottage cheese; mixed nuts; raspberries',
      'Avoid completely: White sugar, high-fructose corn syrup, white bread, white rice, potatoes, corn',
      'Allowed sweeteners: Stevia, sucralose (moderate)'
    ],
    pros: ['Eliminates added sugars effectively', 'Less restrictive than Atkins', 'Heart-healthy fat guidelines', 'Whole-grain inclusive', 'Simple "avoid white stuff" rule'],
    cons: ['Very similar to other low-GI diets (not unique)', 'Eliminating potatoes and corn is unnecessary for most', 'Portions still matter (limited emphasis)', 'Less research support than Atkins', 'Some "sugar-free" processed foods still allowed'],
    bestFor: 'Individuals with sweet cravings who need to eliminate refined sugar and want a moderate, low-glycaemic approach with more flexibility than strict low-carb.',
    provenBy: 'Drs. Andrews, Marais, and Calton; Jenkins et al. (1981)',
    recommendedProgramTypes: ['walking-program', 'full-body-3x', 'foundation-training', 'couch-to-5k']
  }
];

// ============================================================
// CONSOLIDATED EXPORT — All Diet Programs in One Array
// ============================================================

export const DIET_PROGRAMS: DietProgram[] = [
  ...fatLossDiets,
  ...muscleGainDiets,
  ...ketoLowCarbDiets,
  ...plantBasedDiets,
  ...intermittentFastingDiets,
  ...mediterraneanDiets,
  ...bodybuildingDiets,
  ...performanceDiets,
  ...paleoDiets,
  ...specificDiets,
  ...specializedDiets,
  ...recoveryDiets,
  ...maintenanceDiets,
  ...highCarbDiets,
  ...moreLowCarbDiets
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getDietByGoal(goal: string): DietProgram[] {
  return DIET_PROGRAMS.filter(diet =>
    diet.goal.toLowerCase().includes(goal.toLowerCase())
  );
}

export function getDietByCategory(category: DietProgram['category']): DietProgram[] {
  return DIET_PROGRAMS.filter(diet => diet.category === category);
}

export function getDietById(id: string): DietProgram | undefined {
  return DIET_PROGRAMS.find(diet => diet.id === id);
}

export function getDietRecommendations(params: {
  goal?: string;
  category?: DietProgram['category'];
  difficulty?: DietProgram['difficulty'];
  limit?: number;
}): DietProgram[] {
  let results = DIET_PROGRAMS;

  if (params.goal) {
    results = results.filter(diet =>
      diet.goal.toLowerCase().includes(params.goal!.toLowerCase()) ||
      diet.description.toLowerCase().includes(params.goal!.toLowerCase()) ||
      diet.bestFor.toLowerCase().includes(params.goal!.toLowerCase())
    );
  }

  if (params.category) {
    results = results.filter(diet => diet.category === params.category);
  }

  if (params.difficulty) {
    results = results.filter(diet => diet.difficulty === params.difficulty);
  }

  if (params.limit && params.limit > 0) {
    results = results.slice(0, params.limit);
  }

  return results;
}

export function generateRandomDiet(): DietProgram {
  const randomIndex = Math.floor(Math.random() * DIET_PROGRAMS.length);
  return DIET_PROGRAMS[randomIndex];
}
