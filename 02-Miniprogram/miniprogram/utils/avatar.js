const systemAvatars = [
  { id: "navy", name: "深海", url: "/assets/avatars/navy.svg" },
  { id: "gold", name: "暖金", url: "/assets/avatars/gold.svg" },
  { id: "sage", name: "青禾", url: "/assets/avatars/sage.svg" },
  { id: "slate", name: "云灰", url: "/assets/avatars/slate.svg" },
];

function persistAvatar(tempFilePath) {
  return new Promise((resolve, reject) => {
    if (typeof tempFilePath !== "string" || !tempFilePath) return reject(new Error("AVATAR_MISSING"));
    try {
      wx.getFileSystemManager().saveFile({
        tempFilePath,
        success({ savedFilePath }) {
          if (!savedFilePath) return reject(new Error("AVATAR_NOT_SAVED"));
          resolve(savedFilePath);
        },
        fail: reject,
      });
    } catch (error) { reject(error); }
  });
}

module.exports = { systemAvatars, persistAvatar };
