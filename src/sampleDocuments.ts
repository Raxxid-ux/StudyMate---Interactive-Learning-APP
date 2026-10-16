/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SampleDoc {
  name: string;
  type: string;
  extension: 'md' | 'txt';
  description: string;
  content: string;
}

export const SAMPLE_DOCUMENTS: SampleDoc[] = [
  {
    name: 'Introduction to Photosynthesis and Plant Energy',
    extension: 'md',
    type: 'text/markdown',
    description: 'A structured educational text explaining chloroplasts, light-dependent reactions, and the Calvin cycle.',
    content: `# Introduction to Photosynthesis and Plant Energy

The first sentence of this study guide introduces how living systems harness solar energy to sustain life on Earth. Photosynthesis is the fundamental biological process by which green plants convert sunlight into stable chemical energy stored in carbohydrates.

## 1. Cellular Machinery and the Chloroplast
Photosynthesis occurs inside specialized plant organelles called chloroplasts. Chloroplasts contain stacks of disc-shaped membranes known as thylakoids, where chlorophyll pigments absorb blue and red wavelengths of light while reflecting green light. Surrounding the thylakoids is the stroma, a fluid-filled dense interior where enzymatic sugar synthesis takes place.

Chlorophyll molecules absorb light energy and excite electrons to initiate charge separation. Water molecules are split through photolysis into oxygen gas, hydrogen ions, and electrons. Oxygen is released into the atmosphere as an essential byproduct of this reaction.

## 2. Light-Dependent Reactions
The light-dependent reactions occur directly along the thylakoid membranes of the chloroplast.
Step 1: Photons of sunlight strike pigment complexes in Photosystem II.
Step 2: Excited high-energy electrons travel down an electron transport chain toward Photosystem I.
Step 3: A proton gradient is generated across the thylakoid membrane to drive ATP synthesis via ATP synthase enzymes.
Step 4: NADP+ reductase catalyzes the production of NADPH carrying high-energy electrons.

These reactions require continuous illumination and liquid water to generate energy carriers.

## 3. The Light-Independent Calvin Cycle
The Calvin cycle takes place within the stroma and does not require direct illumination.
Carbon fixation begins when the enzyme RuBisCO attaches carbon dioxide to a five-carbon sugar named ribulose 1,5-bisphosphate.
Reduction follows, consuming ATP and NADPH produced during the light-dependent reactions to produce glyceraldehyde 3-phosphate molecules.
Regeneration reshuffles three-carbon molecules to restore RuBisCO acceptor molecules so the cycle can continue.
The primary end-product of the Calvin cycle is glucose, which plants utilize for cellular respiration and cellulose synthesis.

## 4. Environmental Factors Governing Rate
Three principal environmental variables govern the rate of photosynthetic activity: light intensity, ambient carbon dioxide concentration, and temperature.
At low light intensities, light is the limiting factor and photosynthesis increases linearly with illumination.
Beyond the light saturation threshold, the rate levels off because enzymatic machinery operates at maximum catalytic capacity.
Extreme heat denatures enzymes like RuBisCO, causing a dramatic decline in overall productivity.

The final sentence of this document confirms that understanding photosynthesis provides crucial insights into global agriculture and ecological stability.`,
  },
  {
    name: 'The Five Oceanic Depth Zones',
    extension: 'txt',
    type: 'text/plain',
    description: 'An exploration of ocean depth layers from the sunlit surface to the deepest trenches.',
    content: `THE FIVE OCEANIC DEPTH ZONES

The oceans cover over seventy percent of the Earth's surface and harbor distinct vertical layers defined by light penetration, water pressure, and temperature.

1. The Epipelagic Sunlit Zone
The epipelagic zone extends from the ocean surface down to a depth of two hundred meters. This upper layer receives sufficient sunlight to support active photosynthesis by phytoplankton and aquatic vegetation. Over ninety percent of all marine species inhabit or frequent this sunlit layer. Water temperatures fluctuate significantly depending on latitude and meteorological seasons.

2. The Mesopelagic Twilight Zone
The mesopelagic zone spans from two hundred meters to one thousand meters beneath the sea surface. Very faint sunlight reaches this twilight layer, rendering photosynthesis impossible for plant life. Many organisms in the twilight zone produce bioluminescence through specialized photophore organs to camouflage against predators or attract prey. Squid, lanternfish, and jellyfish dominate this dim ecological zone.

3. The Bathypelagic Midnight Zone
The bathypelagic zone extends from one thousand meters down to four thousand meters. Total darkness characterizes this realm, where sunlight cannot penetrate. Hydrostatic pressure in the midnight zone reaches extreme levels exceeding four hundred atmospheres. Most organisms survive by consuming marine snow, which consists of sinking organic detritus from the upper layers.

4. The Abyssopelagic Abyssal Zone
The abyssopelagic zone stretches from four thousand meters down to six thousand meters, encompassing the abyssal plains. Temperatures hover constantly near freezing between zero and three degrees Celsius. Food availability is severely restricted, leading organisms like tripod fish and sea cucumbers to develop slow metabolic rates.

5. The Hadalpelagic Trench Zone
The hadalpelagic zone exists within deep ocean trenches from six thousand meters to nearly eleven thousand meters at deep subduction zones. Intense hydrostatic pressure exceeds one thousand times the atmospheric pressure at sea level. Amphipods and snailfish survive here through specialized cell membranes and piezolyte proteins that stabilize cellular structures.

This concluding remark highlights that ongoing oceanic exploration continues to reveal extraordinary biological adaptations to extreme aquatic environments.`,
  },
  {
    name: 'Lecture Recording on Memory and Learning',
    extension: 'txt',
    type: 'text/plain',
    description: 'A spoken lecture transcript with timestamps and conversational filler, perfect for testing automatic cleaning.',
    content: `[00:00:01] Hey everyone, welcome back to the channel. Don't forget to like and subscribe!
[00:00:15] So today, as I said before in our previous talk, we are going to dive into how memory actually works in the human brain.
[00:00:30] Um, basically, the first stage is sensory memory. Sensory memory holds brief impressions of sensory input for only a fraction of a second.
[00:01:05] Like, you hear a sound or see a flash, and it lingers just long enough for your brain to decide if it matters.
[00:01:40] Next up is working memory. Working memory temporarily holds and manipulates a small amount of information for immediate use.
[00:02:10] Most people can actively hold between four and seven items at a time without rehearsing them.
[00:02:45] Ha, I see someone in the back yawning! Anyway, let's keep going.
[00:03:00] Finally, we have long-term memory. Long-term memory stores information over extended periods, ranging from hours to an entire lifetime.
[00:03:30] The hippocampus plays a critical role in memory consolidation, transferring short-term neural patterns into stable long-term storage in the neocortex.
[00:04:15] So to wrap things up, memory functions through three coordinated stages: sensory impressions, working memory buffers, and long-term storage.
[00:04:45] Thanks for listening, drop your comments down below, and see you next time!`,
  },
];
