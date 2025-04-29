const getConvexErrorMessage = (message: string, fallback: string = "") => {
  const errorMessage = message
    .split("\n")
    .find((str) => str.includes("Uncaught ConvexError"))
    ?.trim();

  if (!errorMessage) {
    return fallback;
  }

  return errorMessage.replace(/(.*Uncaught ConvexError:)(.*)$/g, "$2").trim();
};

export default getConvexErrorMessage;
