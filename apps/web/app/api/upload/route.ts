import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  // 上传接口依赖 Vercel Blob。没有 token 时返回 401，前端会退化为本地预览模式。
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response("缺少 BLOB_READ_WRITE_TOKEN，请在 .env 文件中配置。", {
      status: 401,
    });
  }

  const file = req.body || "";
  const filename = req.headers.get("x-vercel-filename") || "file.txt";
  const contentType = req.headers.get("content-type") || "text/plain";
  const fileType = `.${contentType.split("/")[1]}`;

  // 如果文件名没有扩展名，就根据 content-type 补一个，方便 Blob 存储和浏览器识别文件类型。
  const finalName = filename.includes(fileType) ? filename : `${filename}${fileType}`;
  // put 会把文件写入 Vercel Blob，并返回公开访问 URL，编辑器最终插入的就是这个 URL。
  const blob = await put(finalName, file, {
    contentType,
    access: "public",
  });

  return NextResponse.json(blob);
}
