exports.getAccessToken = (req) => {
  const headerAuthor = (req.headers["authorization"] || "").trim();
  const fromXHeader = (req.headers["x-access-token"] || "").trim();

  const fromHeader = fromXHeader || headerAuthor;

  if (fromHeader) {
    return fromHeader.replace("Bearer ", "").trim();
  }

  return (req.body.token || req.query.token || "") + "";
};
