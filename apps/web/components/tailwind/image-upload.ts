import { createImageUpload } from "novel";
import { toast } from "sonner";
// 这句是从 sonner 这个库里引入 toast 方法，用来做页面提示消息。

const onUpload = (file: File) => {
  // 统一的图片上传入口：斜杠菜单、粘贴、拖拽最终都会复用这个上传逻辑。
  const promise = fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file?.type || "application/octet-stream",
      "x-vercel-filename": file?.name || "image.png",
    },
    body: file,
  });

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as { url: string };
          // 预加载图片，确认 URL 可访问后再 resolve，避免编辑器插入一个加载失败的图片节点。
          const image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };
          // No blob store configured
        } else if (res.status === 401) {
          // 没有配置 Vercel Blob 时，Novel 会退化为本地读取文件，方便开发环境继续调试编辑器。
          resolve(file);
          throw new Error("未配置 BLOB_READ_WRITE_TOKEN，已改为本地预览图片。");
          // Unknown error
        } else {
          throw new Error("图片上传失败，请稍后重试。");
        }
      }),
      {
        loading: "图片上传中...",
        success: "图片上传成功。",
        error: (e) => {
          reject(e);
          return e.message;
        },
      },
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    // 上传前先在前端做基础校验，减少无效请求。
    if (!file.type.includes("image/")) {
      toast.error("不支持该文件类型。");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("文件过大，最大支持 20MB。");
      return false;
    }
    return true;
  },
});
