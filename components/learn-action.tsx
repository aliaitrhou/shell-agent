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
  console.log("responseData is : ", responseData);

  const answer = responseData.answer || "";
  const newMode = responseData.newMode;
  console.log("new Mode:", newMode);

  // NOTE: Remove this variable later and make it boolean
  // so the model can decied whether to switch or not.
  const autoSwitch = false;
  return { answer, autoSwitch };
}
