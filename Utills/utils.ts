import { ToastFailure } from "../Share/toast/ToastMsg";

// sort by name
export const sortByName = (arr: any) => {
  return arr.sort((a: any, b: any) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
    return 0;
  });
};

// sort by numbers
export const sortByNumbers = (arr: any) => {
  return arr.sort((a: any, b: any) => {
    if (a.sequnceNumber < b.sequnceNumber) return -1;
    if (a.sequnceNumber > b.sequnceNumber) return 1;
    return 0;
  });
};

// sort by date

export const sortByDate = (arr: any[]) => {
  return arr.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};
// sort by venue
export const sortByvenue = (arr: any) => {
  return arr?.sort((a: any, b: any) => (a.title > b.title ? 1 : 1));
};

// url validator

function isValidHttpUrl(s: any) {
  let url;
  try {
    url = new URL(s);
  } catch (e) {
    return false;
  }
  return /https?/.test(url.protocol);
}

export const validateUrl = (link: any) => {
  return isValidHttpUrl(link) ? true : false;
};

export function imageUploadValidator(imageData: any) {
  if (!imageData) {
    ToastFailure("please Upload an Image");
    return false;
  }
  return true;
}

export const extractImageFromUrl = (imageUrl: any) => {
  const index = imageUrl.lastIndexOf("/") + 1;
  const filename = imageUrl.substr(index);
  return filename;
};

export const isValidUrl = (str: any) => {
  const pattern = new RegExp(
    "^([a-zA-Z]+:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i"
  );
  return pattern.test(str);
};

// -test
export const compareDates = (d1: any, d2: any) => {
  const date1 = new Date(d1).getTime();
  const date2 = new Date(d2).getTime();

  if (date1 < date2) {
    return true;
  }
  if (date1 > date2) {
    return false;
  }
  return true;
};

export function isEmail(email: any): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isRichTextContextEmpty(content: any) {
  const text = content.replace("<p><br></p>", "").trim();
  return text.length === 0;
}

export function numberToWords(number: any): any {
  const words = [
    "zero",
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth",
    "thirteenth",
    "fourteenth",
    "fifteenth",
    "sixteenth",
    "seventeenth",
    "eighteenth",
    "nineteenth",
  ];

  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (number < 20) {
    return words[number];
  }

  if (number < 100) {
    return (
      tens[Math.floor(number / 10)] +
      (number % 10 !== 0 ? " " + words[number % 10] : "")
    );
  }

  if (number < 1000) {
    return (
      words[Math.floor(number / 100)] +
      " hundred" +
      (number % 100 !== 0 ? " and " + numberToWords(number % 100) : "")
    );
  }

  return "";
}
