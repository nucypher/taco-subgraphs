import { log } from "@graphprotocol/graph-ts";
import {
  Released as ReleasedEvent,
  ReleaseResent as ReleaseResentEvent,
} from "../generated/TACoChildApplication/TACoChildApplication";
import { Released } from "../generated/schema";

export function handleReleased(event: ReleasedEvent): void {
  const stakingProvider = event.params.stakingProvider;
  const txSender = event.transaction.from;

  const entity = new Released(stakingProvider.toHexString());

  entity.releaseResent = false;
  entity.releaseBlockNumber = event.block.number;
  entity.releaseBlockTimestamp = event.block.timestamp;
  entity.releaseTransactionHash = event.transaction.hash;
  entity.releaseTxSender = txSender;
  entity.save();
}

export function handleReleaseResent(event: ReleaseResentEvent): void {
  const stakingProvider = event.params.stakingProvider;
  const txSender = event.transaction.from;

  const entity = Released.load(stakingProvider.toHexString());
  if (!entity) {
    log.error("Received ReleaseResent event for unknown staking provider {}", [
      stakingProvider.toHexString(),
    ]);
    return;
  }

  entity.releaseResent = true;
  entity.releaseResentBlockNumber = event.block.number;
  entity.releaseResentTimestamp = event.block.timestamp;
  entity.releaseResentTransactionHash = event.transaction.hash;
  entity.releaseResentTxSender = txSender;
  entity.save();
}
