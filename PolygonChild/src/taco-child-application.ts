import { Released as ReleasedEvent } from "../generated/TACoChildApplication/TACoChildApplication";
import { Released } from "../generated/schema";

export function handleReleased(event: ReleasedEvent): void {
  const stakingProvider = event.params.stakingProvider;

  const entity = new Released(stakingProvider.toHexString());

  entity.releaseResent = false;
  entity.releaseBlockNumber = event.block.number;
  entity.releaseBlockTimestamp = event.block.timestamp;
  entity.releaseTransactionHash = event.transaction.hash;

  entity.save();
}
