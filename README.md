# ireland-data

Clean, dependency-free data about Ireland for developers:

- **32 counties**: English and Irish names, province, jurisdiction (ROI/NI), and whether each contains a Gaeltacht area
- **Bank holidays**: a calculator for any year from 2023, including St Brigid's Day and Easter, plus `nextBankHoliday()`
- Plain **JSON and CSV** files in [`data/`](data) if you don't use JavaScript

## Install

```bash
npm install ireland-data
```

## Usage

```ts
import { COUNTIES, findCounty, countiesByProvince, bankHolidays, nextBankHoliday, isBankHoliday } from "ireland-data";

findCounty("Co. Sligo");
// { name: "Sligo", irish: "Sligeach", province: "Connacht", jurisdiction: "ROI", gaeltacht: false }

countiesByProvince("Munster").map(c => c.name);
// ["Clare", "Cork", "Kerry", "Limerick", "Tipperary", "Waterford"]

nextBankHoliday();
// { date: "2026-12-25", name: "Christmas Day" }

bankHolidays(2027);   // all 10 public holidays for 2027
isBankHoliday(new Date("2026-03-17")); // true
```

## Raw data

| File | Contents |
|---|---|
| [`data/counties.json`](data/counties.json) | 32 counties |
| [`data/counties.csv`](data/counties.csv) | Same, as CSV |
| [`data/bank-holidays-2023-2035.csv`](data/bank-holidays-2023-2035.csv) | Precomputed public holidays |

## Notes on bank holidays

- These are Republic of Ireland public holidays. Northern Ireland follows UK rules.
- **St Brigid's Day** is the first Monday in February, or 1 February when that falls on a Friday.
- When a holiday falls on a weekend, there's no automatic substitute weekday in law. Dates returned are the statutory days, and employers often give the next working day.
- Ad-hoc holidays, like the one-off 2022 day, aren't included.

## Roadmap / contributions welcome

- Towns and their counties
- Gaeltacht areas at electoral-division level
- Eircode routing keys mapped to areas

## Development

```bash
npm install
npm test
npm run csv   # regenerate CSV files
```

## License

MIT © Seven O Ways
