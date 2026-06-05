export const triggerRevalidate = async (type, id) => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.DEV_URL;
  const secret = process.env.REVALIDATION_SECRET;

  if (!frontendUrl || !secret || !type) {
    return;
  }

  try {
    await fetch(`${frontendUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        type,
        id,
      }),
    });
  } catch (error) {
    console.error("Revalidate request failed:", error);
  }
};
