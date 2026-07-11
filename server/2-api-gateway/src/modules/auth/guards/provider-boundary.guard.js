export const enforceProviderBoundary = (req, res, next) => {
  const user = req.user;
  const requestedProviderId = req.params.providerId || req.body.provider_id || req.query.providerId;
  if (!user.provider_id) return next();
  if (requestedProviderId && requestedProviderId !== user.provider_id) {
    console.warn(`Boundary violation: user ${user.id} (${user.provider_id}) -> ${requestedProviderId}`);
    return res.status(403).json({ error: "Cross-provider access denied" });
  }
  req.providerContext = user.provider_id;
  next();
};