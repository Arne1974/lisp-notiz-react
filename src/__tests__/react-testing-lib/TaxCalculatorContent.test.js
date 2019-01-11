
import React from 'react';
import { render } from 'react-testing-library';
import TaxCalculatorContent from '../../TaxCalculatorContent';

it('renders component with zero badge', () => {
  const handleClick = jest.fn()
  const products = []
  const { getByText } = render(<TaxCalculatorContent 
    error={false}
    products={products}
    amount={1000}
    categoryActive={'both'}
    durationActive={'all'}
    handleLinkClick={handleClick}
    />);
  expect(getByText('Loading...')).toBeInTheDocument();
});

it('renders component with one badge (alpha_1y)', () => {
  const handleClick = jest.fn()
  const products = api()
  const { getByText } = render(<TaxCalculatorContent 
    error={false}
    products={products}
    amount={1000}
    categoryActive={'both'}
    durationActive={'all'}
    handleLinkClick={handleClick}
    />);
  expect(getByText('Marktführender Zins!')).toBeInTheDocument();
  expect(getByText('12 Monate')).toBeInTheDocument();
});

const api = () => {
  const alpha_1y = [{
    abstractSortNumber: 120,
    maturityCode: "FIXED_1Y",
    maturityCodeTerm: "fixed",
    p: {
      currencyUnit: "EUR",
      cutOffAmount: null,
      depositType: "FIXED_TERM",
      description: null,
      endDate: "2019-04-01",
      infoProduct: null,
      interestBookingPeriod: "AFTER_TERM_END",
      interestCalculationMethod: "ENGLISH_ACT_365",
      interestRateOverTime: [{rate: 0.0116, validFrom: "2017-11-13"}],
      interestReinvestStrategy: null,
      marketingRank: 37,
      maturityCode: "FIXED_1Y",
      maxAmount: "100,000.00 EUR",
      minAmount: "1.00 EUR",
      payInCode: "AlphaFG12M",
      payInDeadline: "2018-03-28T02:00:00",
      productBankBic: "BUCUROBU",
      productBankUuid: "b7bbd76e-de2a-11e6-b6f9-000c29c84cff",
      productIdentifier: "BUCUROBU-FG12M-2018-04-03",
      productName: "",
      productSpecifier: null,
      productState: "CREATED",
      prolongationStrategy: "PROLONGATION",
      startDate: "2018-04-03",
      transactionDate: "2018-04-03T11:00:00",
      transitBankAccounts: [{}],
      upcomingStartDates: null,
      uuid: "caef9224-c88f-11e7-89f4-000c293bd496",
      viewState: "PUBLISHED",
    },
    pb: {
      bank: {bankSortCode: "", bic: "BUCUROBU"},
      description: "Die Alpha Bank Romania S.A. wurde im Jahr 1993 in Zusammenarbeit mit der Europäischen Bank für Wiederaufbau und Entwicklung als Banca Bucuresti S.A. gegründet. Sie zählt zu den acht größten Banken in Rumänien und ist als Universalbank mit über 130 Filialen und 1.842 Mitarbeitern ein stark im Privat- und Firmenkundengeschäft verankertes Kreditinstitut.",
      maxInvestmentAmount: "100,000.00 EUR",
      name: "Alpha Bank Romania S.A.",
    },
    pp: {
      descriptionHtml: {desc1: "100.000 € Einlagensicherung", desc2: "Bis zu 25 € Bonus", desc3: "Mindestanlage nur 1 €", bonusurl: "https://www.zinspilot.de/de/kontoaktivierungsbonus/"},
      duration: 12,
      imageSrc: "https://via.placeholder.com/120x53?logo=logo_alpha_bank_160x34.png",
      link: "/#alpha",
      productBankCountry: "Rumänien",
      showTooltip: "Einlagen sind pro Kunde bis 100.000 EUR zu 100 % abgesichert.",
      sortNumber: 120,
      specialAnnouncement: {value: "Marktführender Zins!"},
      urlAnlageangebot: "https://www.example.org?params=/product/details/BUCUROBU/FIXED_1Y",
    },
    productBankBic: "BUCUROBU",
    productBankName: "Alpha Bank Romania S.A.",
    rates: {rate: 0.0116, ratesClear: "1,16"},
    showAmountNote: "",
    showRatePreview: "",
    usp: [
      {startDate: "2018-04-03", rate: 0.0116}, 
      {startDate: "2018-04-16", rate: 0.0116},
    ],
  }]
  
  return alpha_1y
}