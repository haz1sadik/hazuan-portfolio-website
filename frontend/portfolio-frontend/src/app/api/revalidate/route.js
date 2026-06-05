import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const VALID_TYPES = new Set(["blogs", "guides", "writeups"]);

export async function POST(request) {
  const { secret, type, id } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret." }, { status: 401 });
  }

  if (!VALID_TYPES.has(type)) {
    return NextResponse.json({ message: "Invalid type." }, { status: 400 });
  }

  const basePath = `/${type}`;
  const paths = [basePath];

  if (id) {
    paths.push(`${basePath}/${id}`);
  }

  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, paths });
}
