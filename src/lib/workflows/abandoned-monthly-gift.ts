import { sleep } from "workflow";
import { monthlyAuthorizationMinutes } from "../donations";
import {
  flushDonationNotices,
  queueAbandonedMonthlyNotices,
} from "../server/donation-communications";

export async function checkAbandonedMonthlyGift(reference: string) {
  "use workflow";

  await sleep(`${monthlyAuthorizationMinutes}m`);
  for (let attempt = 0; attempt < 3; attempt++) {
    if (!(await sendAbandonmentNotice(reference))) return;
    if (attempt < 2) await sleep("16m");
  }
}

async function sendAbandonmentNotice(reference: string) {
  "use step";

  await queueAbandonedMonthlyNotices(reference);
  const { failed } = await flushDonationNotices(`wompi/${reference}/abandoned`);
  return failed > 0;
}
