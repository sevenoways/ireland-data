import { test } from "node:test";
import assert from "node:assert/strict";
import * as d from "../src/index.ts";

test("counties", () => {
  assert.equal(d.COUNTIES.length, 32);
  assert.equal(d.COUNTIES.filter((c) => c.jurisdiction === "ROI").length, 26);
  assert.equal(d.countiesByProvince("Connacht").length, 5);
  assert.equal(d.findCounty("Co. Sligo")?.irish, "Sligeach");
  assert.equal(d.findCounty("gaillimh")?.name, "Galway");
});

test("bank holidays 2026", () => {
  assert.deepEqual(
    d.bankHolidays(2026).map((h) => h.date),
    [
      "2026-01-01", "2026-02-02", "2026-03-17", "2026-04-06", "2026-05-04",
      "2026-06-01", "2026-08-03", "2026-10-26", "2026-12-25", "2026-12-26",
    ],
  );
});

test("St Brigid's Day falls on Feb 1 when it is a Friday", () => {
  // Feb 1 2030 is a Friday
  assert.equal(d.bankHolidays(2030)[1]!.date, "2030-02-01");
});

test("nextBankHoliday", () => {
  assert.equal(d.nextBankHoliday(new Date("2026-10-29T12:00:00Z")).name, "Christmas Day");
  assert.equal(d.nextBankHoliday(new Date("2026-12-27T00:00:00Z")).date, "2027-01-01");
  assert.ok(d.isBankHoliday(new Date("2026-03-17T09:00:00Z")));
});
