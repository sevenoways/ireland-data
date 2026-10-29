// Regenerates data/*.csv from the JSON sources.
import { writeFileSync } from "node:fs";
import { COUNTIES, bankHolidays } from "../src/index.ts";

const counties = [
  "name,irish,province,jurisdiction,gaeltacht",
  ...COUNTIES.map((c) => [c.name, c.irish, c.province, c.jurisdiction, c.gaeltacht].join(",")),
];
writeFileSync("data/counties.csv", counties.join("\n") + "\n");

const holidays = ["date,name"];
for (let y = 2023; y <= 2035; y++) {
  for (const h of bankHolidays(y)) holidays.push(`${h.date},${h.name}`);
}
writeFileSync("data/bank-holidays-2023-2035.csv", holidays.join("\n") + "\n");
