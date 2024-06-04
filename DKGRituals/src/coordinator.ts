import { Bytes, log } from "@graphprotocol/graph-ts";
import {
  Coordinator,
  StartRitual as StartRitualEvent,
  TranscriptPosted as TranscriptPostedEvent,
  StartAggregationRound as StartAggregationRoundEvent,
  AggregationPosted as AggregationPostedEvent,
  EndRitual as EndRitualEvent,
  RitualAuthorityTransferred as RitualAuthorityTransferredEvent,
} from "../generated/Coordinator/Coordinator";
import { Ritual, Transaction } from "../generated/schema";
import { getOrCreateRitualCounter, getOrCreateInitiator } from "./utils/helper";
import * as constants from "./utils/constants";
import { calculatePublicKey, getTransactionIDFromEvent } from "./utils/utils";

export function handleStartRitual(event: StartRitualEvent): void {
  const coordinatorContract = Coordinator.bind(event.address);
  const ritualInst = coordinatorContract.rituals(event.params.ritualId);

  const transactionId = getTransactionIDFromEvent(event);
  const transaction = new Transaction(transactionId);
  transaction.txHash = event.transaction.hash;
  transaction.timestamp = event.block.timestamp;
  transaction.from = event.transaction.from;
  transaction.to = event.transaction.to;
  transaction.description = "Start Ritual";
  transaction.save();

  const ritual = new Ritual(event.params.ritualId.toString());
  ritual.initiator = ritualInst.getInitiator();
  ritual.initTimestamp = ritualInst.getInitTimestamp();
  ritual.endTimestamp = ritualInst.getEndTimestamp();
  ritual.authority = event.params.authority;
  ritual.dkgSize = ritualInst.getDkgSize();
  ritual.threshold = ritualInst.getThreshold();
  ritual.accessController = ritualInst.getAccessController();
  ritual.participants = changetype<Bytes[]>(event.params.participants);
  ritual.totalPostedTranscripts = 0;
  ritual.postedTranscripts = [];
  ritual.totalPostedAggregations = 0;
  ritual.postedAggregations = [];
  ritual.dkgStatus = "DKG_AWAITING_TRANSCRIPTS";
  ritual.transactions = [transaction.id];
  ritual.save();

  const ritualCounter = getOrCreateRitualCounter(constants.RITUAL_COUNTER_ID);
  ritualCounter.total = ritualCounter.total + 1;
  ritualCounter.notEnded = ritualCounter.notEnded + 1;
  ritualCounter.save();

  const initiator = getOrCreateInitiator(ritual.initiator);
  const rituals = initiator.rituals;
  rituals.push(ritual.id);
  initiator.rituals = rituals;
  initiator.save();
}

export function handleTranscriptPosted(event: TranscriptPostedEvent): void {
  const ritual = Ritual.load(event.params.ritualId.toString());
  if (!ritual) {
    log.error("Node {} posted a transcript for unknown ritual: {}", [
      event.params.node.toHexString(),
      event.params.ritualId.toString(),
    ]);
    return;
  }
  const postedTranscripts = ritual.postedTranscripts;
  postedTranscripts.push(event.params.node);
  ritual.postedTranscripts = postedTranscripts;
  ritual.totalPostedTranscripts = ritual.totalPostedTranscripts + 1;
  ritual.save();
}

export function handleStartAggregationRound(
  event: StartAggregationRoundEvent,
): void {
  const transactionId = getTransactionIDFromEvent(event);
  const transaction = new Transaction(transactionId);
  transaction.txHash = event.transaction.hash;
  transaction.timestamp = event.block.timestamp;
  transaction.from = event.transaction.from;
  transaction.to = event.transaction.to;
  transaction.description = "Posted Transcripts";
  transaction.save();

  const ritual = Ritual.load(event.params.ritualId.toString());
  if (!ritual) {
    log.error("Received StartAggregationRound event for unknown ritual", []);
    return;
  }
  ritual.dkgStatus = "DKG_AWAITING_AGGREGATIONS";

  const transactions = ritual.transactions;
  transactions.push(transaction.id);
  ritual.transactions = transactions;
  ritual.save();
}

export function handleAggregationPosted(event: AggregationPostedEvent): void {
  const ritual = Ritual.load(event.params.ritualId.toString());
  if (!ritual) {
    log.error("Node {} posted an aggregation for unknown ritual: {}", [
      event.params.node.toHexString(),
      event.params.ritualId.toString(),
    ]);
    return;
  }
  const postedAggregations = ritual.postedAggregations;
  postedAggregations.push(event.params.node);
  ritual.postedAggregations = postedAggregations;
  ritual.totalPostedAggregations = ritual.totalPostedAggregations + 1;
  ritual.save();
}

export function handleEndRitual(event: EndRitualEvent): void {
  const transactionId = getTransactionIDFromEvent(event);
  const transaction = new Transaction(transactionId);
  transaction.txHash = event.transaction.hash;
  transaction.timestamp = event.block.timestamp;
  transaction.from = event.transaction.from;
  transaction.to = event.transaction.to;
  transaction.description = "Posted Aggregations";
  transaction.save();

  const ritual = Ritual.load(event.params.ritualId.toString());
  if (!ritual) {
    log.error("Received EndRitual event for unknown ritual {}", [
      event.params.ritualId.toString(),
    ]);
    return;
  }
  ritual.dkgStatus = event.params.successful ? "SUCCESSFUL" : "UNSUCCESSFUL";

  const ritualCounter = getOrCreateRitualCounter(constants.RITUAL_COUNTER_ID);
  ritualCounter.notEnded = ritualCounter.notEnded - 1;
  if (event.params.successful) {
    const coordinatorContract = Coordinator.bind(event.address);
    const publicKey = coordinatorContract.getPublicKeyFromRitualId(
      event.params.ritualId,
    );
    ritual.publicKey = calculatePublicKey(publicKey);
    ritualCounter.successful = ritualCounter.successful + 1;
  } else {
    ritualCounter.unsuccessful = ritualCounter.unsuccessful + 1;
  }

  const transactions = ritual.transactions;
  transactions.push(transaction.id);
  ritual.transactions = transactions;
  ritual.save();
  ritualCounter.save();
}

export function handleRitualAuthorityTransferred(
  event: RitualAuthorityTransferredEvent,
): void {
  const ritual = Ritual.load(event.params.ritualId.toString());
  if (!ritual) {
    log.error(
      "Received RitualAuthorityTransferred event for unknown ritual {}",
      [event.params.ritualId.toString()],
    );
    return;
  }
  ritual.authority = event.params.newAuthority;
  ritual.save();
}
