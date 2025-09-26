/**
 * Prompts Database
 * 
 * Contains all movement prompts with their metadata including type and tags.
 * This data structure is designed to be easily extensible for future features.
 */

export const PROMPTS_DATABASE = [
  { text: 'Dance slow to a fast song', type: 'general', tags: ['tempo','music']},
  { text: 'Move as slowly as possible', type: 'general', tags: ['tempo', 'restriction']},
  { text: 'Dance on your opposite side', type: 'pole', tags: ['restriction']},
  { text: 'Focus on connecting with your audience through eye contact', type: 'general', tags: ['with others']},
  { text: 'Keep one hand on the pole at all times', type: 'pole', tags: ['body parts', 'restriction']},
  { text: 'Have someone randomly call out numbers 1-5 while you dance, with 1 meaning to dance super slowly and 5 meaning to dance as fast as possible', type: 'general', tags: ['tempo', 'guided']},
  { text: 'Take up as much space as possible', type: 'general', tags: ['space']},
  { text: 'Imagine that your fingers are releasing ink as you dance: paint the air, paint the pole, let them rest and create a pool of ink - then play in the pool and splash!', type: 'general', tags: ['body parts', 'imagination']}, /**https://www.reddit.com/r/poledancing/comments/47mgph/tips_for_improving_flowdancyness/*/
  { text: 'Incorporate a new prop', type: 'general', tags: ['props']},
  { text: 'Let your breathing dictate the timing of your movements', type: 'general'},
  { text: 'Dance to the same song 3x in a row. What do you notice that you do the same each time? What changes?', type: 'general', tags: ['music', 'restriction', 'repetition']},
  { text: 'Pick one move to focus on - how many different ways can you do it?', type: 'general', tags: ['restriction', 'repetition']},
  { text: 'Pretend you\'re moving through peanut butter', type: 'general', tags: ['imagination', 'fun']},
  { text: 'Dance your stretches', type: 'general', tags: ['restriction']},
  { text: 'Pick a specific body part (your head, your right foot, or even your left elbow) to lead your movement', type: 'general', tags: ['body parts']},
  { text: 'Pretend you\'re covered in honey - focus on slow, sticky, viscous movements', type: 'general', tags: ['imagination', 'fun']},
  { text: 'Soften your gaze or close your eyes', type: 'general', tags: ['restriction']},
  { text: 'Pick a person or object in the room and orient your movement around them/it without making any direct contact', type: 'general', tags: ['props', 'restriction']},
  { text: 'Dance while cleaning your pole - incorporate your towel and use it as a prop', type: 'pole', tags: ['props', 'restriction']},
  { text: 'Focus on closing and opening movements', type: 'general'},
  { text: 'Combine small and big movements', type: 'general', tags: ['space']},
  { text: 'Dance to a genre of music you don\'t usually dance to', type: 'general', tags: ['music', 'restriction']},
  { text: 'Have someone pick a surprise song for you to dance to', type: 'general', tags: ['with others','guided', 'restriction']},
  { text: 'Focus on dancing your climbs', type: 'in the air'},
  { text: 'Dance in pants, leg warmers, long sleeved shirts, or any other cozy layers', type: 'general', tags: ['props','clothes']},
  { text: 'Put on layers and peel them off one-by-one while you dance', type: 'general', tags: ['props','clothes', 'restriction']},
  { text: 'Maintain at least 1 contact point with the pole at all times', type: 'pole', tags: ['body parts', 'restriction']},
  { text: 'Have someone call out "freeze!" and "unfreeze!"at random times while you dance', type: 'general', tags: ['guided']},
  { text: 'Focus on traveling across the floor in different ways', type:'floor'},
  { text: 'Use different parts of your body (other than your hands!) to connect with the pole', type:'pole', tags: ['body parts', 'restriction']},
  { text: 'Pretend you\'re dancing with a beach ball - hold it in your arms while you dance, throw it into the air, and catch it with different parts of your body', type: 'general', tags: ['fun', 'imagination', 'restriction']},
  { text: 'Keep 1 foot off the ground while you dance', type: 'general', tags: ['body parts', 'restriction']},
  { text: 'Pretend you\'re dancing through water', type: 'general', tags: ['imagination']},
  { text: 'Become water, whatever that means to you - you might be a gentle creek or crashing waves or anything in between', type: 'general', tags: ['imagination', 'fun']},
  { text: 'Follow your gaze as you dance', type: 'general'},
  { text: 'Have someone randomly pause the music while you dance and find a pose to hold each time the music pauses', type: 'general', tags: ['guided', 'restriction']},
  { text: 'Pick a body part and focus on showing it off while you dance', type: 'general', tags: ['body parts', 'repetition']},
  { text: 'Have someone call out level changes while you dance', type: 'general', tags: ['guided', 'restriction']},
  { text: 'Dance to something silly - the Law & Order theme song, Cotton Eye Joe, or even a podcast', type: 'general', tags: ['fun', 'restriction']},
  { text: 'Pretend you\'re dancing in zero gravity', type: 'general', tags: ['fun']},
  { text: 'Create a "call and response" between two body parts - maybe your hips move, and then your shoulders answer', type: 'general', tags: ['fun', 'body parts']},
  { text: 'Dance like you\'re keeping a secret', type: 'general', tags: ['fun']},
  { text: 'Trace figure 8s with different parts of your body', type: 'general', tags: ['repetition', 'body parts']},
  { text: 'Freeze for one beat, move for three - and then repeat', type: 'general', tags: ['tempo', 'repetition']},
  { text: 'Pretend your skin is magnetic and being pulled toward the pole', type: 'pole', tags: ['imagination', 'body parts', 'fun']},
  { text: 'Don\'t let your knees touch the ground', type: 'general', tags: ['restriction']},
  { text: 'Dance to silence, using only your breath as the soundtrack', type: 'general', tags: ['music']},
  { text: 'Have someone suddenly change the song halfway through', type: 'general', tags: ['music', 'guided']},
  { text: 'Explore as much of the space as possible before the song ends', type: 'general', tags: ['space']},
  { text: 'Pretend the floor is velcro: sticky, heavy, resistant', type: 'general', tags: ['imagination', 'fun']},
  { text: 'Focus on playing with heel clacks', type: 'heels'},
  { text: 'Pretend your heels are alive and you\'re letting them lead your dance', type: 'heels', tags: ['imagination']},
/**  { text: 'Dance like you\'re underwater - slow, fluid movements with resistance', tags: ['imagination', 'tempo'], credit: 'Shared by @movement_artist', creditUrl: 'https://instagram.com/movement_artist'}, CREDIT EXAMPLE*/
];

