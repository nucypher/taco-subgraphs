import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";

export const RITUAL_COUNTER_ID = "Counter";
export const ADDRESS_ZERO = Address.fromString(
  "0x0000000000000000000000000000000000000000",
);
export const COORDINATOR_CONTRACT = Address.fromString(
  "0xE74259e3dafe30bAA8700238e324b47aC98FE755",
);

export const MAX_REDEMPTIONS_COUNT = 1000;
export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const ZERO_BD = BigDecimal.fromString("0");
export const ONE_BD = BigDecimal.fromString("1");
export const BI_18 = BigInt.fromI32(18);
export const SATOSHI_MULTIPLIER = BigInt.fromI64(10000000000);
