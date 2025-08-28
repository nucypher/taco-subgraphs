import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import { Released } from "../generated/TACoChildApplication/TACoChildApplication";

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
