fetch("./guanlan-miniprogram-filing-text-2026-08-12.txt", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("资料加载失败");
    return response.arrayBuffer();
  })
  .then((buffer) => {
    document.querySelector("#content").textContent = new TextDecoder("utf-8")
      .decode(buffer)
      .replace(/^\uFEFF/, "");
  })
  .catch((error) => {
    const content = document.querySelector("#content");
    content.className = "error";
    content.textContent = `${error.message}，请稍后刷新页面。`;
  });
