import GuidesClient from "./GuidesClient";

const GuidesPage = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const response = await fetch(`${baseUrl}/guides`);
  const guides = response.ok ? await response.json() : [];

  return <GuidesClient initialGuides={Array.isArray(guides) ? guides : []} />;
};

export default GuidesPage;