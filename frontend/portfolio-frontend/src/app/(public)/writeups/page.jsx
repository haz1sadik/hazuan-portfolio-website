import WriteupsClient from "./WriteupsClient";

const WriteupsPage = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const response = await fetch(`${baseUrl}/ctf-writeups`);
  const writeups = response.ok ? await response.json() : [];

  return (
    <WriteupsClient
      initialWriteups={Array.isArray(writeups) ? writeups : []}
    />
  );
};

export default WriteupsPage;