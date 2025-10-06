export default async function learnAction(
  message: string,
  chatHistory: string[],
  selectedModel: string,
  selectSemester: string,
) {
  const res = await fetch(`/api/model?semester=${selectSemester}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      // TODO: make the model aware of command messages
      chatHistory,
      model: selectedModel,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch model response: ${res.status} ${res.statusText}`,
    );
  }

  const responseData = await res.json();

  const answer = responseData.answer;
  const pdfData = responseData.pdfData;

  // NOTE: Remove this variable later and make it boolean
  // so the model can decied whether to switch or not.
  return { answer, pdfData };
}
