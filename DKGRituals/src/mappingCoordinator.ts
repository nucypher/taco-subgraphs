import { Bytes } from "@graphprotocol/graph-ts";
import {
  Coordinator,
  StartRitual as StartRitualEvent,
  TranscriptPosted as TranscriptPostedEvent,
  StartAggregationRound as StartAggregationRoundEvent,
  AggregationPosted as AggregationPostedEvent,
  EndRitual as EndRitualEvent,
  RitualAuthorityTransferred as RitualAuthorityTransferredEvent,
} from "../generated/Coordinator/Coordinator";
import {
  getOrCreateRitual,
  getOrCreateRitualCounter,
  getOrCreateTransaction,
  getOrCreateInitiator,
} from "./utils/helper";
import { RITUAL_COUNTER_ID } from "./utils/constants";
import { calculatePublicKey, getTransactionIDFromEvent } from "./utils/utils";

export function handleStartRitual(event: StartRitualEvent): void {
  const coordinatorContract = Coordinator.bind(event.address);
  const ritualInst = coordinatorContract.rituals(event.params.ritualId);

  const transaction = getOrCreateTransaction(getTransactionIDFromEvent(event));
  transaction.txHash = event.transaction.hash;
  transaction.timestamp = event.block.timestamp;
  transaction.from = event.transaction.from;
  transaction.to = event.transaction.to;
  transaction.description = "Start Ritual";
  transaction.save();

  const ritual = getOrCreateRitual(event.params.ritualId.toString());
  ritual.initiator = ritualInst.getInitiator();
  ritual.initTimestamp = ritualInst.getInitTimestamp();
  ritual.endTimestamp = ritualInst.getEndTimestamp();
  ritual.authority = event.params.authority;
  ritual.dkgSize = ritualInst.getDkgSize();
  ritual.threshold = ritualInst.getThreshold();
  ritual.accessController = ritualInst.getAccessController();
  ritual.participants = changetype<Bytes[]>(event.params.participants);
  ritual.dkgStatus = "DKG_AWAITING_TRANSCRIPTS";

  const transactions = ritual.transactions;
  transactions.push(transaction.id);
  ritual.transactions = transactions;
  ritual.save();

  const ritualCounter = getOrCreateRitualCounter(RITUAL_COUNTER_ID);
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
  const ritual = getOrCreateRitual(event.params.ritualId.toString());
  const postedTranscripts = ritual.postedTranscripts;
  postedTranscripts.push(event.params.node);
  ritual.postedTranscripts = postedTranscripts;
  ritual.totalPostedTranscripts = ritual.totalPostedTranscripts + 1;
  ritual.save();
}

export function handleStartAggregationRound(
  event: StartAggregationRoundEvent,
): void {
  const transaction = getOrCreateTransaction(getTransactionIDFromEvent(event));
  transaction.txHash = event.transaction.hash;
  transaction.timestamp = event.block.timestamp;
  transaction.from = event.transaction.from;
  transaction.to = event.transaction.to;
  transaction.description = "Posted Transcripts";
  transaction.save();

  const ritual = getOrCreateRitual(event.params.ritualId.toString());
  ritual.dkgStatus = "DKG_AWAITING_AGGREGATIONS";

  const transactions = ritual.transactions;
  transactions.push(transaction.id);
  ritual.transactions = transactions;
  ritual.save();
}

export function handleAggregationPosted(event: AggregationPostedEvent): void {
  const ritual = getOrCreateRitual(event.params.ritualId.toString());
  const postedAggregations = ritual.postedAggregations;
  postedAggregations.push(event.params.node);
  ritual.postedAggregations = postedAggregations;
  ritual.totalPostedAggregations = ritual.totalPostedAggregations + 1;
  ritual.save();
}

export function handleEndRitual(event: EndRitualEvent): void {
  const transaction = getOrCreateTransaction(getTransactionIDFromEvent(event));
  transaction.txHash = event.transaction.hash;
  transaction.timestamp = event.block.timestamp;
  transaction.from = event.transaction.from;
  transaction.to = event.transaction.to;
  transaction.description = "Posted Aggregations";
  transaction.save();

  const ritual = getOrCreateRitual(event.params.ritualId.toString());
  ritual.dkgStatus = event.params.successful ? "SUCCESSFUL" : "UNSUCCESSFUL";

  const ritualCounter = getOrCreateRitualCounter(RITUAL_COUNTER_ID);
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
  const ritual = getOrCreateRitual(event.params.ritualId.toString());
  ritual.authority = event.params.newAuthority;
  ritual.save();
}
