import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeChangeSetCommandInput } from "../commands/DescribeChangeSetCommand";
/**
 * Wait until change set status is CREATE_COMPLETE.
 *  @deprecated Use waitUntilChangeSetCreateComplete instead. waitForChangeSetCreateComplete does not throw error in non-success cases.
 */
export declare const waitForChangeSetCreateComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeChangeSetCommandInput) => Promise<WaiterResult>;
/**
 * Wait until change set status is CREATE_COMPLETE.
 *  @param params - Waiter configuration options.
 *  @param input - The input to DescribeChangeSetCommand for polling.
 */
export declare const waitUntilChangeSetCreateComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeChangeSetCommandInput) => Promise<WaiterResult>;