/**
 * Normalization helpers
 * Prompt format: { text, type: 'pole'|'floor'|'heels'|'', tags: string[], credit: string, creditUrl: string }
 */
export const normalizePromptItem = (item) => {
  const text = item.text || '';
  // Handle empty, null, or undefined type gracefully - leave empty if no type
  let type = item.type;
  if (!type || type.trim() === '') {
    type = '';
  }
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const credit = item.credit || '';
  const creditUrl = item.creditUrl || '';
  return { text, type, tags, credit, creditUrl };
};

/**
 * Get all unique tags from the prompts database
 */
export const getAllTags = () => {
  const allTags = new Set();
  PROMPTS_DATABASE.forEach(item => {
    if (item.tags) {
      item.tags.forEach(tag => allTags.add(tag));
    }
  });
  return Array.from(allTags).sort();
};

/**
 * Get all unique types from the prompts database
 */
export const getAllTypes = () => {
  const allTypes = new Set();
  PROMPTS_DATABASE.forEach(item => {
    if (item.type && item.type.trim() !== '') {
      allTypes.add(item.type);
    }
  });
  
  // Convert to array and sort, but ensure 'general' comes first
  const typesArray = Array.from(allTypes).sort();
  const generalIndex = typesArray.indexOf('general');
  
  if (generalIndex > 0) {
    // Remove 'general' from its current position and add it to the beginning
    typesArray.splice(generalIndex, 1);
    typesArray.unshift('general');
  }
  
  return typesArray.map(type => ({ 
    id: type, 
    label: type.toLowerCase() 
  }));
};

