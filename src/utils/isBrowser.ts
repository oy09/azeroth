const isBrowser = () => {
  const isNode =
    typeof process != undefined &&
    process.version != null &&
    process.versions.node !== null;

  return typeof window != null && typeof window.document && !isNode;
};

export default isBrowser;
