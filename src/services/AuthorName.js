import { authors } from "../utils/authorList";

export const generateRandomAuthor = () => {
  return authors[Math.floor(Math.random() * authors.length)];
};
