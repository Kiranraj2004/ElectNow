const BASE36_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeNumber(number, codeLength = 5) {
  let encodedString = '';
  while (number > 0) {
    const remainder = number % 36;
    encodedString = BASE36_CHARS[remainder] + encodedString;
    number = Math.floor(number / 36);
  }

  // Pad the encoded string with leading zeros if necessary
  while (encodedString.length < codeLength) {
    encodedString = '0' + encodedString;
  }

  return encodedString;
}

function decodeNumber(encodedString) {
  let decodedNumber = 0;
  for (let i = 0; i < encodedString.length; i++) {
    const charIndex = BASE36_CHARS.indexOf(encodedString[i]);
    decodedNumber = decodedNumber * 36 + charIndex;
  }
  return decodedNumber;
}

// Example usage:
const number = 11;
const encoded = encodeNumber(number);
console.log("Encoded:", encoded); // Output: 0003K

const decoded = decodeNumber(encoded);
console.log("Decoded:", decoded); // Output: 12345