import readXlsxFile from 'read-excel-file/node';
import xlsx from 'node-xlsx';

try {
    const arr = [
        'Product',
        'ExtractionDate',
        'InstrumentCode',
        'IssuerCode',
        'CurrencyCode',
        'CounterpartyIdentifier',
        'OtcIndicator',
        'EffectiveDate',
        'MaturityDate',
        'CouponRate',
        'SecondCurrencyCode',
        'InstrumentDescription',
        'OptionType',
        'IssuerType',
        'UnderlyingInstrumentCode',
        'IssueDate',
        'CouponType',
        'ProductCode',
        'RepricingDateRec',
        'InterestTypePay',
        'InterestRateRec',
        'InterestRatePay',
        'InterestTypeRec',
        'RepricingDatePay',
        'SourceInstrumentCode',
        'HedgingUnderlyingAssets',
        'GuranteedByGovernment',
        'UnderlyingType',
        'InvestmentId',
        'MaturityDateOfFarLeg',
    ];

    const obj = arr.reduce((obj, cur) => {
        obj[cur] = cur;
        return obj;
    }, {});

    console.log(JSON.stringify(obj));
    const map = {
        Product: 'Product',
        ExtractionDate: 'ExtractionDate',
        InstrumentCode: 'InstrumentCode',
        IssuerCode: 'IssuerCode',
        CurrencyCode: 'CurrencyCode',
        CounterpartyIdentifier: 'CounterpartyIdentifier',
        OtcIndicator: 'OtcIndicator',
        EffectiveDate: 'EffectiveDate',
        MaturityDate: 'MaturityDate',
        CouponRate: 'CouponRate',
        SecondCurrencyCode: 'SecondCurrencyCode',
        InstrumentDescription: 'InstrumentDescription',
        OptionType: 'OptionType',
        IssuerType: 'IssuerType',
        UnderlyingInstrumentCode: 'UnderlyingInstrumentCode',
        IssueDate: 'IssueDate',
        CouponType: 'CouponType',
        ProductCode: 'ProductCode',
        RepricingDateRec: 'RepricingDateRec',
        InterestTypePay: 'InterestTypePay',
        InterestRateRec: 'InterestRateRec',
        InterestRatePay: 'InterestRatePay',
        InterestTypeRec: 'InterestTypeRec',
        RepricingDatePay: 'RepricingDatePay',
        SourceInstrumentCode: 'SourceInstrumentCode',
        HedgingUnderlyingAssets: 'HedgingUnderlyingAssets',
        GuranteedByGovernment: 'GuranteedByGovernment',
        UnderlyingType: 'UnderlyingType',
        InvestmentId: 'InvestmentId',
        MaturityDateOfFarLeg: 'MaturityDateOfFarLeg',
    };
    // const rows = await readXlsxFile('./data.xlsx', {
    //     dateFormat: 'MM/DD/YYYY',
    //     sheet: 'stg_instrument_contract_master',
    //     map,
    // });

    const rows = await readXlsxFile('./B3_SA-MR_Excel tool.xlsx', { sheet: 'STG_BANK_POSITIONS' });
    console.log(1);
} catch (error) {
    console.error(error.message);
}

// try {
//     const workSheetsFromFile = xlsx.parse(`./data.xlsx`, { dateNF: 'MM/DD/YYYY' });

//     console.log(1);
// } catch (error) {
//     console.error(error.message);
// }
