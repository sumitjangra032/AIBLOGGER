import { authors } from "./authorList.js";

export const generateRandomAuthor = () => {
  return authors[Math.floor(Math.random() * authors.length)];
};
