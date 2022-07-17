// 71.403,09 => 71403.09
function formatStringNumber(strNum) {
    if (!strNum) return strNum;
    // neu co ky tu () thi la so am, vi du: (71.403,09) => -71403,09
    if (strNum.match(/[()]/g)) {
        return `-${strNum.toString().replace(/[.()]/g, '').replace(/[,]/g, '.')}`;
    }
    return strNum.toString().replace(/[.]/g, '').replace(/[,]/g, '.');
}

export { formatStringNumber };
