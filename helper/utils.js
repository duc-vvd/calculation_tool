function formatStringNumber(strNum) {
  return strNum.toString().replace(/[.]/g, "").replace(/[,]/g, ".");
}

export { formatStringNumber };
