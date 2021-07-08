import fs from "fs-extra";
const copy = async (dist = "esm") => {
  await fs.copy("./src/global.d.ts", `./${dist}/global.d.ts`);
};

(async () => {
  await copy("esm");
  await copy("lib");
})();
