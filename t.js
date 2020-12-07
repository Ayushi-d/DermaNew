let obj = {
  jWAmwvbYHGYxgYQ4GEj1okuLLyM2: 1584700987.7177858,
  NRWe66FlVdgivMQK3loVkwaCMPs1: 1584698807.505,
  zwleHFiRi6UGOCHC3SJbxZ2zAvN2: 1584693932.533074,
  uxFmpzMLcsgehLIjLZhz2WGYp4D2: 1584689517.782,
  bYbBZwtXxvdKJlxxcKMJ4gGpkxy2: 1584359977.607,
  g5q0Q9H7w8QwGFdINOqnODaUzri1: 1584356811.5091481,
};

Object.keys(obj).map(item => {
  console.log(item, new Date(obj[item] * 1000));
});

/**
 * Todo
 */

// 1. Create New Context For Chat Request
// 2. Create New Message Context for Message Screen
// 3. Partner Preference Bug
// 4. Card Layout and Logic Bug --> most probably change it
// 5. Upload Bug
// 6. PP Bug of orderByChild('cat')
