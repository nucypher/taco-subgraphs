import { Bytes } from "@graphprotocol/graph-ts";
import { RitualCounter, Initiator } from "../../generated/schema";

export function getOrCreateInitiator(id: Bytes): Initiator {
  let initiator = Initiator.load(id);
  if (!initiator) {
    initiator = new Initiator(id);
    initiator.rituals = [];
  }
  return initiator;
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
