import { Bytes } from "@graphprotocol/graph-ts";
import {
  Coordinator,
  StartRitual as StartRitualEvent,
  // EndRitual as EndRitualEvent,
} from "../generated/Coordinator/Coordinator";
import { Ritual, RitualCounter } from "../generated/schema";

export function handleStartRitual(event: StartRitualEvent): void {
  const ritualInst = Coordinator.bind(event.address).rituals(
    event.params.ritualId,
  );

  const ritual = new Ritual(event.params.ritualId.toString());
  ritual.initiator = ritualInst.getInitiator();
  ritual.initTimestamp = ritualInst.getInitTimestamp();
  ritual.endTimestamp = ritualInst.getEndTimestamp();
  ritual.authority = event.params.authority;
  ritual.dkgSize = ritualInst.getDkgSize();
  ritual.threshold = ritualInst.getThreshold();
  ritual.accessController = ritualInst.getAccessController();
  ritual.participants = changetype<Bytes[]>(event.params.participants);
  ritual.status = "DKG_AWAITING_TRANSCRIPTS";
  ritual.save();

  let ritualCounter = RitualCounter.load("Counter");
  if (!ritualCounter) {
    ritualCounter = new RitualCounter("Counter");
    ritualCounter.total = 0;
    ritualCounter.active = 0;
  }

  ritualCounter.total = ritualCounter.total + 1;
  ritualCounter.save();
}

// export function handleEndRitual(event: EndRitualEvent): void {
// const ritualId = event.params.ritualId.toString();
// let entity = Ritual.load(ritualId);
// if (!entity) {
//   log.warning("Received EndRitual of unknown ritual ID: {}", [ritualId]);
//   entity = new Ritual(ritualId);
// }
// entity.endTime = event.block.timestamp;
// // entity.status = event.params.successful
// //   ? "SuccessfullyEnded"
// //   : "UnsuccessfullyEnded";
// entity.save();
// }
