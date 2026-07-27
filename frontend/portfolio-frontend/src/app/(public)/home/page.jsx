import HomeLanding from "./HomeLanding";

export const dynamic = "force-static";
export const revalidate = false;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const fetchCollection = async (path) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "force-cache",
      signal: controller.signal,
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};

const Homescreen = async () => {
  const [blogs, guides, writeups] = await Promise.all([
    fetchCollection("/blogs"),
    fetchCollection("/guides"),
    fetchCollection("/ctf-writeups"),
  ]);

  return <HomeLanding blogs={blogs} guides={guides} writeups={writeups} />;
};

export default Homescreen;