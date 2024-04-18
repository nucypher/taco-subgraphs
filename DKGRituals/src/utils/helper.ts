import { Bytes } from "@graphprotocol/graph-ts";
import {
  Ritual,
  RitualCounter,
  Transaction,
  Initiator,
} from "../../generated/schema";
import * as constants from "./constants";

export function getOrCreateTransaction(id: string): Transaction {
  let transaction = Transaction.load(id);
  if (transaction == null) {
    transaction = new Transaction(id);
    transaction.id = id;
  }
  return transaction as Transaction;
}

export function getOrCreateInitiator(id: Bytes): Initiator {
  let initiator = Initiator.load(id);
  if (!initiator) {
    initiator = new Initiator(id);
    initiator.rituals = [];
  }
  return initiator;
}

export function getOrCreateRitual(id: string): Ritual {
  let ritual = Ritual.load(id);
  if (!ritual) {
    ritual = new Ritual(id);
    ritual.initiator = constants.ADDRESS_ZERO;
    ritual.initTimestamp = constants.ZERO_BI;
    ritual.endTimestamp = constants.ZERO_BI;
    ritual.authority = constants.ADDRESS_ZERO;
    ritual.dkgSize = 0;
    ritual.threshold = 0;
    ritual.accessController = constants.ADDRESS_ZERO;
    ritual.participants = [];
    ritual.postedTranscriptsAmount = 0;
    ritual.postedTranscripts = [];
    ritual.postedAggregationsAmount = 0;
    ritual.postedAggregations = [];
    ritual.transactions = [];
    ritual.dkgStatus = "UNKNOWN";
  }
  return ritual;
}

export function getOrCreateRitualCounter(id: string): RitualCounter {
  let ritualCounter = RitualCounter.load(id);
  if (!ritualCounter) {
    ritualCounter = new RitualCounter(id);
    ritualCounter.total = 0;
    ritualCounter.successful = 0;
    ritualCounter.unsuccessful = 0;
    ritualCounter.notEnded = 0;
  }
  return ritualCounter;
}
