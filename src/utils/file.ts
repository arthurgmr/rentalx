import fs from "fs";

export const deleteFile = async (filename: string) => {
  try {
    // stat func verify if file exists or not;
    await fs.promises.stat(filename);
  } catch {
    return;
  }

  // unlink remove file
  await fs.promises.unlink(filename);
};
