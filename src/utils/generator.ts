const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWYXZ1234567890";

export function generatorFactory() {
  return {
    generate(length = 4): string {
      let code = "";
      for (let i = 0; i < length; i++) {
        const position = Math.floor(Math.random() * CHARACTERS.length);
        code += CHARACTERS[position];
      }
      return code;
    },
  };
}
