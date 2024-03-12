import { Bytes } from "@graphprotocol/graph-ts";
import {
  Coordinator,
  StartRitual as StartRitualEvent,
  // EndRitual as EndRitualEvent,
} from "../generated/Coordinator/Coordinator";
import { Ritual } from "../generated/schema";

export function handleStartRitual(event: StartRitualEvent): void {
  const ritual = Coordinator.bind(event.address).rituals(event.params.ritualId);

  const entity = new Ritual(event.params.ritualId.toString());
  entity.initiator = ritual.getInitiator();
  entity.initTimestamp = ritual.getInitTimestamp();
  entity.endTimestamp = ritual.getEndTimestamp();
  entity.authority = event.params.authority;
  entity.dkgSize = ritual.getDkgSize();
  entity.threshold = ritual.getThreshold();
  entity.accessController = ritual.getAccessController();
  entity.participants = changetype<Bytes[]>(event.params.participants);
  entity.status = "DKG_AWAITING_TRANSCRIPTS";
  entity.save();
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
