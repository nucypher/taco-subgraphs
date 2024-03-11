import { Bytes, log } from "@graphprotocol/graph-ts";
import {
  StartRitual as StartRitualEvent,
  EndRitual as EndRitualEvent,
} from "../generated/Coordinator/Coordinator";
import { Ritual } from "../generated/schema";

export function handleStartRitual(event: StartRitualEvent): void {
  let entity = new Ritual(event.params.ritualId.toString());
  entity.authority = event.params.authority;
  entity.participants = changetype<Bytes[]>(event.params.participants);
  entity.status = "Started";
  entity.startTime = event.block.timestamp;
  entity.save();
}

export function handleEndRitual(event: EndRitualEvent): void {
  const ritualId = event.params.ritualId.toString();
  let entity = Ritual.load(ritualId);
  if (!entity) {
    log.warning("Received EndRitual of unknown ritual ID: {}", [ritualId]);
    entity = new Ritual(ritualId);
  }
  entity.endTime = event.block.timestamp;
  entity.status = event.params.successful
    ? "SuccessfullyEnded"
    : "UnsuccessfullyEnded";
}
