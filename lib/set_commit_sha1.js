export const setCommitSHA1 = () => {
  if (process.browser) {
    // eslint-disable-next-line no-underscore-dangle
    window.__COMMIT_SHA1__ = process.env.COMMIT_SHA1;
  }
};
