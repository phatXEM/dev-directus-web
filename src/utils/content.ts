export const getRandomSectionArray = (arr: string[]) => {
  const num_of_random =
    arr.length > 3 ? 3 : arr.length > 1 ? arr.length - 1 : 1;

  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num_of_random);
};
