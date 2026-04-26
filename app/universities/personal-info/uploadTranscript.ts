export async function uploadTranscriptToCloudinary(file: File): Promise<string> {
  // Get signed params from your API
  const res = await fetch("/api/user/transcripts");
  const { timestamp, signature, apiKey, cloudName } = await res.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("api_key", apiKey);
  formData.append("folder", "transcripts");

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
  const data = await uploadRes.json();
  return data.secure_url as string;
}