import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import {
  Released,
  ReleaseResent,
} from "../generated/TACoChildApplication/TACoChildApplication";

export function createReleasedEvent(stakingProvider: Address): Released {
  const releasedEvent = changetype<Released>(newMockEvent());

  releasedEvent.parameters = [];

  releasedEvent.parameters.push(
    new ethereum.EventParam(
      "stakingProvider",
      ethereum.Value.fromAddress(stakingProvider),
    ),
  );

  return releasedEvent;
}

export function createReleaseResentEvent(
  stakingProvider: Address,
): ReleaseResent {
  const releaseResentEvent = changetype<ReleaseResent>(newMockEvent());

  releaseResentEvent.parameters = [];

  releaseResentEvent.parameters.push(
    new ethereum.EventParam(
      "stakingProvider",
      ethereum.Value.fromAddress(stakingProvider),
    ),
  );

  return releaseResentEvent;
}
